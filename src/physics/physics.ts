/**
 * Simple wrapper over Matter.js physics.
 * Ties in with tilemaps to generate physics bodies for them.
 * @module
 */

import { Opaque } from "../common/types";
import { getP5DrawTarget } from "../layers/p5Layers";
import { Vector2 } from "../vector/vector2";
import { BodyAbstract } from "./bodyAbstract";
import { MaterialBodyAbstract } from "./materialBodyAbstract";
import { RayBody } from "./rayBody";



export interface Collision {
	body: BodyAbstract;
	self: BodyAbstract;
	points: Vector2[];
}
export type CollisionCallback = (collision: Collision) => void;
export type InternalMatterBody = Matter.Body & { collisionFilter: { category: CollisionFilterCategory }, __brassBody__: MaterialBodyAbstract };
export type CollisionFilterIndex = Opaque<number, "CollisionFilterIndex">; // index for bitmask, between 0 and 31 inclusive
export type CollisionFilterMask = Opaque<number, "CollisionFilterMask">; // bitmask for what categories to collide with
export type CollisionFilterCategory = Opaque<number, "CollisionFilterCategory">; // bitmask with one bit set for collisions
export type MatterWorldDefinition = Partial<Matter.IEngineDefinition & { spaceScale: number }>;



let inited = false;
let lastDelta: number | null = null;
let engine: Matter.Engine;
let world: Matter.World;
let spaceScale: number;
//TODO: fix this mess
export const rays: Map<symbol, RayBody> = new Map();
export const bodies: { [index: CollisionFilterIndex]: Map<number, MaterialBodyAbstract> } = Array(32).fill(null).map(() => new Map());
export const forceUnit = 1e-6;



export function init(_options: MatterWorldDefinition = {}) {
	if (typeof Matter !== "object") {
		throw Error("Matter was not found; Can't initialize Brass physics without Matter.js initialized first");
	}

	_options.gravity ??= { scale: 0 };
	spaceScale = _options.spaceScale ?? 1;
	const options = _options as Matter.IEngineDefinition;

	engine = Matter.Engine.create(options);
	world = engine.world;

	Matter.Events.on(engine, "collisionActive", handleActiveCollisions);

	inited = true;
}

function handleActiveCollisions({ pairs }: Matter.IEventCollision<Matter.Engine>) {
	pairs.map((pair) => {
		const bodyA = (pair.bodyA as InternalMatterBody).__brassBody__;
		const bodyB = (pair.bodyB as InternalMatterBody).__brassBody__;
		const points: Vector2[] = [];
		for (const { vertex } of pair.activeContacts) {
			points.push(new Vector2(vertex.x / spaceScale, vertex.y / spaceScale));
		}
		bodyA.triggerSensors({ self: bodyA, body: bodyB, points: points.map(v => v.copy()) });
		bodyB.triggerSensors({ self: bodyB, body: bodyA, points });
	});
}

export function isPhysicsActive() {
	return inited;
}

export function enforceInit(action: string) {
	if (inited) return;
	throw Error(`Matter must be enabled in Brass.init() before ${action}`);
}

export function update(delta: number) {
	enforceInit("updating physics");

	if (lastDelta === null) lastDelta = delta;
	if (lastDelta !== 0) {
		Matter.Engine.update(engine, delta, delta / lastDelta);
	}
	lastDelta = delta;

	for (const [_, ray] of rays.entries()) {
		const { body, point } = ray.castOverTime(delta);
		ray.position = point.copy();

		if (!body) continue;

		ray.triggerSensors({ body: body as MaterialBodyAbstract, self: ray, points: [point] });
		ray.kill();
	}
}

export function drawColliders(weight = 0.5, d = getP5DrawTarget("defaultP5")) {
	const g = d.getMaps().canvas;
	g.push();
	g.noFill();
	g.stroke(0, 255, 0);
	g.strokeWeight(weight);

	const bodyQueue = [...world.bodies];
	const queuedBodies = new Set(bodyQueue.map((b) => b.id));

	while (bodyQueue.length > 0) {
		const body = bodyQueue.pop() as Matter.Body;

		for (const part of body.parts) {
			if (!queuedBodies.has(part.id)) {
				bodyQueue.push(part);
				queuedBodies.add(part.id)
			}
		}

		g.beginShape();
		for (const vert of body.vertices) {
			g.vertex(vert.x / spaceScale, vert.y / spaceScale);
		}
		g.endShape(CLOSE);
	}
	g.pop();

	//TODO: draw rays
}

export function getMatterWorld() {
	return world;
}

export function getSpaceScale() {
	return spaceScale;
}

export function createRectBodyFast(x: number, y: number, width: number, height: number) {
	const body = {
		id: Matter.Common.nextId(),
		type: "body",
		label: "rectBody",
		plugin: {},
		parts: [],
		angle: 0,
		vertices: [
			{ x: -width * 0.5, y: -height * 0.5, index: 0, isInternal: false },
			{ x: width * 0.5, y: -height * 0.5, index: 1, isInternal: false },
			{ x: width * 0.5, y: height * 0.5, index: 2, isInternal: false },
			{ x: -width * 0.5, y: height * 0.5, index: 3, isInternal: false }
		],
		position: { x: x + width * 0.5, y: y + height * 0.5 },
		force: { x: 0, y: 0 },
		torque: 0,
		positionImpulse: { x: 0, y: 0 },
		constraintImpulse: { x: 0, y: 0, angle: 0 },
		totalContacts: 0,
		speed: 0,
		angularSpeed: 0,
		velocity: { x: 0, y: 0 },
		angularVelocity: 0,
		isSensor: false,
		isStatic: false,
		isSleeping: false,
		motion: 0,
		sleepThreshold: 60,
		density: 0.001,
		restitution: 0,
		friction: 0.1,
		frictionStatic: 0.5,
		frictionAir: 0.01,
		collisionFilter: {
			category: 0x0001,
			mask: 0xFFFFFFFF,
			group: 0
		},
		slop: 0.05,
		timeScale: 1,
		circleRadius: 0,
		positionPrev: { x: x + width * 0.5, y: y + height * 0.5 },
		anglePrev: 0,
		area: 0,
		mass: 0,
		inertia: 0,
		_original: null
	} as unknown as Matter.Body;

	body.parts = [body];
	body.parent = body;

	Matter.Body.set(body, {
		bounds: Matter.Bounds.create(body.vertices),
		vertices: body.vertices,
	});

	Matter.Bounds.update(body.bounds, body.vertices, body.velocity);

	return body;
}