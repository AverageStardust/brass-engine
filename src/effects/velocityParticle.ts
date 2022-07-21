import { TilemapAbstract } from "../tilemap/tilemapAbstract";
import { Vector2 } from "../vector/vector2";
import { Particle } from "./particle";



export class VelocityParticle extends Particle {
	protected velocity: Vector2;

	constructor(velocity = new Vector2()) {
		super();
		this.velocity = velocity;
	}

	protected updateKinomatics(delta: number) {
		this.position.add(this.velocity.copy().multScalar(delta));
	}

	// simple collision without matter.js
	protected collide(tilemap: TilemapAbstract) {
		const { x, y } = this.position.copy().divScalar(tilemap.tileSize);
		const radius = this.radius / tilemap.tileSize;
		let deltaX = 0, deltaY = 0;

		if (tilemap.getSolid(Math.floor(x - radius), Math.floor(y)) &&
			!tilemap.getSolid(Math.floor(x - radius) + 1, Math.floor(y))) {
			deltaX = Math.ceil(x - radius) + radius - x;
		}

		if (tilemap.getSolid(Math.floor(x + radius), Math.floor(y)) &&
			!tilemap.getSolid(Math.floor(x + radius) - 1, Math.floor(y))) {

			const newDeltaX = Math.floor(x + radius) - radius - x;
			if (deltaX === 0 || Math.abs(newDeltaX) < Math.abs(deltaX))
				deltaX = newDeltaX;
		}

		if (tilemap.getSolid(Math.floor(x), Math.floor(y - radius)) &&
			!tilemap.getSolid(Math.floor(x), Math.floor(y - radius) + 1)) {
			deltaY = Math.ceil(y - radius) + radius - y;
		}

		if (tilemap.getSolid(Math.floor(x), Math.floor(y + radius)) &&
			!tilemap.getSolid(Math.floor(x), Math.floor(y + radius) - 1)) {

			const newDeltaY = Math.floor(y + radius) - radius - y;
			if (deltaY === 0 || Math.abs(newDeltaY) < Math.abs(deltaY))
				deltaY = newDeltaY;
		}

		if (deltaX !== 0 && deltaY !== 0) {
			if (Math.abs(deltaX) < Math.abs(deltaY)) {
				this.position.x += deltaX * tilemap.tileSize;
				this.velocity.x = 0;
			} else {
				this.position.y += deltaY * tilemap.tileSize;
				this.velocity.y = 0;
			}
		} else if (deltaX !== 0) {
			this.position.x += deltaX * tilemap.tileSize;
			this.velocity.x = 0;
		} else if (deltaY !== 0) {
			this.position.y += deltaY * tilemap.tileSize;
			this.velocity.y = 0;
		}
	}
}
