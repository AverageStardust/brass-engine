/**
 * Draws tilemaps using p5.
 * @module
 */

import { getDefaultViewpoint } from "../camera/camera";
import { CanvasLayer, getDefaultCanvasDrawTarget } from "../layers/canvasLayers";
import { TilemapAbstract, TilemapAbstractOptions } from "./tilemapAbstract";



export interface ReglTilemapOptions extends TilemapAbstractOptions {
}



export class ReglTilemap extends TilemapAbstract {
	constructor(width: number, height: number, options: ReglTilemapOptions = {}) {
		super(width, height, options);
	}

	draw(v = getDefaultViewpoint(), d: CanvasLayer = getDefaultCanvasDrawTarget()) {
	}

	clearCaches() {
		// do nothing
	}

	clearCacheAtTile(tileX: number, tileY: number) {
		// do nothing
	}
}