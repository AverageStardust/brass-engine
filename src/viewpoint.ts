/**
 * Like a camera, handles translations and zoom.
 * Options to follow the position of any vector, like the player position.
 * @module
 */


import { getP5DrawTarget, P5DrawBuffer, P5DrawSurface, P5DrawTarget } from "./drawSurface";
import { getTime } from "./time";
import { Vector2 } from "./vector3";



interface AbstractViewpointOptions {
	integerTranslation?: boolean;
	integerScaling?: boolean;

	shakeSpeed?: number;
}

interface ViewpointOptions extends AbstractViewpointOptions {
	jump?: number;
	follow?: number;
	drag?: number;
	outrun?: number;
}



let defaultViewpoint: ViewpointAbstract;
const viewpointList: ViewpointAbstract[] = [];



export function init(viewpoint: ViewpointAbstract | undefined) {
	if (viewpoint === undefined) {
		setDefaultViewpoint(new ClassicViewpoint(1, new Vector2(0, 0)));
	} else {
		setDefaultViewpoint(viewpoint);
	}
}

export function updateViewpoints(delta: number) {
	for (const viewpoint of viewpointList) {
		viewpoint.update(delta);
	}
}

export function setDefaultViewpoint(viewpoint: ViewpointAbstract) {
	defaultViewpoint = viewpoint;
}

export function getDefaultViewpoint() {
	if (defaultViewpoint === undefined) throw Error("Could not find default viewpoint; maybe run Brass.init() first");
	return defaultViewpoint;
}

export abstract class ViewpointAbstract {
	scale: number
	translation: Vector2

	protected integerTranslation: boolean;
	protected integerScaling: boolean;

	private shakeSpeed: number;
	private shakeStrength = 0;
	private shakeDecay = 0;
	protected shakePosition: Vector2;

	constructor(scale: number, translation: Vector2, options: AbstractViewpointOptions = {}) {
		// camera
		this.scale = scale;
		this.translation = translation;

		this.integerTranslation = options.integerTranslation ?? true;
		this.integerScaling = options.integerScaling ?? false;

		// shake
		this.shakeSpeed = options.shakeSpeed ?? 0.015;
		this.shakePosition = new Vector2();

		viewpointList.push(this);
	}

	// camera
	abstract update(delta: number): void;

	view(d: P5DrawSurface = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		const viewOrigin = this.getViewOrigin(d);
		g.translate(viewOrigin.x, viewOrigin.y);

		g.scale(this.effectiveScale);

		const translation = this.effectiveTranslation;
		g.translate(-translation.x, -translation.y);

		g.translate(-this.shakePosition.x, -this.shakePosition.y);
	}

	getScreenViewArea(d: P5DrawSurface = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		const viewOrigin = this.getViewOrigin(d);

		return {
			minX: 0 - viewOrigin.x,
			maxX: g.width - viewOrigin.x,
			minY: 0 - viewOrigin.y,
			maxY: g.height - viewOrigin.y
		};
	}

	getWorldViewArea(d: P5DrawSurface = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		const translation = this.effectiveTranslation;

		const { x: minX, y: minY } =
			this.screenToWorld(new Vector2());
		const { x: maxX, y: maxY } =
			this.screenToWorld(new Vector2(g.width, g.height));

		return {
			minX, minY, maxX, maxY
		};
	}

	traslateScreen(screenTranslation: Vector2) {
		const worldTraslation = screenTranslation.copy().divScalar(this.effectiveScale);
		this.translation.add(worldTraslation);
	}

	screenToWorld(screenCoord: Vector2, d = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		const coord = screenCoord.copy();

		const viewOrigin = this.getViewOrigin(d);
		coord.sub(viewOrigin);

		coord.divScalar(this.effectiveScale);

		const translation = this.effectiveTranslation;
		coord.add(translation);

		coord.add(this.shakePosition);

		return coord;
	}

	worldToScreen(worldCoord: Vector2, d = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;

		const coord = worldCoord.copy();

		coord.sub(this.shakePosition);

		const translation = this.effectiveTranslation;
		coord.sub(translation);

		coord.multScalar(this.effectiveScale);

		const viewOrigin = this.getViewOrigin(d);
		coord.add(viewOrigin);

		return coord;
	}

	protected abstract getViewOrigin(g: P5DrawSurface): Vector2;

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



export class ClassicViewpoint extends ViewpointAbstract {
	constructor(scale = 100, translation = new Vector2(), options: ViewpointOptions = {}) {
		super(scale, translation, options);
	}

	update(delta: number) { }

	protected getViewOrigin() {
		return new Vector2(0, 0);
	}
}



export class Viewpoint extends ViewpointAbstract {

	private velocity: Vector2;
	private _target: Vector2;
	private previousTarget: Vector2;

	private readonly jump: number;
	private readonly follow: number; // makes camera ease into target position
	private readonly drag: number; // makes camera drag behind
	private readonly outrun: number; // makes camera try to stay ahead of motion

	constructor(scale = 100, translation = new Vector2(), options: ViewpointOptions = {}) {
		super(scale, translation, options);

		this.velocity = new Vector2();
		this._target = this.translation.copy();
		this.previousTarget = this._target.copy();

		// follow settings
		if ("follow" in options ||
			"drag" in options ||
			"outrun" in options) {
			// complex template
			this.jump = options.jump ?? 0;
			this.follow = options.follow ?? 0.001;
			this.drag = options.drag ?? 0.1;
			this.outrun = options.outrun ?? 0;
		} else {
			// simple template with only jump
			this.jump = options.jump ?? 0.1;
			this.follow = 0;
			this.drag = 0;
			this.outrun = 0;
		}
	}

	update(delta: number) {
		const targetVelocity = this.target.copy().sub(this.previousTarget);

		// drag
		this.velocity.multScalar(Math.pow(1 - this.drag, delta));

		// follow
		const difference = this.target.copy().sub(this.translation);
		this.velocity.add(difference.copy().multScalar(this.follow * delta));

		// outrun
		this.velocity.add(targetVelocity.copy().multScalar(this.outrun * delta));

		// jump (this math feels very wrong, but it works)
		const frameJump = Math.pow(this.jump + 1, Math.pow(delta, this.jump));
		this.translation.add(this.target.copy().multScalar(frameJump - 1));
		this.translation.divScalar(frameJump);

		// velocity
		this.translation.add(this.velocity);

		this.previousTarget = this.target.copy();

		this.updateShake(delta);
	}

	protected getViewOrigin(d: P5DrawTarget) {
		const g = d.getMaps().canvas;

		if (this.integerTranslation) {
			return new Vector2(Math.round(g.width / 2), Math.round(g.height / 2));
		}

		return new Vector2(g.width / 2, g.height / 2);
	}

	set target(value) {
		this._target = value;
	}

	get target() {
		return this._target;
	}
}