import p5 from "p5";
import { getP5DrawTarget } from "./drawTarget";
import { ColorArgs, createColor, createFastGraphics } from "./common";
import { getDefaultViewpoint } from "./viewpoint";



interface LighterOptions {
	resolution?: number;
	blur?: number;
	color?: p5.Color;
}



export class Lighter {
	private _lightMap: p5.Graphics | null = null;
	private resolution: number;
	private _blur: number;
	private color: p5.Color;

	constructor(options: LighterOptions = {}) {
		this.resolution = options.resolution ?? 0.25;
		this._blur = options.blur ?? 1;
		this.color = options.color ?? createColor(255);
	}

	// light
	begin(v = getDefaultViewpoint(), g = getP5DrawTarget("p5Default").maps.canvas) {
		const size = this.getLightMapSize(g);

		if (this._lightMap === null) {
			this._lightMap = createFastGraphics(size.x, size.y);
			this.lightMap.blendMode(ADD);
			this.light(this.color);
		} else {
			if (this._lightMap.width !== size.x ||
				this._lightMap.height !== size.y) {
				this._lightMap.resizeCanvas(size.x, size.y, true);
				this._lightMap.clear(0, 0, 0, 255);
			}
		}

		this.resetLightMap();
		const originalScale = v.scale;
		v.scale *= this.resolution;
		v.view(this.lightMap);
		v.scale = originalScale;

		return this;
	}

	end(g = getP5DrawTarget("p5Default").maps.canvas) {
		g.push();
		g.resetMatrix();

		g.blendMode(MULTIPLY);
		g.image(this.lightMap, 0, 0, width, height);

		g.pop();
	}

	set blur(value: number) {
		this._blur = value;
		this.light(this.color);
	}

	get blur() {
		return this._blur;
	}

	light(...colArgs: ColorArgs) {
		this.setLightMapColor(...colArgs);

		return this;
	}

	point(x: number, y: number, r: number) {
		this.lightMap.circle(x, y, r * 2);

		return this;
	}

	cone(x: number, y: number, angle: number, width = HALF_PI, distance = 1000) {
		this.lightMap.triangle(x, y,
			x + Math.cos(angle - width / 2) * distance,
			y + Math.sin(angle - width / 2) * distance,
			x + Math.cos(angle + width / 2) * distance,
			y + Math.sin(angle + width / 2) * distance);

		return this;
	}

	world() {
		this.lightMap.background(this.color);

		return this;
	}

	private getLightMapSize(g = getP5DrawTarget("p5Default").maps.canvas) {
		return {
			x: Math.ceil(g.width * this.resolution),
			y: Math.ceil(g.height * this.resolution)
		};
	}

	private setLightMapColor(...colArgs: ColorArgs) {
		const col = createColor(...colArgs);

		this.lightMap.fill(col);

		if (this._blur > 0) {
			const r = red(col), g = green(col), b = blue(col);
			this.lightMap.stroke(r / 2, g / 2, b / 2);
			this.lightMap.strokeWeight(this._blur);
		} else {
			this.lightMap.noStroke();
		}

		this.color = col;
	}

	private resetLightMap() {
		this.lightMap.push();
		this.lightMap.blendMode(BLEND);
		this.lightMap.background(0);
		this.lightMap.pop();

		this.lightMap.resetMatrix();
	}

	private get lightMap() {
		if (this._lightMap !== null) return this._lightMap;
		throw Error(`Lighter.begin() must be ran before using lighting`);
	}
}