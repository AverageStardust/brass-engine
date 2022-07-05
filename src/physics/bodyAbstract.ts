import { assert } from "../common/runtimeChecking";
import { Opaque } from "../common/types";
import { Vector2, Vertex2 } from "../vector/vector2";



export interface Collision {
	body: BodyAbstract;
	self: BodyAbstract;
	points: Vector2[];
}

export type CollisionCallback = (collision: Collision) => void;
export type CollisionFilterIndex = Opaque<number, "CollisionFilterIndex">; // index for bitmask, between 0 and 31 inclusive
export type CollisionFilterMask = Opaque<number, "CollisionFilterMask">; // bitmask for what categories to collide with
export type CollisionFilterCategory = Opaque<number, "CollisionFilterCategory">; // bitmask with one bit set for collisions



let spaceScale: number;
let world: Matter.World;



export function setMatterWorld(_world: Matter.World) {
	world = _world;
}

export function getMatterWorld() {
	return world;
}

export function assertMatterWorld(action = "") {
	assert(getMatterWorld() !== undefined, `Failed ${action}, Matter physics is not running`);
}

export function setSpaceScale(_spaceScale?: number) {
	spaceScale = _spaceScale ?? 1;
}

export function getSpaceScale() {
	return spaceScale;
}

export abstract class BodyAbstract {
	private sensors: CollisionCallback[] = [];
	alive = true;
	data: any = null;

	constructor() {
		assertMatterWorld("creating a physics body");
	}

	abstract get position(): Vector2;
	abstract get velocity(): Vector2;
	abstract get angle(): number;
	abstract get angularVelocity(): number;
	abstract get static(): boolean;
	abstract get ghost(): boolean;

	abstract set position(position: Vector2);
	abstract set velocity(velocity: Vector2);
	abstract set angle(angle: number);
	abstract set angularVelocity(angularVelocity: number);
	abstract set static(isStatic: boolean);
	abstract set ghost(isGhost: boolean);
	abstract set collisionCategory(category: number);
	abstract set collidesWith(category: "everything" | "nothing" | number | number[]);

	addSensor(callback: CollisionCallback) {
		this.sensors.push(callback);
		return this;
	}

	removeSensor(callback: CollisionCallback) {
		const index = [].findIndex((sensor) => sensor === callback);

		this.sensors.splice(index, 1);
		return this;
	}

	triggerSensors(collision: Collision) {
		this.sensors.forEach((callback) => callback(collision));
		return this;
	}

	abstract rotate(rotation: number): this;
	abstract applyForce(force: Vertex2, position?: Vertex2): this;
	kill() {
		this.alive = false;
	}

	protected validateCollisionIndex(index: number): CollisionFilterCategory {
		if (typeof index !== "number" ||
			index !== Math.floor(index))
			throw Error("Collision category must be an integer");
		if (index < 0 || index > 31)
			throw Error("Collision category must be in 0 through 31 inclusive");

		return index as CollisionFilterCategory;
	}

	protected validateCollisionMask(mask: number): CollisionFilterMask {
		if (typeof mask !== "number" ||
			mask !== Math.floor(mask))
			throw Error("Collision mask must be an integer");
		if (mask < 0x00000000 || mask > 0xFFFFFFFF)
			throw Error("Collision mask must be 32-bit");

		return mask as CollisionFilterMask;
	}

	protected collisionIndexToCategory(index: number): CollisionFilterCategory {
		this.validateCollisionIndex(index);
		return 1 << index as CollisionFilterCategory;
	}

	protected collisionCategoryToIndex(category: number): CollisionFilterIndex {
		if (category === 0x8000) {
			return 31 as CollisionFilterIndex;
		} else {
			const index = Math.log2(category);
			if (index !== Math.floor(index))
				throw Error("Internal Matter.js body could not be fit in one collision category");
			return index as CollisionFilterIndex;
		}
	}
}
