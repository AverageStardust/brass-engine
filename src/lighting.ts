/**
 * Used to add lighting effects to games.
 * Only simple p5.js effects as of now.
 * @module
 */

import p5 from "p5";
import { getP5DrawTarget, P5DrawBuffer, P5DrawSurface } from "./drawSurface";
import { ColorArgs, createColor } from "./common";
import { getDefaultViewpoint, Viewpoint, ViewpointAbstract } from "./viewpoint";
import { Vector2 } from "./vector3";
import { RayBody } from "./physics";
import { getSimTime } from "./time";



interface LighterAbstractOptions {
	resolution?: number;
}

interface P5LighterOptions extends LighterAbstractOptions {
	blur?: number;
	color?: p5.Color;
}

interface DirectionalOptions {
	cacheName?: any;
	cacheTime?: number;
	rays?: number;
	raySteps?: number;
	rayWidth?: number;
	raysCollideWith?: "everything" | "nothing" | number | number[];
	drawOffscreen?: boolean;
}



export class P5Lighter {
	private lightMap: P5DrawBuffer = new P5DrawBuffer();
	private resolution: number;
	private _blur: number;
	private color: p5.Color;
	private directionalCache: Map<any, { time: number, points: Vector2[] }> = new Map();
	private viewpoint: ViewpointAbstract | null = null;

	constructor(options: P5LighterOptions = {}) {
		this.resolution = options.resolution ?? 0.25;
		this._blur = options.blur ?? 1;
		this.color = options.color ?? createColor(255);
	}

	// light
	begin(v = getDefaultViewpoint(), d = getP5DrawTarget("defaultP5")) {
		const newContext = !this.lightMap.hasSize();
		this.lightMap.sizeMaps(d.getSize(this.resolution))
		if (newContext) this.fill(this.color);

		this.resetLightMap();

		const originalScale = v.scale;
		v.scale *= this.resolution;
		v.view(this.lightMap);
		v.scale = originalScale;
		this.viewpoint = v;

		return this;
	}

	end(d: P5DrawSurface = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		g.push();
		g.resetMatrix();

		g.blendMode(MULTIPLY);
		g.image(this.getLightCanvas() as any, 0, 0, width, height);

		g.pop();

		this.viewpoint = null;
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
			const r = red(col), g = green(col), b = blue(col), a = alpha(col);
			lightCanvas.stroke(r, g, b, a / 2);
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

	cone(x: number, y: number, angle: number, width = HALF_PI, distance = 100) {
		const lightCanvas = this.getLightCanvas();

		lightCanvas.triangle(x, y,
			x + Math.cos(angle - width / 2) * distance,
			y + Math.sin(angle - width / 2) * distance,
			x + Math.cos(angle + width / 2) * distance,
			y + Math.sin(angle + width / 2) * distance);

		return this;
	}

	world(vignette = 0) {
		const lightCanvas = this.getLightCanvas();
		if (this.viewpoint === null) this.throwBeginError();

		const area = this.viewpoint.getWorldViewArea();
		const areaWidth = area.maxX - area.minX;
		const areaHeight = area.maxY - area.minY;

		const lightMapSize = this.lightMap.getSize();
		const paddingX = areaWidth * ((4 / lightMapSize.x) - vignette) + this._blur * 2;
		const paddingY = areaHeight * ((4 / lightMapSize.y) - vignette) + this._blur * 2;

		lightCanvas.rect(
			area.minX - paddingX * 0.5,
			area.minY - paddingY * 0.5,
			areaWidth + paddingX * 1,
			areaHeight + paddingY * 1);

		return this;
	}

	directional(x: number, y: number, radius: number, options: DirectionalOptions = {}) {
		let points: Vector2[];

		let cache = this.directionalCache.get(options.cacheName);
		if (options.cacheName !== undefined) {
			if (cache === undefined ||
				getSimTime() > cache.time + (options.cacheTime ?? Infinity)) {
				cache = {
					time: getSimTime(),
					points: this.simulateDirectional(x, y, radius, options)
				};
				this.directionalCache.set(options.cacheName, cache);
			}
			points = cache.points;
		} else {
			points = this.simulateDirectional(x, y, radius, options);
		}

		const lightCanvas = this.getLightCanvas();

		lightCanvas.beginShape();
		for (const vert of points) {
			lightCanvas.vertex(vert.x, vert.y);
		}
		lightCanvas.endShape(CLOSE);
	}

	private simulateDirectional(x: number, y: number, radius: number, options: DirectionalOptions) {
		// light is drawn and simulated through an area centered on the screen
		// this area is a circle with minimum radius to fill the screen

		// find center drawing area
		if (this.viewpoint === null) this.throwBeginError();
		const viewArea = this.viewpoint.getWorldViewArea();
		let center, centerRadius;

		if (options.drawOffscreen ?? false) {
			center = new Vector2(x, y);
			centerRadius = radius;
		} else {
			center = new Vector2(
				(viewArea.minX + viewArea.maxX) / 2,
				(viewArea.minY + viewArea.maxY) / 2
			);
			centerRadius = Math.hypot(
				viewArea.minX - viewArea.maxX,
				viewArea.minY - viewArea.maxY) * 0.6;
		}

		const vec = new Vector2(x, y);

		// find if light is in drawing area
		const U0 = center.copy().sub(vec);
		const negativeU0 = vec.copy().sub(center);
		const centerDist = U0.mag;
		const lightInArea = centerDist < centerRadius;

		// find angle between center, light, and tangential edge of circle.
		let lightCircleTagentAngle;
		if (lightInArea) {
			lightCircleTagentAngle = HALF_PI;
		} else {
			lightCircleTagentAngle = Math.asin(centerRadius / centerDist);
		}

		// array of points on edge of lit area
		const points: Vector2[] = [];
		// list of rays to trace (in reverse order) to find points
		const paths: { start: Vector2, end: Vector2 }[] = [];

		// range and step between angles from light
		const centerAngle = negativeU0.angle;
		const startAngle = centerAngle + HALF_PI - lightCircleTagentAngle;
		const endAngle = centerAngle + HALF_PI * 3 + lightCircleTagentAngle;
		const stepAngle = TWO_PI / (options.rays ?? 50);

		for (let angle = startAngle;
			angle <= endAngle;
			angle += stepAngle) {
			const rayDirection = Vector2.fromDirMag(angle, centerRadius)
				.add(center).sub(vec).norm();
			this.findDirectionalLineSegment(
				U0, centerRadius, vec, rayDirection,
				radius, lightInArea, points, paths);
		}

		this.castDirectionalRays(points, paths, options);

		return points;
	}

	// find line segments inside the drawing area at the rayDirection
	// add point on the outside of the area if the light is outside of the area
	private findDirectionalLineSegment(
		U0: Vector2, centerRadius: number, vec: Vector2, rayDirection: Vector2,
		radius: number, lightInArea: boolean, points: Vector2[], paths: { start: Vector2, end: Vector2 }[]) {
		const U1 = rayDirection.copy().multScalar(U0.dot(rayDirection));
		const U2 = U0.copy().sub(U1);
		const nearDist = U2.mag;
		if (nearDist > centerRadius) return; // ray does not enter drawing area

		const intersectDist = Math.sqrt(centerRadius * centerRadius - nearDist * nearDist);
		const intersect = rayDirection.copy().multScalar(intersectDist);
		const startOffset = U1.copy().sub(intersect);
		if (!lightInArea && startOffset.mag > radius) return; // line segment does not reach drawing area

		const lineStart = startOffset.limit(radius).add(vec);
		const lineEnd = U1.copy().add(intersect).limit(radius).add(vec);

		if (lightInArea) {
			lineStart.set(vec); // cull line segment to start at light
		} else {
			points.push(lineStart); // add point where ray enters drawing area
		}

		paths.push({
			start: lineStart,
			end: lineEnd,
		});
	}

	private castDirectionalRays(
		points: Vector2[], paths: { start: Vector2, end: Vector2 }[], options: DirectionalOptions) {
		for (let i = paths.length - 1; i >= 0; i--) {
			const path = paths[i];
			const ray = new RayBody(path.start.x, path.start.y, options.rayWidth ?? 0.01);
			ray.collidesWith = options.raysCollideWith ?? "everything";
			const endPoint = ray.cast(path.end.sub(path.start), options.raySteps ?? 10).point;
			ray.kill();
			points.push(endPoint);
		}
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
		if (!this.lightMap.hasSize()) this.throwBeginError();
		return this.lightMap.getMaps().canvas;
	}

	private throwBeginError(): never {
		throw Error(`Lighter.begin() must be ran before using lighting`)
	}
}