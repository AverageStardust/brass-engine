import p5 from "p5";
import { createFastGraphics, domCanvasToP5Canvas, expect } from "./common";



export type P5DrawTargetLayer = p5.Graphics | p5;



let inited = false;
let defaultDrawTarget: DrawTargetAbstract;
let screenWidth: number, screenHeight: number;
const drawTargetList: DrawTargetAbstract[] = [];



export function init(drawTarget?: DrawTargetAbstract | p5.Graphics) {
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
        screenWidth = width;
        screenHeight = height;
        defaultDrawTarget = new P5DrawTarget(1, globalThis as unknown as p5);
    } else if (drawTarget instanceof DrawTargetAbstract) {
        screenWidth = drawTarget.width;
        screenHeight = drawTarget.height;
        defaultDrawTarget = drawTarget;
    } else {
        screenWidth = drawTarget.width;
        screenHeight = drawTarget.height;
        defaultDrawTarget = new P5DrawTarget(1, drawTarget);
    }

    inited = true;
}

export function setDefaultDrawTarget(drawTarget: DrawTargetAbstract) {
    defaultDrawTarget = drawTarget;
}

export function getDefaultDrawTarget() {
    if (defaultDrawTarget === undefined) throw Error("Could not find default draw target; maybe run Brass.init() first");
    return defaultDrawTarget;
}

export function resize(width: number, height: number) {
    screenWidth = width;
    screenHeight = height;
    for (const drawTarget of drawTargetList) {
        drawTarget.scaleTo(screenWidth, screenHeight);
    }
}

export abstract class DrawTargetAbstract {
    width!: number;
    height!: number;
    scale: null | number = null;

    constructor(...args: [number] | [number, number]) {
        if (args.length === 1) {
            this.width = screenWidth * args[0];
            this.height = screenHeight * args[0];
            this.scale = args[0];
        } else {
            this.width = args[0];
            this.height = args[1];
        }
        drawTargetList.push(this);
    }

    scaleTo(width: number, height: number) {
        if (this.scale === null) return;
        this.resize(width * this.scale, height * this.scale);
    }

    abstract resize(width: number, height: number): void;
    abstract getP5Albedo(): P5DrawTargetLayer;
    abstract getP5Normal(): P5DrawTargetLayer;
    abstract getRawAlbedo(): HTMLCanvasElement;
    abstract getRawNormal(): HTMLCanvasElement;
}

export class P5DrawTarget extends DrawTargetAbstract {
    private albedo: P5DrawTargetLayer;

    constructor(...args: [number] | [number, number] | [number, P5DrawTargetLayer] | [number, number, P5DrawTargetLayer]) {
        let albedo: P5DrawTargetLayer | undefined;
        if (typeof args[args.length - 1] !== "number") {
            albedo = args.pop() as P5DrawTargetLayer;
        }
        
        super(...(args as unknown as [number] | [number, number]));
        
        if (albedo) {
            expect(albedo.width === this.width);
            expect(albedo.height === this.height);
            this.albedo = albedo;
        } else {
            this.albedo = createFastGraphics(this.width, this.height);
        }
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.albedo.resizeCanvas(width, height, true);
    }

    getP5Albedo() { return this.albedo; }
    getP5Normal(): any { throw Error("P5DrawTarget does not have a normal map"); }
    // @ts-ignore because while undocumented this value should exist
    getRawAlbedo() { return this.albedo.canvas; }
    getRawNormal(): any { throw Error("P5DrawTarget does not have a normal map"); }
}

export class ReglDrawTarget extends DrawTargetAbstract {
    private albedo: HTMLCanvasElement;
    private normal: HTMLCanvasElement;
    private p5Albedo?: p5.Graphics;
    private p5Normal?: p5.Graphics;

    constructor(...args: [number] | [number, number]) {
        super(...args);
        this.albedo = document.createElement("CANVAS") as HTMLCanvasElement;
        this.albedo.width = this.width;
        this.albedo.height = this.height;
        this.normal = document.createElement("CANVAS") as HTMLCanvasElement;
        this.normal.width = this.width;
        this.normal.height = this.height;
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.albedo.width = width;
        this.albedo.height = height;
        if (this.p5Albedo) {
            this.p5Albedo.width = width;
            this.p5Albedo.height = height;
        }

        this.normal.width = width;
        this.normal.height = height;
        if (this.p5Normal) {
            this.p5Normal.width = width;
            this.p5Normal.height = height;
        }
    }

    getP5Albedo() {
        if (this.p5Albedo) return this.p5Albedo;
        this.p5Albedo = domCanvasToP5Canvas(this.albedo);
        return this.p5Albedo;
    }
    getP5Normal() {
        if (this.p5Normal) return this.p5Normal;
        this.p5Normal = domCanvasToP5Canvas(this.normal);
        return this.p5Normal;
    }
    getRawAlbedo() { return this.albedo; }
    getRawNormal() { return this.normal; }
}