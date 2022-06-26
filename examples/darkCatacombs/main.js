/// <reference path = "../declareBrass.ts"/>

const startPosition = { x: 30.499999, y: 33.499999 };
const ReaperState = {
	hidden: 0,
	show: 1,
	hide: 2
};
const candles = new Map();
// list of positions for identical hallways
// when the player is inside one hallway they can be seamlessly teleported to another
const warpPoints = [];
let viewpoint, tilemap, tilesheet, lighter, player, reaper;
// 0: outside, bright
// 1: inside, dark
let areaDarkness = 0;
let drawFresh = false;

function load() {
	Brass.loadImageLate("tilesheet.png")
		.then((image) => tilesheet = image);
	Brass.loadWorldLate({
		"tile": "uint8",
	}, "tilemap.json")
		.then((world) => {
			tilemap.import(world);
			for (let x = 0; x < tilemap.width; x++) {
				for (let y = 0; y < tilemap.height; y++) {
					const tile = tilemap.get(x, y);
					if (tile === 8) {
						warpPoints.push(new Brass.Vector2(x + 0.5, y + 0.5));
					} else if (tile === 14) {
						new Candle(x, y, false);
					} else if (tile === 15) {
						new Candle(x, y, true);
					}
				}
			}
		});
}

function setup() {
	viewpoint = new Brass.Viewpoint(32, Brass.Vector2.fromObjFast(startPosition), {
		integerScaling: true
	});

	Brass.init({
		viewpoint,
		matter: {
			spaceScale: 20
		}
	});

	load();

	Brass.getDrawTarget("defaultP5").setSizer(() => {
		const edgeWidth = Math.min(window.innerWidth, window.innerHeight);
		viewpoint.scale = edgeWidth / 12;
		return { x: edgeWidth, y: edgeWidth };
	});

	tilemap = new Brass.P5Tilemap(128, 128, {
		fields: {
			"tile": "uint8",
			"candles": "sparse"
		},
		body: true,
		drawTile: function (tile, x, y, g) {
			if (tile === 0) return;
			if (tile === 8) tile = 7;
			tile--;
			const
				u = tile % 8,
				v = Math.floor(tile / 8);
			g.noSmooth();
			g.image(tilesheet, x, y, 1, 1, u * 16, v * 16, 16, 16);
		},
		isTileSolid: function (tile) {
			return tile === 1;
		}
	});

	lighter = new Brass.P5Lighter({ resolution: 0.5, blur: 0.6 });

	player = new Player();

	reaper = new Reaper();
}

function brassUpdate(delta) {
	player.update(delta);
	reaper.update(delta);
	for (const candle of candles.values()) {
		candle.update(delta);
	}
}

function brassDraw() {
	background(0);

	viewpoint.view();

	noSmooth();
	tilemap.draw();
	reaper.draw();
	player.draw();
	Brass.drawParticles();

	lighter.begin();

	if (areaDarkness < 1) {
		lighter.fill(255, (1 - areaDarkness) * 255);
		lighter.world(0);
	}

	for (const candle of candles.values()) {
		candle.drawLight();
	}

	player.drawLight();

	smooth();
	lighter.end();

	drawFresh = false;
}

class Player {
	constructor() {
		this.body = new Brass.CircleBody(startPosition.x, startPosition.y, 0.4, {
			inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir: 0
		});
		this.body.collisionCategory = 1;
		this.input = new Brass.InputMapper();
		this.walkCycle = 0;
		this.candleLit = false;
		this.warpCooldown = 0;
		this.speed = 1;
	}

	update(delta) {
		this.speed = pow(this.speed, pow(0.9965, delta));
		this.body.applyForce(this.input.vector.get("movement").multScalar(0.03 * this.speed));
		this.body.velocity.multScalar(Math.pow(0.98, delta));

		for (const candle of candles.values()) {
			if (candle.position.dist(this.body.position) < 1) {
				if (!this.candleLit && candle.lit) {
					this.candleLit = true;
				}
				if (this.candleLit && !candle.lit) {
					candle.light();
				}
			}
		}

		this.warpCooldown -= delta;
		if (this.warpCooldown <= 0) {
			for (const warpPoint of warpPoints) {
				// seamlessly teleport player to disorient them
				if (warpPoint.dist(this.body.position) < 0.4) {
					const targetWarpPoint = warpPoints[floor(random(warpPoints.length))];
					const differance = targetWarpPoint.copy().sub(warpPoint);
					// move player
					this.body.position.add(differance);
					// move flames
					Brass.forEachVisableParticle((particle) => {
						particle.position.add(differance);
					});
					// move camera
					viewpoint.translation.add(differance);

					// throw out any cached lighting data
					drawFresh = true;
					this.warpCooldown = 2500;
					break;
				}
			}
		}

		if (this.candleLit) {
			emitCandleFire(this.body.position.copy().addScalar(-0.38, -0.35), delta);
		}

		this.walkCycle = (this.walkCycle + this.body.velocity.mag * 0.8) % 1;

		const { x, y } = this.body.position;
		areaDarkness = Math.min(1, (Math.max(0, x - 34) + Math.max(0, y - 41)) * 0.1);
		viewpoint.target = this.body.position;
	}

	draw() {
		const { x, y } = this.body.position;
		const walkFootUpRatio = Math.min(1.5, 0.5 + this.body.velocity.mag * 12);
		const frame = Math.round(Math.sin(this.walkCycle * TWO_PI) * walkFootUpRatio) + 1;

		image(tilesheet, x - 0.5, y - 0.5, 1, 1, frame * 16, 32, 16, 16);
		image(tilesheet, x - 0.5, y - 0.5, 1, 1, this.candleLit ? 64 : 48, 32, 16, 16);
	}

	drawLight() {
		if (!this.candleLit) return;
		const { x, y } = this.body.position;
		lighter.fill(255);
		lighter.directional(x, y, 5.2, {
			cacheName: "playerLight",
			cacheTime: drawFresh ? 0 : 100,
			rays: 50,
			raysCollideWith: 0,
		});
	}
}


class Reaper {
	constructor() {
		this.showPosition = new Brass.Vector2();
		this.hidePosition = new Brass.Vector2();
		this.showProgress = 0;
		this.stateTime = 0;
		this.state = ReaperState.hidden;
	}

	update(delta) {
		this.stateTime += delta;
		switch (this.state) {
			case ReaperState.hidden:
				if (areaDarkness < 1 ||
					!player.candleLit ||
					Brass.getSimTime() < 15000 ||
					this.stateTime < 5000) break;

				this.showPosition = player.body.position.copy()
					.add(Brass.Vector2.fromDirMag(random(TWO_PI), random(5, 9)));
				const awayFromPlayerAngle = this.showPosition.angleTo(player.body.position) + PI;
				this.hidePosition = this.showPosition.copy()
					.add(Brass.Vector2.fromDirMag(awayFromPlayerAngle + random(-1.2, 1.2), random(3, 5)));

				if (!this.areaVisable(this.showPosition, 1) ||
					this.areaVisable(this.hidePosition, 2)) break;

				const ray = new Brass.RayBody(this.showPosition.x, this.showPosition.y, 0.9);
				const hit = ray.cast(
					this.hidePosition.copy().sub(this.showPosition).multScalar(1.3), 1).body !== null;
				ray.kill();
				if (hit) return;

				this.setState(ReaperState.show);
				break;
			case ReaperState.show:
				if (this.showPosition.dist(player.body.position) < 3 ||
					this.hidePosition.dist(player.body.position) < 5 ||
					this.areaVisable(this.hidePosition, 1.5) ||
					this.stateTime > 15000) {
					this.setState(ReaperState.hide);
					// we should start running into the darkness right now
					this.update(delta);
					return;
				}
				if (this.showPosition.dist(player.body.position) > 12) {
					this.setState(ReaperState.hidden);
				}
				this.showProgress = min(1, this.showProgress +
					delta * (0.001 - 0.0007 * this.showProgress));
				break;
			case ReaperState.hide:
				this.showProgress -= delta * (0.007 - 0.005 * this.showProgress);
				if (this.showProgress <= 0) {
					this.setState(ReaperState.hidden);
				}
				break;
		}
	}

	setState(state) {
		this.state = state;
		if (this.state === ReaperState.hide) {
			player.speed = 0.5;
		}
		if (this.state === ReaperState.show) {
			this.showProgress = 0;
		}
		this.stateTime = 0;
	}

	draw() {
		if (this.state === ReaperState.hidden) return;
		const { x, y } = this.hidePosition.copy()
			.mix(this.showPosition, this.showProgress);
		drawingContext.globalAlpha = pow(this.showProgress, 0.2);
		image(tilesheet, x - 0.5, y - 0.5, 1, 1, 80, 32, 16, 16);
		drawingContext.globalAlpha = 1;
	}

	areaVisable(position, radius) {
		if (this.pointVisable(position)) return true;
		for (let i = 0; i < 8; i++) {
			for (let j = 1; j <= ceil(radius); j++) {
				const radiusVisable = this.pointVisable(position.copy().add(
					Brass.Vector2.fromDirMag(i / 8 * TWO_PI, min(j, radius))));
				if (radiusVisable) return true;
			}
		}
	}

	pointVisable(position) {
		const canvas = lighter.lightCanvas;
		if (canvas === null) return true;
		position = viewpoint.worldToScreen(position).multScalar(0.5);
		if (position.x < 0 || position.y < 0 ||
			position.x >= canvas.width || position.y >= canvas.height) return false;
		return brightness(canvas.get(position.x, position.y)) > 0.01;
	}
}

class Candle {
	constructor(x, y, lit) {
		this.id = Symbol();
		this.position = new Brass.Vector2(x + 0.5, y + 0.5);
		this.lit = lit;
		candles.set(this.id, this);
	}

	update(delta) {
		if (this.lit) {
			emitCandleFire(this.position.copy().addScalar(0, -0.15), delta);
		}
	}

	drawLight() {
		if (!this.lit) return;
		lighter.fill(255);
		const { x, y } = this.position;
		lighter.directional(x, y, 5.2, {
			cacheName: this.id,
			rays: 50,
			raysCollideWith: 0,
			drawOffscreen: true
		});
	}

	light() {
		const { x, y } = this.position.copy().floor();
		tilemap.set(15, x, y);
		this.lit = true;
	}
}

function emitCandleFire(position, delta) {
	Brass.emitParticles(FireParticle, delta * 0.01,
		position.copy().addScalar(random(-0.05, 0.05), 0));
}

class FireParticle extends Brass.VelocityParticleAbstract {
	constructor(position) {
		super(position, new Brass.Vector2(random(-0.001, 0.001), -0.001));
		this.lifetime = random(2500, 3500);
		this.radius = random(0.07, 0.04);
		push();
		colorMode(HSL);
		this.color = color(random(0, random(10, 50)), 90, 60);
		pop();
	}

	draw() {
		fill(this.color);
		noStroke();
		rect(-1, -1, 2, 2);
	}

	update(delta) {
		this.velocity.x += random(-0.001, 0.001);
		this.velocity.y -= 0.0005 * (1 - this.age);
		this.velocity.multScalar(Math.pow(0.999, delta));
		this.radius *= Math.pow(0.9994, delta);
		this.collide(tilemap);
		this.updateKinomatics();
	}
}