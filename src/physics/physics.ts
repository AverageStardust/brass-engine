/**
 * Simple wrapper over Matter.js physics.
 * Ties in with tilemaps to generate physics bodies for them.
 * @module
 */

import { assert } from "../common/runtimeChecking";
import { getP5DrawTarget, P5LayerMap } from "../layers/p5Layers";
import { Vector2 } from "../vector/vector2";
import { assertMatterWorld, getMatterWorld, getSpaceScale, setMatterWorld, setSpaceScale } from "./bodyAbstract";
import { InternalMatterBody, MaterialBodyAbstract } from "./materialBodyAbstract";
import { getRays } from "./rayBody";



export type MatterWorldDefinition = Partial<Matter.IEngineDefinition & { spaceScale: number }>;



let inited = false;
let lastDelta: number | null = null;
let engine: Matter.Engine;



export function init(_options: MatterWorldDefinition = {}) {
	if (typeof Matter !== "object") {
		throw Error("Matter was not found; Can't initialize Brass physics without Matter.js loaded first");
	}

	setSpaceScale(_options.spaceScale);

	_options.gravity ??= { scale: 0 };
	const options = _options as Matter.IEngineDefinition;


	engine = Matter.Engine.create(options);
	setMatterWorld(engine.world);

	Matter.Events.on(engine, "collisionActive", handleActiveCollisions);

	inited = true;
}

function handleActiveCollisions({ pairs }: Matter.IEventCollision<Matter.Engine>) {
	const spaceScale = getSpaceScale();
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

export function update(delta: number) {
	assertMatterWorld("updating physics");

	if (lastDelta === null) lastDelta = delta;
	if (lastDelta !== 0) {
		Matter.Engine.update(engine, delta, delta / lastDelta);
	}
	lastDelta = delta;

	for (const [_, ray] of getRays().entries()) {
		const { body, point } = ray.castOverTime(delta);
		ray.position = point.copy();

		if (!body) continue;

		ray.triggerSensors({ body: body as MaterialBodyAbstract, self: ray, points: [point] });
		ray.kill();
	}
}

export function drawColliders(weight = 0.1, arrowRatio?: number,  d = getP5DrawTarget("defaultP5")) {
	const g = d.getMaps().canvas;
	g.push();
	g.noFill();
	g.strokeWeight(weight);

	g.stroke(0, 255, 0);
	drawBodies(g);

	g.stroke(255, 0, 0);
	drawRays(arrowRatio, g);

	g.pop();
}

function drawBodies(g: P5LayerMap) {
	const bodyQueue = [...getMatterWorld().bodies];
	const queuedBodies = new Set(bodyQueue.map((b) => b.id));
	const spaceScale = getSpaceScale();

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
}

function drawRays(arrowRatio: number | undefined, g: P5LayerMap) {
	g.beginShape(LINES);
	for (const ray of getRays().values()) {
		const position = ray.position;
		const endPosition = position.copy().add(ray.velocity);
		const endLength = ray.velocity.mag * (arrowRatio ?? 0.5);

		const { x: x1, y: y1 } = position;
		const { x: x2, y: y2 } = endPosition;
		const { x: x3, y: y3 } = endPosition.copy().add(ray.velocity.copy().rotate(PI * 0.75).norm(endLength));
		const { x: x4, y: y4 } = endPosition.copy().add(ray.velocity.copy().rotate(-PI * 0.75).norm(endLength));

		g.vertex(x1, y1);
		g.vertex(x2, y2);

		g.vertex(x2, y2);
		g.vertex(x3, y3);

		g.vertex(x2, y2);
		g.vertex(x4, y4);
	}
	g.endShape();
}