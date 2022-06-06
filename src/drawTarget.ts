import p5 from "p5";
import { createFastGraphics } from "./common";
import { Vertex2 } from "./vector3";



// these would both have canvas properties anyway, for some reason they were not in the typing
export type P5DrawTargetMap = (p5.Graphics | p5);



let defaultDrawTarget: DrawTarget<{ [key: string]: P5DrawTargetMap }>;



export function init(drawTarget?: p5.Graphics) {
    if (drawTarget === undefined) {
        if (!("p5" in globalThis)) {
            throw Error("Failed to find draw target because p5 is not loaded");
        }
        if (!("createCanvas" in globalThis)) {
            throw Error("Failed to find draw target because p5 is not in global mode");
        }
        if (!("setup" in globalThis)) {
            throw Error("Failed to find draw target because p5 does not seem to be running in global mode; if it is create an empty global setup function");
        }
        createCanvas(windowWidth, windowHeight);

        // really fighting the type system lol
        defaultDrawTarget = new P5DrawTarget(
            () => ({
                x: (globalThis as unknown as p5).width,
                y: (globalThis as unknown as p5).height
            }),
            globalThis as unknown as p5) as
            unknown as DrawTarget<{ [key: string]: P5DrawTargetMap }>;
    } else {
        // still really fighting the type system lol
        defaultDrawTarget = new P5DrawTarget(
            () => ({
                x: drawTarget.width,
                y: drawTarget.height
            }),
            drawTarget) as
            unknown as DrawTarget<{ [key: string]: P5DrawTargetMap }>;
    }
}

export function setDefaultDrawTarget(drawTarget: DrawTarget<{ [key: string]: P5DrawTargetMap }>) {
    defaultDrawTarget = drawTarget;
}

export function getDefaultDrawTarget() {
    if (defaultDrawTarget === undefined) throw Error("Could not find default draw target; maybe run Brass.init() first");
    return defaultDrawTarget;
}

export function resize(width = window.innerWidth, height = window.innerHeight) {
    defaultDrawTarget.setSizer(() => ({ x: width, y: height }));
}

export class DrawTarget<T extends { [key: string]: any }> {
    private size: Vertex2;
    private sizer: () => Vertex2;
    private readonly creator: (size: Vertex2) => T;
    private readonly resizer: (size: Vertex2, oldMaps: T) => T;
    maps!: T;

    constructor(
        sizer: () => Vertex2,
        creator: (size: Vertex2) => T,
        resizer: (size: Vertex2, oldMaps: T) => T = creator) {
        this.sizer = sizer;
        this.creator = creator;
        this.resizer = resizer;

        this.size = this.sizer();
        this.setMaps(this.creator(this.size))
    }

    setSizer(sizer: () => Vertex2) {
        this.sizer = sizer;
        this.refresh();
    }

    private refresh() {
        const size = this.sizer();
        if (this.size.x === size.x && this.size.y === size.y) return;

        this.size = size;
        this.maps = this.resizer(this.size, this.maps);
    }

    private setMaps(maps: T) {
        this.maps = new Proxy(maps, { get: this.getMap.bind(this) });
    }

    private getMap(maps: T, mapName: string) {
        if (maps.hasOwnProperty(mapName)) {
            this.refresh();
            return maps[mapName];
        } else {
            throw Error(`Can't get (${mapName}) map in DrawTarget`);
        }
    }
}

export class P5DrawTarget extends DrawTarget<{ albedo: P5DrawTargetMap }> {
    constructor(sizer: () => Vertex2, albedo?: P5DrawTargetMap) {
        super(
            sizer,
            ({ x, y }) => {
                if (albedo) {
                    if (albedo.width !== x || albedo.height !== y) {
                        throw Error("P5DrawTarget found inital albedo map was of the wrong size");
                    }
                    return { albedo: albedo };
                } else {
                    return { albedo: createFastGraphics(x, y) }
                }
            },
            ({ x, y }, { albedo }) => {
                albedo.resizeCanvas(x, y, true);
                return { albedo };
            }
        );
    }
}