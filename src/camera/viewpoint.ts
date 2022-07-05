import { P5DrawTarget } from "../layers/p5Layers";
import { Vector2 } from "../vector/vector2";
import { ViewpointAbstract, ViewpointAbstractOptions } from "./viewpointAbstract";



export interface ViewpointOptions extends ViewpointAbstractOptions {
	jump?: number;
	follow?: number;
	drag?: number;
	outrun?: number;
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
