import p5 from "p5";
import REGL from "./regl";
import { assert, createFastGraphics } from "./common";
import { Vertex2 } from "./vector3";



// these would both have canvas properties anyway, for some reason they were not in the typing
export type P5DrawTargetMap = (p5.Graphics | p5);



let drawTargets: Map<string, DrawTarget<any>> = new Map();
let _regl: REGL.Regl | null = null;
let doReglRefresh = false;



export function init(sketch: p5, doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<any>) {
    let defaultDrawTarget: DrawTarget<any> | undefined;
    let defaultP5DrawTarget: P5DrawTarget | undefined;
    let defaultReglDrawTarget: ReglDrawTarget | undefined;

    if (drawTarget === undefined) {
        createCanvas(windowWidth, windowHeight);

        defaultDrawTarget = new P5DrawTarget(
            () => ({
                x: sketch.width,
                y: sketch.height
            }), sketch);
        defaultP5DrawTarget = defaultDrawTarget;
    } else if (drawTarget instanceof DrawTarget) {
        defaultDrawTarget = drawTarget;
        if (defaultDrawTarget instanceof P5DrawTarget) {
            defaultP5DrawTarget = defaultDrawTarget;
        }
        if (defaultDrawTarget instanceof ReglDrawTarget) {
            defaultReglDrawTarget = defaultDrawTarget;
        }
        // @ts-ignore p5.Graphics has bad typings
    } else if (drawTarget instanceof p5.Graphics) {
        defaultDrawTarget = new P5DrawTarget(
            () => ({
                x: drawTarget.width,
                y: drawTarget.height
            }),
            drawTarget);
        defaultP5DrawTarget = defaultDrawTarget;
    } else {
        throw Error("Can't make default drawTarget in Brass.init(), bad value");
    }

    if (!defaultDrawTarget) return;

    setDrawTarget("default", defaultDrawTarget);
    if (doRegl && defaultDrawTarget instanceof ReglDrawTarget) {
        console.warn("Found a ReglDrawTarget as default in Brass.init() but regl is not enabled");
    }

    if (!defaultP5DrawTarget) {
        defaultP5DrawTarget = new P5DrawTarget();
    }
    setDrawTarget("defaultP5", defaultP5DrawTarget);

    if (doRegl) {
        if (!defaultReglDrawTarget) {
            defaultReglDrawTarget = new ReglDrawTarget();
        }
        setDrawTarget("defaultRegl", defaultReglDrawTarget);

        const reglDrawTarget = getReglDrawTarget("defaultRegl");
        _regl = createREGL({ canvas: reglDrawTarget.maps.canvas });
    }
}

export function setDrawTarget(name: string, drawTarget: DrawTarget<any>) {
    if (drawTargets.has(name)) {
        throw Error(`Can't overwrite (${name}) DrawTarget`);
    }
    drawTargets.set(name, drawTarget);
}

export function getDrawTarget(name: string): DrawTarget<any> {
    const drawTarget = drawTargets.get(name);
    if (drawTarget === undefined) {
        throw Error(`Could not find (${name}) DrawTarget; Maybe create one or run Brass.init() with drawTarget enabled`);
    }
    return drawTarget;
}

export const hasDrawTarget = drawTargets.has;

export function getP5DrawTarget(name: string): P5DrawTarget {
    const drawTarget = getDrawTarget(name);
    if (!(drawTarget instanceof P5DrawTarget)) {
        throw Error(`Could not find (${name}) P5DrawTarget; DrawTarget under that name is not of subclass P5DrawTarget`);
    }
    return drawTarget;
}

export function getReglDrawTarget(name: string): ReglDrawTarget {
    const drawTarget = getDrawTarget(name);
    if (!(drawTarget instanceof ReglDrawTarget)) {
        throw Error(`Could not find (${name}) ReglDrawTarget; DrawTarget under that name is not of subclass ReglDrawTarget`);
    }
    return drawTarget;
}

export function resize(width = window.innerWidth, height = window.innerHeight) {
    getDrawTarget("default").setSizer(() => ({ x: width, y: height }));
    honorReglRefresh();
}

export function getRegl(): REGL.Regl {
    assert(_regl !== null,
        "Could not access regl; Include regl.js and enable it in Brass.init() first");
    return _regl;
}

export function refreshRegl() {
    const regl = getRegl();
    regl._refresh();
}

export function refreshReglFast() {
    getRegl(); // check regl is enabled
    if (doReglRefresh) return;
    doReglRefresh = true;
    queueMicrotask(honorReglRefresh);
}

function honorReglRefresh() {
    if (!doReglRefresh) return;
    const regl = getRegl();
    regl._refresh();
    doReglRefresh = false;
}

export function displayRegl(g = getP5DrawTarget("defaultP5").maps.canvas) {
    getRegl(); // check regl is enabled
    const reglCanvas = getReglDrawTarget("defaultRegl").maps.canvas;
    g.drawingContext.drawImage(reglCanvas, 0, 0, g.width, g.height);
}

export class DrawTarget<T extends { [key: string]: any }> {
    private id = Symbol();
    private size: Vertex2;
    private sizer: () => Vertex2;
    private readonly creator: (size: Vertex2) => T;
    private readonly resizer: (size: Vertex2, oldMaps: T) => T;
    maps!: T;

    constructor(
        creator: (size: Vertex2) => T,
        resizer: (size: Vertex2, oldMaps: T) => T = creator,
        sizer: () => Vertex2 = defaultMatchSizer) {

        this.sizer = sizer;
        this.creator = creator;
        this.resizer = resizer;

        this.size = this.getSizerResult();
        this.setMaps(this.creator(this.size))
    }

    setSizer(sizer: () => Vertex2) {
        this.sizer = sizer;
        this.refresh();
    }

    getSize(ratio = 1) {
        return {
            x: this.size.x * ratio,
            y: this.size.y * ratio
        }
    }

    refresh(causes: Symbol[] = []) {
        const size = this.getSizerResult();
        if (this.size.x === size.x && this.size.y === size.y) return;

        for (const cause of causes) {
            if (cause !== this.id) continue;
            throw Error("Resize of DrawTarget caused itself to resize; Loop in sizer dependency chain");
        }

        this.size = size;
        this.maps = this.resizer(this.size, this.maps);

        for (const drawTarget of drawTargets.values()) {
            if (drawTarget.id === this.id) continue;
            drawTarget.refresh(causes.concat(this.id));
        }
    }

    private getSizerResult(): Vertex2 {
        const floatSize = this.sizer();
        return {
            x: Math.floor(floatSize.x),
            y: Math.floor(floatSize.y)
        }
    }

    private setMaps(maps: T) {
        this.maps = new Proxy(maps, { get: this.getMap.bind(this) });
    }

    private getMap(maps: T, mapName: string) {
        if (!maps.hasOwnProperty(mapName)) {
            throw Error(`Can't get (${mapName}) map in DrawTarget`);
        }
        return maps[mapName];
    }
}

export class P5DrawTarget extends DrawTarget<{ canvas: P5DrawTargetMap }> {
    constructor(sizer: () => Vertex2 = defaultMatchSizer, canvas?: P5DrawTargetMap) {
        super(
            ({ x, y }) => {
                if (canvas) {
                    if (canvas.width !== x || canvas.height !== y) {
                        throw Error("P5DrawTarget found inital albedo map was of the wrong size");
                    }
                    return { canvas };
                } else {
                    return { canvas: createFastGraphics(x, y) }
                }
            },
            ({ x, y }, { canvas }) => {
                canvas.resizeCanvas(x, y, true);
                return { canvas };
            },
            sizer
        );
    }
}

export class ReglDrawTarget extends DrawTarget<{ canvas: HTMLCanvasElement }> {
    constructor(sizer: () => Vertex2 = defaultMatchSizer) {
        super(
            ({ x, y }) => {
                const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
                canvas.width = x;
                canvas.height = y;
                return { canvas };
            },
            ({ x, y }, { canvas }) => {
                canvas.width = x;
                canvas.height = y;
                refreshReglFast();
                return { canvas };
            },
            sizer
        );
    }
}

function defaultMatchSizer() {
    return getP5DrawTarget("default").getSize();
}