/**
 * Used to add lighting effects to games.
 * Only simple p5.js effects as of now.
 * @module
 */

import p5 from "p5";
import { getP5DrawTarget, P5DrawBuffer, P5DrawSurface } from "./drawSurface";
import { ColorArgs, createColor } from "./common";
import { getDefaultViewpoint } from "./viewpoint";



interface LighterAbstractOptions {
	resolution?: number;
}

interface P5LighterOptions extends LighterAbstractOptions {
	blur?: number;
	color?: p5.Color;
}



export class P5Lighter {
	private lightMap: P5DrawBuffer = new P5DrawBuffer();
	private resolution: number;
	private _blur: number;
	private color: p5.Color;

	constructor(options: P5LighterOptions = {}) {
		this.resolution = options.resolution ?? 0.25;
		this._blur = options.blur ?? 1;
		this.color = options.color ?? createColor(255);
	}

	// light
	begin(v = getDefaultViewpoint(), d = getP5DrawTarget("defaultP5")) {
		this.lightMap.sizeMaps(d.getSize(this.resolution))

		this.resetLightMap();

		const originalScale = v.scale;
		v.scale *= this.resolution;
		v.view(d);
		v.scale = originalScale;

		return this;
	}

	end(d: P5DrawSurface = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		g.push();
		g.resetMatrix();

		g.blendMode(MULTIPLY);
		g.image(this.getLightCanvas() as any, 0, 0, width, height);

		g.pop();
	}

	set blur(value: number) {
		this._blur = value;
		this.fill(this.color);
	}

	get blur() {
		return this._blur;
	}

	fill(...colArgs: ColorArgs) {
		const lightCanvas = this.getLightCanvas();

		const col = createColor(...colArgs);

		lightCanvas.fill(col);

		if (this._blur > 0) {
			const r = red(col), g = green(col), b = blue(col);
			lightCanvas.stroke(r / 2, g / 2, b / 2);
			lightCanvas.strokeWeight(this._blur);
		} else {
			lightCanvas.noStroke();
		}

		this.color = col;

		return this;
	}

	point(x: number, y: number, r: number) {
		const lightCanvas = this.getLightCanvas();

		lightCanvas.circle(x, y, r * 2);

		return this;
	}

	cone(x: number, y: number, angle: number, width = HALF_PI, distance = 1000) {
		const lightCanvas = this.getLightCanvas();

		lightCanvas.triangle(x, y,
			x + Math.cos(angle - width / 2) * distance,
			y + Math.sin(angle - width / 2) * distance,
			x + Math.cos(angle + width / 2) * distance,
			y + Math.sin(angle + width / 2) * distance);

		return this;
	}

	world() {
		const lightCanvas = this.getLightCanvas();

		lightCanvas.background(this.color);

		return this;
	}

	private resetLightMap() {
		const lightCanvas = this.getLightCanvas();

		lightCanvas.push();
		lightCanvas.blendMode(BLEND);
		lightCanvas.background(0);
		lightCanvas.pop();

		lightCanvas.resetMatrix();
	}

	private getLightCanvas() {
		if (!this.lightMap.hasSize()) throw Error(`Lighter.begin() must be ran before using lighting`);
		return this.lightMap.getMaps().canvas;
	}
}