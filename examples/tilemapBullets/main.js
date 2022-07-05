/// <reference path = "../declareBrass.ts"/>

const MAX_MAP_SIZE = 256;
let tilemap, viewpoint, lighter;
let player, pathfinder;

function setup() {
	viewpoint = new Brass.Viewpoint(64);

	Brass.init({
		viewpoint,
		matter: true
	});

	createPlayer();

	viewpoint.position = player.position;

	tilemap = new Brass.P5Tilemap(MAX_MAP_SIZE, MAX_MAP_SIZE, {
		fields: {
			surface: "uint16",
			items: "uint16"
		},

		body: true,

		drawCacheMode: "always",
		drawCachePadding: 4,

		getTileData: function (x, y) {
			return {
				surface: this.get(x, y, this.SURFACE),
				items: this.get(x, y, this.ITEMS)
			};
		},
		isTileSolid: function ({
			surface,
			items
		}) {
			return surface > 101 || items > 0;
		},
		drawTile: function ({
			surface,
			items
		}, x, y, g) {
			const tilemap = Brass.getImage("tilesheet.png");
			const
				u1 = (surface - 1) / 27 % 1,
				v1 = Math.floor((surface - 1) / 27) / 20;
			g.noSmooth();
			g.image(tilemap, x, y, 1, 1, u1 * tilemap.width, v1 * tilemap.height, tilemap.width / 27, tilemap.height / 20);
			if (items > 1) {
				const
					u2 = (items - 1) / 27 % 1,
					v2 = Math.floor((items - 1) / 27) / 20;
				g.image(tilemap, x, y, 1, 1, u2 * tilemap.width, v2 * tilemap.height, tilemap.width / 27, tilemap.height / 20);
			}
		}
	});

	Brass.loadImageDynamic(
		3,
		"tilesheet.png").map((loadPromise, i) => {
			if (i === 0) return; // reload caches for each new image
			loadPromise.then(() => tilemap.clearCaches());
		});

	Brass.loadLevelLate({
		surface: "uint16",
		items: "uint16"
	},
		"tilemap.json"
	).then(
		(level) => tilemap.import(level)
	);
}

function createPlayer() {
	player = new Brass.RayBody(35.5, 35.5, 0.25, {
		velocity: Brass.Vector2.fromDirMag(random(TWO_PI), random(0.1, 0.3))
	});
	player.addSensor(() => {
		Brass.setTestStatus(true);
		createPlayer();
	});
}

function brassDraw() {
	viewpoint.target = player.position;
	viewpoint.view();

	background(127);
	tilemap.draw();

	noStroke();
	fill(0);
	circle(player.position.x, player.position.y, 0.15);
	
	Brass.drawColliders(0.04);
}