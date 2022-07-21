import { Vector2, Vertex2 } from "../vector/vector2";
import { BodyAbstract, CollisionFilterCategory, CollisionFilterIndex, getMatterWorld, getSpaceScale } from "./bodyAbstract";



export type InternalMatterBody = Matter.Body & { collisionFilter: { category: CollisionFilterCategory }, __brassBody__: MaterialBodyAbstract };



const bodies: { [index: CollisionFilterIndex]: Map<number, MaterialBodyAbstract> } = Array(32).fill(null).map(() => new Map());
const forceUnit = 1e-6;



export function getBodies() {
	return bodies;
}



export abstract class MaterialBodyAbstract extends BodyAbstract {
	body!: InternalMatterBody;

	constructor(body: Matter.Body) {
		super();

		this.setBody(body);
	}

	protected setBody(body: Matter.Body) {
		if (this.body !== undefined) {
			this.remove();
		}

		this.body = body as InternalMatterBody;
		this.body.__brassBody__ = this;
		this.body.collisionFilter.category = this.collisionIndexToCategory(0);

		bodies[0 as CollisionFilterIndex].set(this.body.id, this);

		Matter.World.add(getMatterWorld(), body);
	}

	get position(): Vector2 {
		const position = Vector2.fromObj(this.body.position).divScalar(getSpaceScale());
		return position.watch(this.positionWatcherMethod.bind(this));
	}

	set position(position: Vertex2) {
		const spaceScale = getSpaceScale();
		position = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
		Matter.Body.setPosition(this.body, position);
	}

	private positionWatcherMethod(position: Vector2) {
		this.position = position;
	}

	get velocity(): Vector2 {
		const velocity = Vector2.fromObj(this.body.velocity).divScalar(getSpaceScale());
		return velocity.watch(this.velocityWatcherMethod.bind(this));
	}
	
	set velocity(velocity: Vertex2) {
		const spaceScale = getSpaceScale();
		velocity = Matter.Vector.create(velocity.x * spaceScale, velocity.y * spaceScale);
		Matter.Body.setVelocity(this.body, velocity);
	}

	private velocityWatcherMethod(velocity: Vector2) {
		this.velocity = velocity;
	}

	get angle() {
		return this.body.angle;
	}

	set angle(angle: number) {
		Matter.Body.setAngle(this.body, angle);
	}

	get angularVelocity() {
		return this.body.angularVelocity;
	}

	set angularVelocity(angularVelocity: number) {
		Matter.Body.setAngularVelocity(this.body, angularVelocity);
	}

	get static() {
		return this.body.isStatic;
	}

	set static(isStatic: boolean) {
		Matter.Body.setStatic(this.body, isStatic);
	}

	get ghost() {
		return this.body.isSensor;
	}

	set ghost(isGhost: boolean) {
		this.body.isSensor = isGhost;
	}

	set collisionCategory(categoryIndex: number) {
		const oldCategoryIndex = this.collisionCategoryToIndex(this.body.collisionFilter.category);
		bodies[oldCategoryIndex].delete(this.body.id);

		this.body.collisionFilter.category = this.collisionIndexToCategory(categoryIndex);
		bodies[categoryIndex as CollisionFilterIndex].set(this.body.id, this);
	}

	set collidesWith(category: "everything" | "nothing" | number | number[]) {
		this.body.collisionFilter.mask = 0;
		if (category === "everything") {
			this.body.collisionFilter.mask = 0xFFFFFFFF;
		} else if (category === "nothing") {
			this.body.collisionFilter.mask = 0;
		} else if (Array.isArray(category)) {
			category.map((subCategory) => this.setCollidesWith(subCategory));
		} else {
			this.setCollidesWith(category);
		}
	}

	private setCollidesWith(category: number) {
		this.validateCollisionIndex(category);

		if (category >= 0) { // sets mask bit of category
			(this.body.collisionFilter.mask as number) |= 1 << category;
		} else { // unsets mask bit of category
			(this.body.collisionFilter.mask as number) &= ~(1 << -category);
		}

		return this;
	}

	rotate(rotation: number) {
		Matter.Body.rotate(this.body, rotation);
		return this;
	}

	applyForce(force: Vertex2, position = this.position) {
		const spaceScale = getSpaceScale();
		const forceScale = spaceScale * spaceScale * spaceScale * forceUnit;
		const matterForce = Matter.Vector.create(force.x * forceScale, force.y * forceScale);
		const matterPosition = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
		queueMicrotask(Matter.Body.applyForce.bind(globalThis, this.body, matterPosition, matterForce));
		return this;
	}

	kill() {
		super.kill();
		this.remove();
	}

	protected remove() {
		const categoryIndex = this.collisionCategoryToIndex(this.body.collisionFilter.category);
		bodies[categoryIndex].delete(this.body.id);
		Matter.World.remove(getMatterWorld(), this.body);
	}
}
