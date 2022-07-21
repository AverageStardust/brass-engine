import { P5Layer } from "../layers/p5Layers";
import { getTime } from "../core/time";
import { Vector2 } from "../vector/vector2";
import { getDefaultP5DrawTarget } from "../layers/p5Layers";



const viewpoints: ViewpointAbstract[] = [];



export interface ViewpointAbstractOptions {
	integerTranslation?: boolean;
	integerScaling?: boolean;

	shakeSpeed?: number;
}



export function getViewpoints() {
	return viewpoints;
}

export abstract class ViewpointAbstract {
	scale: number;
	translation: Vector2;

	protected integerTranslation: boolean;
	protected integerScaling: boolean;

	private shakeSpeed: number;
	private shakeStrength = 0;
	private shakeDecay = 0;
	protected shakePosition: Vector2;

	constructor(scale: number, translation: Vector2, options: ViewpointAbstractOptions = {}) {
		// camera
		this.scale = scale;
		this.translation = translation;

		this.integerTranslation = options.integerTranslation ?? true;
		this.integerScaling = options.integerScaling ?? false;

		// shake
		this.shakeSpeed = options.shakeSpeed ?? 0.015;
		this.shakePosition = new Vector2();

		viewpoints.push(this);
	}

	// camera
	abstract update(delta: number): void;

	view(d: P5Layer = getDefaultP5DrawTarget()) {
		const g = d.getMaps().canvas;

		const viewOrigin = this.getViewOrigin(d);
		g.translate(viewOrigin.x, viewOrigin.y);

		g.scale(this.effectiveScale);

		const translation = this.effectiveTranslation;
		g.translate(-translation.x, -translation.y);

		g.translate(-this.shakePosition.x, -this.shakePosition.y);
	}

	getScreenViewArea(d: P5Layer = getDefaultP5DrawTarget()) {
		const g = d.getMaps().canvas;

		const viewOrigin = this.getViewOrigin(d);

		return {
			minX: 0 - viewOrigin.x,
			maxX: g.width - viewOrigin.x,
			minY: 0 - viewOrigin.y,
			maxY: g.height - viewOrigin.y
		};
	}

	getWorldViewArea(d: P5Layer = getDefaultP5DrawTarget()) {
		const g = d.getMaps().canvas;

		const { x: minX, y: minY } = this.screenToWorld(new Vector2());
		const { x: maxX, y: maxY } = this.screenToWorld(new Vector2(g.width, g.height));

		return {
			minX, minY, maxX, maxY
		};
	}

	traslateScreen(screenTranslation: Vector2) {
		const worldTraslation = screenTranslation.copy().divScalar(this.effectiveScale);
		this.translation.add(worldTraslation);
	}

	screenToWorld(screenCoord: Vector2, d = getDefaultP5DrawTarget()) {
		const coord = screenCoord.copy();

		const viewOrigin = this.getViewOrigin(d);
		coord.sub(viewOrigin);

		coord.divScalar(this.effectiveScale);

		const translation = this.effectiveTranslation;
		coord.add(translation);

		coord.add(this.shakePosition);

		return coord;
	}

	worldToScreen(worldCoord: Vector2, d = getDefaultP5DrawTarget()) {
		const coord = worldCoord.copy();

		coord.sub(this.shakePosition);

		const translation = this.effectiveTranslation;
		coord.sub(translation);

		coord.multScalar(this.effectiveScale);

		const viewOrigin = this.getViewOrigin(d);
		coord.add(viewOrigin);

		return coord;
	}

	protected abstract getViewOrigin(g: P5Layer): Vector2;

	protected get effectiveTranslation() {
		if (this.integerTranslation) {
			return this.translation.copy()
				.multScalar(this.effectiveScale).round()
				.divScalar(this.effectiveScale);
		}

		return this.translation.copy();
	}

	protected get effectiveScale() {
		if (this.integerScaling) {
			if (this.scale > 1) {
				return Math.round(this.scale);
			} else {
				return 1 / Math.round(1 / this.scale);
			}
		}

		return this.scale;
	}

	// shake
	shake(strength: number, duration = 1000) {
		this.shakeStrength += strength;
		this.shakeDecay += strength / duration;
	}

	protected updateShake(delta: number) {
		this.shakeStrength -= this.shakeDecay * delta;

		if (this.shakeStrength <= 0) {
			this.shakeStrength = 0;
			this.shakeDecay = 0;
		}

		this.shakePosition.x =
			noise(8104, getTime() * this.shakeSpeed * 2) * 0.3 +
			noise(9274, getTime() * this.shakeSpeed / 2) * 0.7;
		this.shakePosition.y =
			noise(5928, getTime() * this.shakeSpeed * 2) * 0.3 +
			noise(2395, getTime() * this.shakeSpeed / 2) * 0.7;
		this.shakePosition.subScalar(0.5).multScalar(this.shakeStrength);
	}
}