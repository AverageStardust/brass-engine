import { Vector2, Vertex2 } from "../vector/vector2";
import { InternalMatterBody, bodies, CollisionFilterIndex, getMatterWorld, getSpaceScale, forceUnit } from "./physics";
import { BodyAbstract } from "./bodyAbstract";


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

	protected removeBody() {
	}

	get position(): Vector2 {
		const position = Vector2.fromObj(this.body.position).divScalar(getSpaceScale());
		return position.watch(this.setPosition.bind(this));
	}

	private setPosition(position: Vector2) {
		this.position = position;
	}

	get velocity(): Vector2 {
		const velocity = Vector2.fromObj(this.body.velocity).divScalar(getSpaceScale());
		return velocity.watch(this.setVelocity.bind(this));
	}
	private setVelocity(velocity: Vector2) {
		this.velocity = velocity;
	}

	get angle() {
		return this.body.angle;
	}

	get angularVelocity() {
		return this.body.angularVelocity;
	}

	get static() {
		return this.body.isStatic;
	}

	get ghost() {
		return this.body.isSensor;
	}

	set position(position: Vertex2) {;
		const spaceScale = getSpaceScale();
		position = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
		Matter.Body.setPosition(this.body, position);
	}

	set velocity(velocity: Vertex2) {
		const spaceScale = getSpaceScale();
		velocity = Matter.Vector.create(velocity.x * spaceScale, velocity.y * spaceScale);
		Matter.Body.setVelocity(this.body, velocity);
	}

	set angle(angle: number) {
		Matter.Body.setAngle(this.body, angle);
	}

	set angularVelocity(angularVelocity: number) {
		Matter.Body.setAngularVelocity(this.body, angularVelocity);
	}

	set static(isStatic: boolean) {
		Matter.Body.setStatic(this.body, isStatic);
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
