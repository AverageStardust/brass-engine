/// <reference path = "../declareBrass.ts"/>

const startPosition = { x: 30.499999, y: 33.499999 };
let drawTarget, viewpoint, tilemap, tilesheet, lighter;

async function setup() {
	viewpoint = new Brass.Viewpoint(32, Brass.Vector2.fromObjFast(startPosition), {
		integerScaling: true
	});

	Brass.init({
		viewpoint,
		matter: true
	});

	Brass.getDrawTarget("defaultP5").setSizer(() => {
		const edgeWidth = Math.min(window.innerWidth, window.innerHeight);
		viewpoint.scale = edgeWidth / 12;
		return { x: edgeWidth, y: edgeWidth };
	});

	tilemap = new Brass.P5Tilemap(128, 128, {
		fields: {
			"tile": "uint8"
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

	lighter = new Brass.P5Lighter({ blur: 0.5 });

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
	lighter.begin();
	const { x, y } = viewpoint.screenToWorld(new Brass.Vector2(mouseX, mouseY));
	lighter.directional(x, y, 6);
	tilemap.draw();
	lighter.end();
}