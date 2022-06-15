/// <reference path = "../declareBrass.ts"/>

const splatMaxRadius = 0.2;
const tileMapSize = 128;
let viewpoint, tilemap;

function setup() {
	viewpoint = new Brass.Viewpoint(64);

	Brass.init({
		viewpoint,
		matter: {
			gravity: {
				scale: 0
			}
		}
	});

	tilemap = new Brass.Tilemap(tileMapSize, tileMapSize, {
		fields: {
			"wall": "uint8",
			"splats": "sparse"
		},
		solidField: "wall",

		drawCacheMode: "always",

		getTileData: function (x, y) {
			const wall = this.get(x, y, this.WALL);

			let neighbourWalls = [false, false, false, false];
			let splats = [];

			if (wall) {
				neighbourWalls = [
					this.get(x + 1, y, this.WALL) ?? false,
					this.get(x, y - 1, this.WALL) ?? false,
					this.get(x - 1, y, this.WALL) ?? false,
					this.get(x, y + 1, this.WALL) ?? false,
				];
			} else {
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
			}

			return {
				wall,
				neighbourWalls,
				splats
			};
		},

		drawOrder: function ({ wall }) {
			// draw floor first, then walls
			return wall ? 2 : 1;
		},

		drawTile: function ({ wall, neighbourWalls, splats }, x, y, g) {
			if (wall) {
				g.noStroke();
				g.fill(50, 40, 60);
				g.rect(x, y, 1, 1);

				g.strokeWeight(0.1);
				g.strokeCap(PROJECT);
				if (!neighbourWalls[0]) {
					g.stroke(15, 5, 40);
					g.line(x + 0.95, y + 0.05, x + 0.95, y + 0.95);
				}
				if (!neighbourWalls[3]) {
					g.stroke(15, 5, 40);
					g.line(x + 0.05, y + 0.95, x + 0.95, y + 0.95);
				}
				if (!neighbourWalls[1]) {
					g.stroke(90, 85, 95);
					g.line(x + 0.05, y + 0.05, x + 0.95, y + 0.05);
				}
				if (!neighbourWalls[2]) {
					g.stroke(90, 85, 95);
					g.line(x + 0.05, y + 0.05, x + 0.05, y + 0.95);
				}
			} else {
				g.noStroke();
				g.fill(242);
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

function draw() {
	Brass.setTestStatus(frameCount > 60);

	tilemap.set(true, 0, 0, tilemap.WALL);
	tilemap.set(true, 1, 1, tilemap.WALL);
	tilemap.set(true, 2, 1, tilemap.WALL);
	tilemap.set(true, 1, 2, tilemap.WALL);
	addSplat(mouseX / 100, mouseY / 100, floor(random(360)));

	viewpoint.view();
	tilemap.draw();
}