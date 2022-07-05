/// <reference path = "../declareBrass.ts"/>

const TileType = {
	// 0 is null, should exist before Tiled map is loaded
	Ground: 1,
	Wall: 2
};
const startPosition = {
	x: 7.5,
	y: 60.5,
};
const tileMapSize = 128;
// list of guns, how to draw them and how they shoot
const weapons = [{
	shootCooldown: 380,
	paintSpeed: 0.4,
	spread: 0.05,
	paintCount: 1,
	paintDamage: 2,
	paintSplit: false,
	draw: () => { // pistol
		fill("magenta");
		rect(-0.06, -0.2, 0.12, 0.2, 0.1);
		fill("green");
		rect(-0.03, -0.45, 0.06, 0.45, 0.05);
	}
}, {
	shootCooldown: 550,
	paintSpeed: 0.35,
	spread: 0.4,
	paintCount: 6,
	paintDamage: 1,
	paintSplit: false,
	draw: () => { // shotgun
		fill("mediumSeaGreen");
		rect(-0.08, -0.5, 0.16, 0.3, 0.1);
		fill("chocolate");
		rect(-0.04, -0.6, 0.08, 0.6, 0.05);
		fill("mediumSeaGreen");
		rect(-0.06, -0.1, 0.12, 0.1, 0.03);
	}
}, {
	shootCooldown: 150,
	paintSpeed: 0.45,
	spread: 0.16,
	paintCount: 1,
	paintDamage: 1,
	paintSplit: false,
	draw: () => { // sub-machine gun
		fill("blue");
		rect(-0.05, -0.65, 0.1, 0.35, 0.04);
		fill("red");
		rect(-0.07, -0.4, 0.14, 0.4, 0.08);
		fill("lightBlue");
		circle(0, -0.2, 0.08);
	}
}, {
	shootCooldown: 100,
	paintSpeed: 0.5,
	spread: 0.12,
	paintCount: 1,
	paintDamage: 1,
	paintSplit: false,
	draw: () => { // machine gun
		fill("blueViolet");
		rect(-0.05, -0.7, 0.1, 0.4, 0.05);
		fill("magenta");
		rect(-0.11, -0.4, 0.22, 0.4, 0.1);
		fill("cyan");
		circle(0, -0.2, 0.08);
		circle(0, -0.1, 0.08);
	}
}, {
	shootCooldown: 1200,
	paintSpeed: 0.28,
	spread: 0.22,
	paintCount: 1,
	paintDamage: 2,
	paintSplit: true,
	draw: () => { // rocket launcher
		fill("fuchsia");
		rect(-0.1, -0.3, 0.2, 0.2, 0.06);
		fill("midnightBlue");
		rect(-0.05, -0.7, 0.1, 0.7, 0.04);
		fill("indigo");
		rect(-0.08, -0.8, 0.16, 0.25, 0.06);
	}
}];
const paintballs = [];
const enemies = [];
const droppedWeapons = [];
const enemySpawns = []; // locations where enemies can spawn
let enemySpawnCooldown = 0;
let enemyCap = 0;
let messageEndTime = null;
let viewpoint, tilemap, player, pathfinder;

function preload() {
	// load the level and add to tilemap
	Brass.loadLevelLate({
		"tile": "uint8"
	}, "tilemap.json").then((level) => {
		tilemap.import(level);
		for (const obj of level.objects) {
			const position = new Brass.Vector2(obj.x / 8, obj.y / 8);

			if (obj.type === "spawn") {
				enemySpawns.push(position);
			} else if (obj.type.startsWith("gun")) {
				const gunType = Number(obj.type.substring(3, Infinity));
				droppedWeapons.push({
					type: gunType,
					position,
					angle: random(TWO_PI)
				});
			} else {
				throw Error("Bad level object data");
			}
		}
	});
}

function setup() {
	// 64 is the amount of screen pixels per scene unit
	// basically this is the camera zoom
	viewpoint = new Brass.Viewpoint(64, Brass.Vector2.fromObj(startPosition));

	// start Brass engine with Matter.js physics
	Brass.init({
		viewpoint,
		matter: {
			spaceScale: 10,
			gravity: {
				scale: 0
			}
		}
	});

	player = new Player();

	// create tilemap with lots of custom functions inside
	tilemap = new Brass.P5Tilemap(tileMapSize, tileMapSize, {
		fields: {
			"tile": "uint8",
			"splats": "sparse"
		},
		body: true,
		drawCacheMode: "always",
		drawCachePadding: 4,

		// get info from tilemap so we can draw a tile or find if solid
		getTileData: function(x, y) {
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

		// walls are solid, floor is not
		isTileSolid: function({
			tile
		}) {
			return tile === TileType.Wall;
		},

		// draw walls over floors
		drawOrder: function({
			tile
		}) {
			// draw floor first
			if (tile !== TileType.Wall) return 1;
			else return 2; // then walls second
		},

		drawTile: function({
			tile,
			shade,
			neighbourWalls,
			splats
		}, x, y, g) {
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
					const u = x + splat.x,
						v = y + splat.y;

					g.fill(`hsl(${splat.hue}, 100%, 65%)`);
					g.circle(u, v, splat.radius * 2);
				}
			}
		}
	});

	// create a hive-mind for the enemies
	pathfinder = new Brass.AStarPathfinder(tilemap);
}

function brassUpdate(delta) {
	Brass.setTestStatus(frameCount > 60);
	
	player.update(delta);
	pathfinder.setGoal(player.body.position);

	enemyCap = floor(min(100, 6 + 0.0000011 * pow(Brass.getSimTime(), 1.4)));
	enemySpawnCooldown -= delta;
	if (enemies.length < enemyCap && enemySpawnCooldown <= 0) {
		const position = enemySpawns[floor(random(enemySpawns.length))];
		const playerDist = player.body.position.dist(position);
		
		let valid = player.holding !== null && playerDist > 32 && playerDist < 96;
		
		for (const enemy of enemies) {
			if (enemy.body.position.dist(position) < 2) valid = false;
		}
		
		// everyone is valid...
		// unless they are an enemy within 2 units of another enemy
		// or closer than 32 units to the player
		// or further than 96 units to the player
		if (valid) {
			new Enemy(position);
			enemySpawnCooldown = 30000 / enemyCap;
		}
	}
	
	for (let i = 0; i < enemies.length; i++) {
		const enemy = enemies[i];
		if (!enemy.body.alive) {
			enemies.splice(i, 1);
			i--;
			continue;
		}
		enemy.update(delta);
	}
	
	for (let i = 0; i < paintballs.length; i++) {
		const paintball = paintballs[i];
		if (!paintball.body.alive) {
			paintball.splat();
			paintballs.splice(i, 1);
			i--;
			continue;
		}
		paintball.update(delta);
	}
}

function brassDraw() {
	background(`hsl(${floor(Brass.getSimTime() * 0.4) % 360}, 50%, 50%)`);
	push();
	viewpoint.view();

	tilemap.draw();

	for (const weapon of droppedWeapons) {
		if (weapon.position.dist(player.body.position) > 32) continue;
		push();
		translate(weapon.position.x, weapon.position.y);
		rotate(weapon.angle);
		translate(0, 0.3);
		scale(1.7);
		noStroke();
		weapons[weapon.type].draw();
		pop();
	}

	for (const enemy of enemies) {
		if (enemy.body.position.dist(player.body.position) > 32) continue;
		enemy.draw();
	}

	for (const paintball of paintballs) paintball.draw();

	player.draw();
	pop();

	if (messageEndTime === null || Brass.getSimTime() < messageEndTime) {
		push();
		textAlign(CENTER, CENTER);
		textSize(64);
		strokeWeight(6);
		stroke(0);
		fill(player.holding === null ? "white" : "red")
		text(player.holding === null ? "Find a weapon" : "They are coming", width / 2, 48);
		if (player.holding !== null && messageEndTime === null) {
			messageEndTime = Brass.getSimTime() + 6000;
		}
		pop();
	}
}

class Paintball {
	constructor(position, velocity, damage, split) {
		this.body = new Brass.RayBody(position.x, position.y, 0.15, {
			velocity
		});
		this.body.addSensor(({
			body
		}) => {
			if (body.data !== null && body.data.enemy) {
				body.data.enemy.damage(this.damage);
			}
		});
		this.damage = damage;
		this.split = split;
		this.hue = floor(random(60, 375)) % 360;
		paintballs.push(this);
	}

	update(delta) {
		this.body.velocity.multScalar(pow(0.998, delta));
		if (this.body.velocity.mag < 0.05) {
			this.body.kill();
		}
	}

	draw() {
		const {
			x,
			y
		} = this.body.position;
		noStroke();
		fill(`hsl(${this.hue}, 100%, 40%)`);
		circle(x, y, 0.15);
	}

	// where a paintball goes to die
	splat() {
		const {
			x,
			y
		} = this.body.position;
		this.addGroundSplat(x + random(-0.1, 0.1), y + random(-0.1, 0.1), this.hue);
		this.addGroundSplat(x + random(-0.2, 0.2), y + random(-0.2, 0.2), this.hue);
		this.addGroundSplat(x + random(-0.3, 0.3), y + random(-0.3, 0.3), this.hue);

		if (this.split) {
			const count = floor(random(8, 12));
			for (let i = 0; i < count; i++) {
				new Paintball(
					this.body.position.copy(),
					Brass.Vector2.fromDirMag(random(TWO_PI), random(0.1, 0.14)),
					this.damage,
					random() < 0.02
				);
			}
		}
	}

	// add a splat of paint on the ground
	addGroundSplat(x, y, hue) {
		const u = Math.floor(x),
			v = Math.floor(y);
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
}

class Enemy {
	constructor(position) {
		this.body = new Brass.CircleBody(position.x, position.y, 0.45, {
			inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0
		});
		
		// stop enemies for colliding with each other
		this.body.collisionCategory = 1;
		this.body.collidesWith = 0;
		
		// add link to enemy instance into it's physics body
		// so when it collides it can be traced back to the whole enemy instance
		this.body.data = {
			enemy: this
		};
		
		this.leader = enemyCap > 20 && random() < 0.12;
		this.hp = this.leader ? 18 : 6;
		this.speed = 1;
		this.agent = pathfinder.createAgent(0.45, this.leader ? 1 : random(0.8));

		enemies.push(this);
	}

	update(delta) {
		const direction = this.agent.getDirection(this.body.position);
		if (typeof direction === "boolean") return;

		this.speed = pow(this.speed, pow(0.995, delta));

		this.body.applyForce(direction.copy()
			.norm((this.leader ? 0.005 : 0.004) * delta * this.speed));
		this.body.velocity.multScalar(pow(0.97, delta));
	}

	draw() {
		push();
		translate(this.body.position.x, this.body.position.y);
		noStroke();
		fill(0);
		const cos30 = Math.cos(PI / 6) * 0.5;
		triangle(cos30, -0.25, 0, 0.5, -cos30, -0.25);
		fill(this.leader ? "lime" : "red");
		rect(-0.1, -0.15, 0.06, 0.1);
		rect(0.04, -0.15, 0.06, 0.1);
		stroke(this.leader ? "lime" : "red");
		strokeWeight(0.04);
		noFill();
		arc(0, 0.16, 0.3, 0.03, PI, 0);
		noStroke();
		pop();
	}

	damage(amount) {
		this.hp -= amount;
		this.speed = Math.max(0.1, 0.7 - amount * 0.2);
		if (this.hp <= 0) {
			this.body.kill();
		}
	}
}

class Player {
	constructor() {
		this.useGamepad = false;
		this.body = new Brass.CircleBody(startPosition.x, startPosition.y, 0.4, {
			inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0.0
		});
		this.body.addSensor(({
			body
		}) => {
			if (body.data !== null && body.data.enemy) {
				const enemy = body.data.enemy;
				const diff = this.body.position.copy().sub(enemy.body.position).norm(1);
				this.body.applyForce(diff);
			}
		});
		this.input = new Brass.InputMapper(["keyboard", "mouse", "gamepad"], [
			"movement",
			(mapper) => {
				const sprint = mapper.button.get("keyboardShiftLeft") ||
					mapper.button.get("keyboardSpace") ||
					mapper.button.get("gamepadTriggerLeft") ||
					mapper.button.get("gamepadShoulderLeft");
				mapper.button.setSafe("sprint", sprint);
			},
			(mapper) => {
				const rightStick = mapper.vector.get("gamepadStickRight");

				if (rightStick.mag > 0) {
					this.useGamepad = true;
				}
				if (mouseX !== pmouseX || mouseY !== pmouseY) {
					this.useGamepad = false;
				}

				if (mapper.button.get("sprint") || (this.useGamepad && rightStick.mag === 0)) {
					mapper.vector.setSafe("aim", mapper.vector.get("movement").copy());
					return;
				}

				if (this.useGamepad) {
					if (rightStick.mag > 0) {
						mapper.vector.setSafe("aim", rightStick.norm());
					}
				} else {
					mapper.vector.setSafe("aim",
						new Brass.Vector2(mouseX, mouseY)
						.sub(viewpoint.worldToScreen(this.body.position))
						.norm());
				}
			},
			(mapper) => {
				let shoot = mapper.button.get("mouseLeft") ||
					mapper.button.get("gamepadTriggerRight") ||
					mapper.button.get("gamepadShoulderRight");
				shoot && this.input.vector.get("aim").mag !== 0;
				mapper.button.setSafe("shoot", shoot);
			},
		]);
		this.shootCooldown = 0;
		this.holding = null;
	}

	update(delta) {
		for (let i = 0; i < droppedWeapons.length; i++) {
			const weapon = droppedWeapons[i];
			if (weapon.position.dist(this.body.position) < 1) {
				if (player.holding !== null) {
					const wasHolding = player.holding;
					const wasAt = player.body.position.copy();
					setTimeout(() => {
						droppedWeapons.push({
							type: wasHolding,
							position: wasAt,
							angle: random(TWO_PI)
						});
					}, 1500);
				}
				player.holding = null;
				setTimeout(() => {
					player.holding = weapon.type;
				}, 600);
				droppedWeapons.splice(i, 1);
				break;
			}
		}

		const sprint = this.input.button.get("sprint");
		this.body.applyForce(this.input.vector.get("movement")
			.multScalar((sprint ? 0.0028 : 0.0016) * delta));

		const aimVector = this.input.vector.get("aim");
		this.shootCooldown -= delta;

		if (this.input.button.get("shoot") &&
			aimVector.mag > 0 &&
			this.shootCooldown <= 0 &&
			this.holding !== null) {

			const weapon = weapons[this.holding];
			this.shootCooldown = weapon.shootCooldown;

			for (let i = 0; i < weapon.paintCount; i++) {
				new Paintball(
					this.body.position.copy()
					.add(aimVector.copy()
						.multScalar(0.55)),
					aimVector.copy()
					.multScalar(weapon.paintSpeed + random(-0.05, 0.05))
					.rotate(random(-weapon.spread, weapon.spread)),
					weapon.paintDamage,
					weapon.paintSplit
				);
			}
		}
		this.body.velocity.multScalar(pow(0.986, delta));
		viewpoint.target = this.body.position;
	}

	draw() {
		push();
		translate(this.body.position.x, this.body.position.y);
		noStroke();
		fill(220, 170, 20);
		circle(0, 0, 0.8);
		fill(255);
		circle(-0.14, -0.12, 0.2);
		circle(0.14, -0.12, 0.2);

		stroke(0);
		strokeWeight(0.04);
		noFill();
		arc(0, 0.05, 0.3, 0.2, 0.2, PI - 0.2);
		noStroke();

		const lookVector = this.input.vector.get("aim").copy().multScalar(0.06);

		push();
		translate(lookVector.x, lookVector.y);
		fill(0);
		circle(-0.14, -0.12, 0.1);
		circle(0.14, -0.12, 0.1);
		pop();

		if (lookVector.mag > 0 &&
			this.holding !== null) {

			rotate(lookVector.angle);
			translate(0.6 - constrain(this.shootCooldown, 0, 650) * 0.0004, 0);
			rotate(HALF_PI);
			noStroke();
			fill(220, 170, 20);
			rect(-0.1, -0.1, 0.2, 0.2, 0.05);
			noStroke();
			weapons[this.holding].draw();
		}

		pop();
	}
}