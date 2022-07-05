import { Vector2, Vertex2 } from "../vector/vector2";
import { BodyAbstract, CollisionFilterIndex, CollisionFilterMask, getSpaceScale } from "./bodyAbstract";
import { getBodies, InternalMatterBody, MaterialBodyAbstract } from "./materialBodyAbstract";



const rays: Map<symbol, RayBody> = new Map();



export function getRays() {
	return rays;
}



export class RayBody extends BodyAbstract {
	private id = Symbol();

	position: Vector2;
	velocity: Vector2;

	private width: number;
	private mask: CollisionFilterMask;

	constructor(x: number, y: number, width: number = 0.1, options: { velocity?: Vertex2; mask?: number; } = {}) {
		super();
		this.position = new Vector2(x, y);
		this.velocity = Vector2.fromObj(options.velocity ?? { x: 0, y: 0 });
		this.width = width;
		this.mask = this.validateCollisionMask(options.mask ?? 0xFFFFFFFF);

		rays.set(this.id, this);
	}

	get angle() {
		throw Error("RayBody can't have rotation");
	}

	get angularVelocity() {
		throw Error("RayBody can't have rotation");
	}

	get static() {
		return false;
	}

	get ghost() {
		return true;
	}

	set angle(_: number) {
		throw Error("RayBody can't have rotation");
	}

	set angularVelocity(_: number) {
		throw Error("RayBody can't have rotation");
	}

	set static(isStatic: boolean) {
		if (isStatic === true) {
			throw Error("RayBody can't have static behaviour enabled");
		}
	}

	set ghost(isGhost: boolean) {
		if (isGhost === false) {
			throw Error("RayBody can't have ghost behaviour disabled");
		}
	}

	set collisionCategory(_: number) { }

	set collidesWith(category: "everything" | "nothing" | number | number[]) {
		this.mask = 0 as CollisionFilterMask;
		if (category === "everything") {
			this.mask = 0xFFFFFFFF as CollisionFilterMask;
		} else if (category === "nothing") {
			this.mask = 0 as CollisionFilterMask;
		} else if (Array.isArray(category)) {
			category.map((subCategory) => this.setCollidesWith(subCategory));
		} else {
			this.setCollidesWith(category);
		}
	}

	private setCollidesWith(category: number) {
		this.validateCollisionIndex(category);

		if (category >= 0) { // sets mask bit of category
			(this.mask as number) |= 1 << category;
		} else { // unsets mask bit of category
			(this.mask as number) &= ~(1 << -category);
		}

		return this;
	}

	rotate(_: number): never {
		throw Error("RayBody can't have rotation");
	}

	applyForce(): never {
		throw Error("RayBody can't have forces applied");
	}

	kill() {
		super.kill();
		this.remove();
	}

	protected remove() {
		rays.delete(this.id);
	}

	castOverTime(delta: number, steps?: number): {
		point: Vector2;
		dist: Number;
		body: null | MaterialBodyAbstract;
	} {
		const timeSteps = (delta / 1000 * 60);
		const displacement = this.velocity.copy().multScalar(timeSteps);
		return this.cast(displacement, steps);
	}

	cast(_displacement: Vector2, steps = 20) {
		const spaceScale = getSpaceScale();
		const displacement = _displacement.multScalar(spaceScale);
		const testBrassBodies: MaterialBodyAbstract[] = [];

		for (let i = 0; i < 32; i++) {
			if (!(this.mask & (1 << i)))
				continue;
			const catagoryBodies = getBodies()[i as CollisionFilterIndex];
			testBrassBodies.push(...Array.from(catagoryBodies.values()));
		}

		const testBodies = testBrassBodies.map((brassBody) => brassBody.body);

		const start = this.position.copy().multScalar(spaceScale);

		let testPoint = 1, testJump = 0.5, hits: Matter.ICollision[] = [], hitEnd = displacement.copy().multScalar(testPoint).add(start), hitPoint = 1;
		for (let i = 0; i < steps; i++) {
			const end = displacement.copy().multScalar(testPoint).add(start);
			const currentHits = Matter.Query.ray(testBodies, start, end, this.width * spaceScale);
			if (currentHits.length < 1) {
				if (i === 0)
					break;
				testPoint += testJump;
				testJump /= 2;
			} else if (currentHits.length === 1) {
				hits = currentHits;
				hitPoint = testPoint;
				hitEnd = end;

				testPoint -= testJump;
				testJump /= 2;
			} else {
				if (currentHits.length !== 1) {
					hits = currentHits;
					hitPoint = testPoint;
					hitEnd = end;
				}
				testPoint -= testJump;
				testJump /= 2;
			}
		}

		if (hits.length > 1) {
			hits = hits.sort((a, b) => start.distSq(a.bodyA.position) - start.distSq(b.bodyA.position));
		}

		let hitBody: null | MaterialBodyAbstract;
		if (hits.length === 0) {
			hitBody = null;
		} else {
			hitBody = (hits[0].parentA as InternalMatterBody).__brassBody__;
		}

		return {
			point: hitEnd.divScalar(spaceScale),
			dist: displacement.mag * hitPoint / spaceScale,
			body: hitBody
		};
	}
}
