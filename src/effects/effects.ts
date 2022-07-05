/**
 * Simple flexible particles. 
 * They do not interact with Matter.js physics but can collide with tilemaps.
 * @module
 */

import { getP5DrawTarget } from "../layers/p5Layers";
import { Vector2, Vertex2 } from "../vector/vector2";
import { getDefaultViewpoint } from "../camera/camera";
import { Particle, ParticleClass } from "./particle";



const particles = new Map<symbol, Particle>();
let particleLimit = 300;



export function update(delta: number) {
	for (const [particleId, particle] of particles) {
		particle.update(delta);

		if (particle.alive()) continue;

		particle.kill();
		particles.delete(particleId);
	}

	if (particles.size > particleLimit) {
		removeParticles(particles.size - particleLimit);
	}
}

export function draw(v = getDefaultViewpoint(), d = getP5DrawTarget("defaultP5")) {
	const g = d.getMaps().canvas;
	const viewArea = v.getWorldViewArea(d);

	for (const [_, particle] of particles.entries()) {
		if (particle.visable(viewArea)) {
			g.push();

			g.translate(particle.position.x, particle.position.y);
			g.scale(particle.radius);

			particle.draw(g);

			g.pop();
		}
	}
}

export function forEachParticle(func: (particle: Particle) => void) {
	for (const [_, particle] of particles.entries()) {
		func(particle);
	}
}

export function forEachVisableParticle(func: (particle: Particle) => void,
	v = getDefaultViewpoint(), d = getP5DrawTarget("defaultP5")) {
	const viewArea = v.getWorldViewArea(d);

	for (const [_, particle] of particles.entries()) {
		if (particle.visable(viewArea)) func(particle);
	}
}

// removes old particles when too many are in the scene
function removeParticles(amount: number) {
	// particles stored as [key, value] in array and sorted
	const sortedParticles = [...particles.entries()]
		.sort((a, b) => a[1].radius - b[1].radius);

	amount = Math.min(amount, Math.floor(sortedParticles.length / 5));

	for (let i = 0; i < amount * 5; i += 5) {
		sortedParticles[i][1].kill();
		particles.delete(sortedParticles[i][0]);
	}
}

export function setParticleLimit(limit: number) {
	particleLimit = limit;
}

export function emitParticles(classVar: ParticleClass, amount: number, position: Vertex2, ...data: any[]) {
	// percent of limit filled
	const limitFilled = particles.size / particleLimit;
	// spawn less when near/over limit
	amount *= Math.max(0.1, 1 - Math.pow(limitFilled * 0.9, 6));

	while (amount > 1 || amount > Math.random()) {
		spawnParticle(classVar, position, data);

		amount--;
	}
}

export function emitParticle(classVar: ParticleClass, position: Vertex2, ...data: any[]) {
	// percent of limit filled
	const limitFilled = particles.size / particleLimit;
	// don't spawn less when over limit
	if (limitFilled > 1 &&
		limitFilled > 1 + Math.random()) return;

	spawnParticle(classVar, position, data);
}

function spawnParticle(classVar: ParticleClass, position: Vertex2, data: any[]) {
	const particle = new classVar(...data);
	particle.position = Vector2.fromObj(position);

	particles.set(Symbol(), particle);
}