/**
 * Very flexible targets for drawing operations.
 * Useable with both p5.js and REGL graphics.
 * @module
 */

import p5 from "p5";
import REGL from "../types/regl";
import { assert, createFastGraphics } from "./common";
import { Vertex2 } from "./vector3";



// these would both have canvas properties anyway, for some reason they were not in the typing
export type P5DrawSurfaceMap = (p5.Graphics | p5);
export type P5DrawSurface = DrawSurfaceAbstract<{ canvas: P5DrawSurfaceMap }>;



let drawTargets: Map<string, DrawTarget<any>> = new Map();
let _regl: REGL.Regl | null = null;
let doReglRefresh = false;



export function init(sketch: p5, doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<any>) {
	let defaultDrawTarget: DrawTarget<any> | undefined;
	let defaultP5DrawTarget: P5DrawTarget | undefined;
	let defaultCanvasDrawTarget: CanvasDrawTarget | undefined;

	if (drawTarget === undefined) {
		sketch.createCanvas(windowWidth, windowHeight);

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
		if (defaultDrawTarget instanceof CanvasDrawTarget) {
			defaultCanvasDrawTarget = defaultDrawTarget;
		}
		// @ts-ignore because p5.Graphics is typed wrong
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
	if (doRegl && defaultDrawTarget instanceof CanvasDrawTarget) {
		console.warn("Found a CanvasDrawTarget as default in Brass.init() but regl is not enabled");
	}

	if (!defaultP5DrawTarget) {
		defaultP5DrawTarget = new P5DrawTarget();
	}
	setDrawTarget("defaultP5", defaultP5DrawTarget);

	if (doRegl) {
		if (!defaultCanvasDrawTarget) {
			defaultCanvasDrawTarget = new CanvasDrawTarget();
		}
		setDrawTarget("defaultRegl", defaultCanvasDrawTarget);

		const canvas = getCanvasDrawTarget("defaultRegl").getMaps().canvas;
		_regl = createREGL({ canvas });
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

export function getCanvasDrawTarget(name: string): CanvasDrawTarget {
	const drawTarget = getDrawTarget(name);
	if (!(drawTarget instanceof CanvasDrawTarget)) {
		throw Error(`Could not find (${name}) CanvasDrawTarget; DrawTarget under that name is not of subclass CanvasDrawTarget`);
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

export function displayRegl(d = getP5DrawTarget("defaultP5")) {
	getRegl(); // check regl is enabled
	const p5Canvas = d.getMaps().canvas;
	const reglCanvas = getCanvasDrawTarget("defaultRegl").getMaps().canvas;
	p5Canvas.drawingContext.drawImage(reglCanvas, 0, 0, p5Canvas.width, p5Canvas.height);
}

export abstract class DrawSurfaceAbstract<T extends { [key: string]: any }> {
	protected abstract size: Vertex2 | null;
	protected readonly creator: (size: Vertex2) => T;
	protected readonly resizer: (size: Vertex2, oldMaps: T) => T;
	protected maps!: T;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator) {

		this.creator = creator;
		this.resizer = resizer;

		this.setMaps(null);
	}

	hasSize() {
		return this.size !== null;
	}

	getSize(ratio = 1) {
		if (this.size === null) this.throwSizeError();
		return {
			x: this.size.x * ratio,
			y: this.size.y * ratio
		}
	}

	abstract getMaps(size?: Vertex2): T;

	sizeMaps(size: Vertex2) {
		if (this.size === null) {
			this.setMaps(this.creator(size));
		} else {
			if (this.size.x === size.x &&
				this.size.y === size.y) return;
			this.setMaps(this.resizer(size, this.maps));
		}
		this.size = size;
	}

	protected setMaps(maps: T | null) {
		if (maps === null) {
			this.maps === new Proxy({}, { get: this.throwSizeError });
		} else {
			this.maps = new Proxy(maps, { get: this.getMap.bind(this) });
		}
	}

	private getMap(maps: T, mapName: string) {
		if (!maps.hasOwnProperty(mapName)) {
			throw Error(`Can't get (${mapName}) map in DrawTarget`);
		}
		return maps[mapName];
	}

	protected throwSizeError(): never {
		throw Error("Could not use DrawSurface, size has not been set");
	}
}

export class DrawBuffer<T> extends DrawSurfaceAbstract<T> {
	protected size: Vertex2 | null = null;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator) {
		super(creator, resizer);
	}

	getMaps(size?: Vertex2) {
		if (size === undefined) {
			if (this.size === null) this.throwSizeError();
		} else {
			this.sizeMaps(size);
		}
		return this.maps;
	}
}

export class DrawTarget<T> extends DrawSurfaceAbstract<T> {
	private id = Symbol();
	protected size: Vertex2;
	private sizer: () => Vertex2;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator,
		sizer: () => Vertex2 = defaultMatchSizer) {
		super(creator, resizer);

		this.sizer = sizer;
		this.size = this.getSizerResult();
		this.setMaps(this.creator(this.size));
	}

	setSizer(sizer: () => Vertex2) {
		this.sizer = sizer;
		this.refresh();
	}

	getMaps() {
		return this.maps;
	}

	refresh(causes: Symbol[] = []) {
		const size = this.getSizerResult();
		if (this.size.x === size.x && this.size.y === size.y) return;

		for (const cause of causes) {
			if (cause !== this.id) continue;
			throw Error("Resize of DrawTarget caused itself to resize; Loop in sizer dependency chain");
		}

		this.sizeMaps(size);

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
}

export class P5DrawBuffer extends DrawBuffer<{ canvas: P5DrawSurfaceMap }> {
	constructor(arg: p5.RENDERER | P5DrawSurfaceMap = P2D) {
		super(
			({ x, y }) => {
				if (typeof arg === "string") {
					return { canvas: createFastGraphics(x, y, arg) };
				} else {
					if (arg.width !== x || arg.height !== y) {
						throw Error("P5DrawTarget found initial albedo map was of the wrong size");
					}
					return { canvas: arg };
				}
			},
			({ x, y }, { canvas }) => {
				canvas.resizeCanvas(x, y, true);
				return { canvas };
			}
		);
	}
}

export class P5DrawTarget extends DrawTarget<{ canvas: P5DrawSurfaceMap }> {
	constructor(sizer: () => Vertex2 = defaultMatchSizer, arg: p5.RENDERER | P5DrawSurfaceMap = P2D) {
		super(
			({ x, y }) => {
				if (typeof arg === "string") {
					return { canvas: createFastGraphics(x, y, arg) };
				} else {
					if (arg.width !== x || arg.height !== y) {
						throw Error("P5DrawTarget found initial albedo map was of the wrong size");
					}
					return { canvas: arg };
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

export class CanvasDrawTarget extends DrawTarget<{ canvas: HTMLCanvasElement }> {
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
	return getDrawTarget("default").getSize();
}