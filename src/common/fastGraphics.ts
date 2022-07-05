import p5 from "p5";



export function createFastGraphics(width: number, height: number, renderer?: p5.RENDERER, pInst?: p5) {
	return new FastGraphics(width, height, renderer, pInst) as unknown as p5.Graphics;
}

// 99% evil hacks
class FastGraphics extends p5.Element {
	width: number;
	height: number;
	_pixelDensity: number;

	canvas: HTMLCanvasElement;
	_renderer: any;

	constructor(width: number, height: number, renderer: p5.RENDERER = P2D, pInst?: p5) {
		const canvas = document.createElement("canvas");

		super(canvas as any, pInst);

		// @ts-ignore because this is all hacks
		this._glAttributes = {};

		applyP5Prototype(this, pInst);

		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this._pixelDensity = (this as unknown as any).pInst.pixelDensity();

		if (renderer === WEBGL) {
			// @ts-ignore because this is all hacks
			this._renderer = new p5.RendererGL(this.canvas, this, false);
		} else {
			// @ts-ignore because this is all hacks
			this._renderer = new p5.Renderer2D(this.canvas, this, false);
		}

		this._renderer.resize(width, height);
		this._renderer._applyDefaults();
	}

	reset() {
		this._renderer.resetMatrix();
		if (this._renderer.isP3D) {
			this._renderer._update();
		}
	}

	remove() {
		// @ts-ignore because this is all hacks
		for (var elt_ev in this._events) {
			// @ts-ignore because this is all hacks
			this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
		}
	}
}

function applyP5Prototype(obj: unknown, pInst?: p5): typeof obj & p5 {
	// @ts-ignore because this is all hacks
	obj.pInst = (pInst ?? window) as p5;

	for (const p in p5.prototype) {
		// @ts-ignore because this is all hacks
		if (obj[p])
			continue;
		// @ts-ignore because this is all hacks
		if (typeof p5.prototype[p] === "function") {
			// @ts-ignore because this is all hacks
			obj[p] = p5.prototype[p].bind(obj);
		} else {
			// @ts-ignore because this is all hacks
			obj[p] = p5.prototype[p];
		}
	}

	// @ts-ignore because this is all hacks
	p5.prototype._initializeInstanceVariables.apply(obj);

	return obj as typeof obj & p5;
}