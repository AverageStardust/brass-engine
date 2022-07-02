/**
 * Very flexible targets for drawing operations.
 * Useable with both p5.js and REGL graphics.
 * @module
 */

import p5 from "p5";
import REGL from "../types/regl";
import { assert, createFastGraphics } from "./common";
import { Vertex2 } from "./vector";



// these would both have canvas properties anyway, for some reason they were not in the typing
export type P5DrawSurfaceMap = p5.Graphics | p5;
export type P5DrawSurface = DrawSurfaceAbstract<{ canvas: P5DrawSurfaceMap }>;



let drawTargets: Map<string, DrawTarget<any>> = new Map();
let _regl: REGL.Regl | null = null;
let doReglRefresh = false;
let sketch: p5;
let setWidth = window.innerWidth, setHeight = window.innerHeight;



export function init(_sketch: p5, doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<any>) {
	sketch = _sketch;
	setWidth = window.innerWidth;
	setHeight = window.innerHeight;
	initDefaultDrawTarget(doRegl, drawTarget);

	if (!hasDrawTarget("default")) return;

	resetAndSyncDefaultP5DrawTarget();

	const defaultDrawTarget = getDrawTarget("default");

	displayDrawTarget(defaultDrawTarget);

	if (doRegl) {
		const defaultReglTarget = getDrawTarget("defaultRegl");
		const canvas = defaultReglTarget.getMaps().canvas;
		_regl = createREGL({ canvas });
	}
}

function initDefaultDrawTarget(doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<any>) {
	if (drawTarget === undefined) {
		sketch.createCanvas(windowWidth, windowHeight);

		const drawTarget = new P5DrawTarget(undefined, sketch);
		setDrawTarget("default", drawTarget);
		setDrawTarget("defaultP5", drawTarget);
	} else {
		noCanvas();
		if (drawTarget instanceof DrawTarget) {
			setDrawTarget("default", drawTarget);
			if (drawTarget instanceof P5DrawTarget) {
				setDrawTarget("defaultP5", drawTarget);
			}
			if (drawTarget instanceof CanvasDrawTarget) {
				setDrawTarget("defaultRegl", drawTarget);
			}
			// @ts-ignore because p5.Graphics is typed wrong
		} else if (drawTarget instanceof p5.Graphics) {
			const p5DrawTarget = new P5DrawTarget(undefined, drawTarget);
			setDrawTarget("default", p5DrawTarget);
			setDrawTarget("defaultP5", p5DrawTarget);
		} else {
			throw Error("Can't make default drawTarget in Brass.init(), bad value");
		}
	}

	if (doRegl) {
		const drawTarget = new CanvasDrawTarget();
		setDrawTarget("defaultRegl", drawTarget);
	}
}

function displayDrawTarget(drawTarget: DrawTarget<any>) {
	let htmlCanvas: HTMLCanvasElement | undefined;
	if (drawTarget instanceof P5DrawTarget) {
		// @ts-ignore
		htmlCanvas = drawTarget.getMaps().canvas.canvas;
	}
	if (drawTarget instanceof CanvasDrawTarget) {
		htmlCanvas = drawTarget.getMaps().canvas;
	}

	if (htmlCanvas) {
		// @ts-ignore
		if (sketch._userNode) {
			// @ts-ignore
			sketch._userNode.appendChild(htmlCanvas);
		} else {
			// create main element
			if (document.getElementsByTagName("main").length === 0) {
				const main = document.createElement("main");
				document.body.appendChild(main);
			}
			// append canvas to main
			document.getElementsByTagName("main")[0].appendChild(htmlCanvas);
		}
		htmlCanvas.style.display = "block";
		return true;
	} else {
		return false;
	}
}

export function setDrawTarget(name: string, drawTarget: DrawTarget<any>) {
	if (hasDrawTarget(name)) {
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

export const hasDrawTarget = drawTargets.has.bind(drawTargets);

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
	setWidth = width;
	setHeight = height;
	getDrawTarget("default").refresh();
	resetAndSyncDefaultP5DrawTarget();
	honorReglRefresh();
}

export function resetAndSyncDefaultP5DrawTarget() {
	if (hasDrawTarget("defaultP5")) {
		const canvas = getDrawTarget("defaultP5").getMaps().canvas;
		canvas.resetMatrix();
		sketch.width = canvas.width;
		sketch.height = canvas.height;
	}
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
	id = Symbol();
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



	hasName(name: string) {
		if (!hasDrawTarget(name)) return false;
		return getDrawTarget(name).id === this.id;
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
	protected size: Vertex2;
	private sizer: (self: DrawTarget<T>) => Vertex2;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator,
		sizer: (self: DrawTarget<T>) => Vertex2 = defaultMatchSizer) {
		super(creator, resizer);

		this.sizer = sizer;
		this.size = this.getSizerResult();
		this.setMaps(this.creator(this.size));
	}

	setSizer(sizer: (self: DrawTarget<T>) => Vertex2) {
		this.sizer = sizer;
		this.refresh();
	}

	getMaps() {
		return this.maps;
	}

	refresh(causes: Symbol[] = []) {
		const size = this.getSizerResult();
		if (this.size !== undefined && this.size.x === size.x && this.size.y === size.y) return;

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
		const floatSize = this.sizer(this);
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
						arg.resizeCanvas(x, y, true);
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
	constructor(sizer: (self: P5DrawTarget) => Vertex2 = defaultMatchSizer,
		arg: p5.RENDERER | P5DrawSurfaceMap = P2D) {
		super(
			({ x, y }) => {
				if (typeof arg === "string") {
					return { canvas: createFastGraphics(x, y, arg) };
				} else {
					if (arg.width !== x || arg.height !== y) {
						arg.resizeCanvas(x, y, true);
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
	constructor(sizer: (self: CanvasDrawTarget) => Vertex2 = defaultMatchSizer) {
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

function defaultMatchSizer(self: DrawSurfaceAbstract<any>) {
	if (!hasDrawTarget("default") || self.hasName("default")) {
		return { x: setWidth, y: setHeight };
	}
	return getDrawTarget("default").getSize();
}