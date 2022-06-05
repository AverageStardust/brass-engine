import p5 from "p5";
import { createFastGraphics, expect } from "./common";



export type P5DrawTargetLayer = p5.Graphics | p5;



let inited = false;
let defaultDrawTarget: DrawTargetAbstract;
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
        defaultDrawTarget = new P5DrawTarget(width, height, 1, globalThis as unknown as p5);
    } else if (drawTarget instanceof DrawTargetAbstract) {
        defaultDrawTarget = drawTarget;
    } else {
        defaultDrawTarget = new P5DrawTarget(drawTarget.width, drawTarget.height, 1, drawTarget);
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
    for (const drawTarget of drawTargetList) {
        drawTarget.scaleTo(width, height);
        drawTarget.resize(width, height);
    }
}

export abstract class DrawTargetAbstract {
    readonly scale: number | null;
    protected width!: number;
    protected height!: number;

    constructor(width: number, height: number, scale: number | null = null) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        drawTargetList.push(this);
    }

    scaleTo(width: number, height: number) {
        if (this.scale === null) return;
        this.width = width * this.scale;
        this.width = height * this.scale;
        this.resize(this.width, this.height);
    }

    abstract resize(width: number, height: number): void;
    abstract getP5Albedo(): P5DrawTargetLayer;
    abstract getRawAlbedo(): HTMLCanvasElement;
}

export class P5DrawTarget extends DrawTargetAbstract {
    private albedo: P5DrawTargetLayer;

    constructor(width: number, height: number, scale: number | null = null, albedo?: P5DrawTargetLayer) {
        if (albedo) {
            super(width, height, scale);
            expect(albedo.width === width);
            expect(albedo.height === height);
            this.albedo = albedo;
        } else {
            super(width, height, scale);
            this.albedo = createFastGraphics(width, height);
        }
    }

    resize(width: number, height: number) {
        this.albedo.resizeCanvas(width, height, true);
    }

    getP5Albedo() { return this.albedo; }
    // @ts-ignore because while undocumented this value should exist
    getRawAlbedo() { return this.albedo.canvas; }
}