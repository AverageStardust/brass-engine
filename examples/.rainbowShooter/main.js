/// <reference path = "../declareBrass.ts"/>

const TileType = {
	Ground: 1,
	Wall: 2
};
const startPosition = {
	x: 7.5,
	y: 60.5,
};
const tileMapSize = 128;
let viewpoint, tilemap, player;

function preload() {
	Brass.loadWorldLate({
		"tile": "uint8"
	}, "tilemap.json").then((world) => {
		tilemap.import(world);
	});
}

function setup() {
	viewpoint = new Brass.Viewpoint(64, Brass.Vector2.fromObj(startPosition));

	Brass.init({
		viewpoint,
		matter: {
			spaceScale: 20
		}
	});

	player = new Player();

	tilemap = new Brass.Tilemap(tileMapSize, tileMapSize, {
		fields: {
			"tile": "uint8",
			"splats": "sparse"
		},

		drawCacheMode: "always",

		body: true,

		getTileData: function (x, y) {
			const tile = this.get(x, y, this.TILE);

			let neighbourWalls = [0, 0, 0, 0];
			let splats = [];
			let shade = 0;

			if (tile === TileType.Wall) {
				neighbourWalls = [
					this.get(x + 1, y, this.TILE) ?? 0,
					this.get(x, y - 1, this.TILE) ?? 0,
					this.get(x - 1, y, this.TILE) ?? 0,
					this.get(x, y + 1, this.TILE) ?? 0,
				];
			} else if (tile === TileType.Ground) {
				for (let u = x - 1; u <= x + 1; u++) {
					for (let v = y - 1; v <= y + 1; v++) {
						const tileSplats = this.get(u, v, this.SPLATS);
						if (!tileSplats) continue;
						for (const splat of tileSplats) {
							if (splat.x > x - splat.radius &&
								splat.y > y - splat.radius &&
								splat.x < x + 1 + splat.radius &&
								splat.y < y + 1 + splat.radius) {
								splats.push({
									x: splat.x - x,
									y: splat.y - y,
									radius: splat.radius,
									hue: splat.hue
								});
							}
						}
					}
				}

				shade = noise(x * 0.3, y * 0.3);
			}

			return {
				tile,
				shade,
				neighbourWalls,
				splats
			};
		},

		isTileSolid: function ({ tile }) {
			return tile === TileType.Wall;
		},

		drawOrder: function ({ tile }) {
			// draw floor first
			if (tile !== TileType.Wall) return 1;
			else return 2; // then walls second
		},

		drawTile: function ({ tile, shade, neighbourWalls, splats }, x, y, g) {
			if (tile === TileType.Wall) {
				g.noStroke();
				g.fill(50, 40, 60);
				g.rect(x, y, 1, 1);

				g.strokeWeight(0.1);
				g.strokeCap(PROJECT);
				if (neighbourWalls[0] !== TileType.Wall) {
					g.stroke(15, 5, 40);
					g.line(x + 0.95, y + 0.05, x + 0.95, y + 0.95);
				}
				if (neighbourWalls[3] !== TileType.Wall) {
					g.stroke(15, 5, 40);
					g.line(x + 0.05, y + 0.95, x + 0.95, y + 0.95);
				}
				if (neighbourWalls[1] !== TileType.Wall) {
					g.stroke(90, 85, 95);
					g.line(x + 0.05, y + 0.05, x + 0.95, y + 0.05);
				}
				if (neighbourWalls[2] !== TileType.Wall) {
					g.stroke(90, 85, 95);
					g.line(x + 0.05, y + 0.05, x + 0.05, y + 0.95);
				}
			} else if (tile === TileType.Ground) {
				g.noStroke();
				g.fill(225 + shade * 30);
				g.rect(x, y, 1, 1);

				for (const splat of splats) {
					const u = x + splat.x, v = y + splat.y;

					g.fill(`hsl(${splat.hue}, 100%, 60%)`);
					g.circle(u, v, splat.radius * 2);
				}
			}
		}
	});
}

function addSplat(x, y, hue) {
	const u = Math.floor(x), v = Math.floor(y);

	let splats = tilemap.get(u, v, tilemap.SPLATS);
	if (splats === undefined) return;
	if (splats === null) splats = [];

	splats.push({
		x,
		y,
		radius: random(0.1, 0.5),
		hue
	})

	tilemap.set(splats, u, v, tilemap.SPLATS);
	tilemap.clearCacheAtTile(u - 1, v - 1);
	tilemap.clearCacheAtTile(u + 1, v - 1);
	tilemap.clearCacheAtTile(u - 1, v + 1);
	tilemap.clearCacheAtTile(u + 1, v + 1);
}

function brassUpdate() {
	Brass.setTestStatus(frameCount > 60);

	player.update();
}

function brassDraw() {
	viewpoint.view();
	tilemap.draw();
	Brass.drawColliders(0.1);
}

class Player {
	constructor() {
		this.input = new Brass.InputMapper();
		this.body = new Brass.CircleBody(startPosition.x, startPosition.y, 0.4, {
			inertia: Infinity, friction: 0, frictionStatic: 0, frictionAir: 0.25
		});
	}

	update() {
		this.body.velocity.add(this.input.vector.get("movement").multScalar(0.04));
	}
}