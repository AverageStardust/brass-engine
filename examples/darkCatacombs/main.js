/// <reference path = "../declareBrass.ts"/>

let viewpoint, tilemap, tilesheet;

async function setup() {
	Brass.init();

	viewpoint = new Brass.Viewpoint(64);

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

	tilesheet = await Brass.loadImageLate("tilesheet.png");
	tilemap.import(await Brass.loadWorldLate({
		"tile": "uint8"
	}, "tilemap.json"));
}

function brassUpdate() {
	Brass.setTestStatus(frameCount > 60);
}

function brassDraw() {
	viewpoint.view();
	tilemap.draw();
}