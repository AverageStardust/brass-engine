/// <reference path = "../declareBrass.ts"/>

const startPosition = { x: 30, y: 33 };
let drawTarget, viewpoint, tilemap, tilesheet;

async function setup() {
	viewpoint = new Brass.Viewpoint(32, Brass.Vector2.fromObjFast(startPosition), {
		integerScaling: true
	});

	Brass.init({
		viewpoint
	});

	Brass.getDrawTarget("defaultP5").setSizer(() => {
		const edgeWidth = Math.min(window.innerWidth, window.innerHeight);
		viewpoint.scale = ceil(edgeWidth / 12);
		return { x: edgeWidth, y: edgeWidth };
	});

	tilemap = new Brass.P5Tilemap(128, 128, {
		fields: {
			"tile": "uint8"
		},
		drawTile: function (tile, x, y, g) {
			tile--;
			if (tile === -1) return;
			const
				u = tile % 8,
				v = Math.floor(tile / 8);
			g.noSmooth();
			g.image(tilesheet, x, y, 1, 1, u * 16, v * 16, 16, 16);
		}
	});

	Brass.loadImageLate("tilesheet.png")
		.then((image) => tilesheet = image);
	Brass.loadWorldLate({
		"tile": "uint8"
	}, "tilemap.json")
		.then((world) => tilemap.import(world));
}

function brassUpdate() {
	Brass.setTestStatus(frameCount > 60);
}

function brassDraw() {
	viewpoint.view();
	tilemap.draw();
}