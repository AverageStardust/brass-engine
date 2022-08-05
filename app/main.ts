import { init } from "../src/core/core";
import { ReglLighter } from "../src/lighting/reglLighter";
import { ReglTilemap } from "../src/tilemap/reglTilemap";

let tilemap: ReglTilemap, reglLighter: ReglLighter;

export function setup() {
	init({

	});

	tilemap = new ReglTilemap(32, 32);

	reglLighter = new ReglLighter({
		tilemap
	});
}

export function draw() {
	tilemap.draw();
	
}