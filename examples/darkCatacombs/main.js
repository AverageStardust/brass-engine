/// <reference path = "../declareBrass.ts"/>

const startPosition = { x: 30.499999, y: 33.499999 };
const candles = new Map();
let viewpoint, tilemap, tilesheet, lighter, player;
let areaDarkness = 0;

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
					if (tile === 14) {
						new Candle(x, y, false);
					} else if (tile === 15) {
						console.log(x, y)
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
			tile--;
			if (tile === -1) return;
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

	lighter = new Brass.P5Lighter({ blur: 0.6 });

	player = new Player();
}

function brassUpdate(delta) {
	player.update(delta);
}

function brassDraw() {
	viewpoint.view();
	lighter.begin();

	if (areaDarkness < 1) {
		lighter.fill(255, (1 - areaDarkness) * 255);
		lighter.world(0);
	}

	tilemap.draw();

	for (const candle of candles.values()) {
		candle.draw();
	}

	player.draw();

	lighter.end();
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
		this.candleLit = true;
	}

	update(delta) {
		viewpoint.target = this.body.position;
		this.walkCycle = (this.walkCycle + this.body.velocity.mag * 0.8) % 1;

		this.body.applyForce(this.input.vector.get("movement").multScalar(0.03));
		this.body.velocity.multScalar(Math.pow(0.98, delta));

		const { x, y } = this.body.position;
		areaDarkness = Math.min(1, (Math.max(0, x - 34) + Math.max(0, y - 41)) * 0.1);
	}

	draw() {
		const { x, y } = this.body.position;
		const walkFootUpRatio = Math.min(1.5, 0.5 + this.body.velocity.mag * 12);
		const frame = Math.round(Math.sin(this.walkCycle * TWO_PI) * walkFootUpRatio) + 1;

		noSmooth();
		image(tilesheet, x - 0.5, y - 0.5, 1, 1, frame * 16, 32, 16, 16);
		image(tilesheet, x - 0.5, y - 0.5, 1, 1, this.candleLit ? 64 : 48, 32, 16, 16);

		if (this.candleLit) {
			const { x, y } = this.body.position;
			lighter.fill(255);
			const candleRadius = 5 + noise(Brass.getSimTime() * 0.005) * 0.5;
			lighter.directional(x, y, candleRadius, {
				cacheName: "playerLight",
				cacheTime: 100,
				rays: 50,
				raysCollideWith: 0,
			});
		}
	}
}

class Candle {
	constructor(x, y, lit) {
		this.id = Symbol();
		this.position = new Brass.Vector2(x + 0.5, y + 0.5);
		this.lit = lit;
		candles.set(this.id, this);
	}

	draw() {
		if (this.lit) {
			lighter.fill(255);
			const { x, y } = this.position;
			lighter.directional(x, y, 5.2, {
				cacheName: this.id,
				rays: 50,
				raysCollideWith: 0,
				drawOffscreen: true
			});
		}
	}

	light() {
		const { x, y } = this.position.copy().floor();
		tilemap.set(x, y, 15);
		this.lit = true;
	}
}