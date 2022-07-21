import { P5LayerMap } from "../layers/p5Layers";
import { getTime } from "../core/time";
import { Vector2 } from "../vector/vector2";



export type ParticleClass = new (...rest: unknown[]) => Particle;



export class Particle {

	position!: Vector2;
	radius = 1;
	lifetime = 5000;
	private spawnTime: number;

	constructor() {
		this.spawnTime = getTime();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(delta: number) {
		// do nothing
	}

	draw(g: P5LayerMap) {
		g.noStroke();
		g.fill(255, 0, 255);
		g.circle(0, 0, 2);
	}

	alive() {
		return this.age < 1;
	}

	visable(viewArea: {
		minX: number; minY: number; maxX: number; maxY: number;
	}) {
		return (
			this.position.x + this.radius > viewArea.minX &&
			this.position.x - this.radius < viewArea.maxX &&
			this.position.y + this.radius > viewArea.minY &&
			this.position.y - this.radius < viewArea.maxY);
	}

	// removes particle
	kill() {
		// do nothing
	}

	get age() {
		return (getTime() - this.spawnTime) / this.lifetime;
	}
}
