/**
 * Draws tilemaps using p5.
 * @module
 */

import p5 from "p5";
import { P5Layer, P5LayerMap } from "../layers/p5Layers";
import { getExactTime, getTime } from "../core/time";
import { assert } from "../common/runtimeChecking";
import { createFastGraphics } from "../common/fastGraphics";
import { Pool } from "../common/pool";
import { getDefaultViewpoint } from "../camera/camera";
import { TilemapAbstract, TilemapAbstractOptions } from "./tilemapAbstract";
import { getDefaultP5DrawTarget } from "../layers/p5Layers";



type P5TileDrawList = { data: unknown, x: number, y: number, order: number }[];

export interface P5TilemapOptions extends TilemapAbstractOptions {
	drawCacheMode?: "never" | "check" | "always";
	drawCacheChunkSize?: number; // tiles per cache chunk
	drawCacheTileResolution?: number; // pixels per tile in chunk cache
	drawCacheDecayTime?: number; // milliseconds until unseen chunk is deleted
	drawCachePadding?: number; // tiles off-screen should chunks will be rendered
	drawCachePaddingTime?: number; // milliseconds used on off-screen chunks rendering
	drawCachePoolInitalSize?: number; // how many tile caches to create on initialization

	drawTile?: (data: unknown, x: number, y: number, g: P5LayerMap) => void;
	drawOrder?: (data: unknown) => number;
	canCacheTile?: (data: unknown) => boolean;
}

export interface P5CacheChunk {
	g: p5.Graphics;
	lastUsed: number;
}



export class P5Tilemap extends TilemapAbstract {
	readonly drawCacheMode: "never" | "check" | "always";
	readonly drawCacheChunkSize: number;
	private readonly drawCacheTileResolution: number;
	private readonly drawCacheDecayTime: number;
	private readonly drawCachePadding: number;
	private readonly drawCachePaddingTime: number;

	private readonly drawTile: (data: unknown, x: number, y: number, g: P5LayerMap) => void;
	private readonly drawOrder: ((data: unknown) => number) | null;
	private readonly canCacheTile: ((data: unknown) => boolean) | null;

	private readonly chunkPool: Pool<P5CacheChunk> | null;
	private readonly chunks: (P5CacheChunk | null)[];
	private readonly cacheableChunks: (boolean | null)[];

	constructor(width: number, height: number, options: P5TilemapOptions = {}) {
		super(width, height, options);

		// get tile cache properties
		this.drawCacheMode = options.drawCacheMode ?? "never";
		this.drawCacheChunkSize = options.drawCacheChunkSize ??
			(this.drawCacheMode === "never" ? 1 : 4);
		this.drawCacheTileResolution = options.drawCacheTileResolution ?? 64;
		this.drawCacheDecayTime = options.drawCacheDecayTime ?? 5000;
		this.drawCachePadding = options.drawCachePadding ?? 0;
		this.drawCachePaddingTime = options.drawCachePaddingTime ?? 3;

		if (this.width / this.drawCacheChunkSize % 1 !== 0 ??
			this.height / this.drawCacheChunkSize % 1 !== 0) {
			throw Error("Tilemap width and height must be a multiple of drawCacheChunkSize");
		}

		const drawCacheChunkSize = this.width * this.height
			/ this.drawCacheChunkSize / this.drawCacheChunkSize;

		if (this.drawCacheMode === "never") {
			this.chunkPool = null;
			this.chunks = [];
			this.cacheableChunks = [];
		} else {
			const tileCachePixelSize = this.drawCacheTileResolution * this.drawCacheChunkSize;
			const drawCachePoolInitalSize = options.drawCachePoolInitalSize ??
				Math.ceil(window.innerWidth * window.innerHeight / tileCachePixelSize / tileCachePixelSize);

			this.chunkPool = new Pool(drawCachePoolInitalSize, false,
				() => ({
					g: createFastGraphics(tileCachePixelSize, tileCachePixelSize),
					lastUsed: getTime()
				}),
				({ g }) => ({ g, lastUsed: getTime() }));
			// graphical cache of chunks
			this.chunks = Array(drawCacheChunkSize).fill(null);
			// cache what chunks can be graphicly cached
			this.cacheableChunks = Array(drawCacheChunkSize).fill(null);
		}

		this.drawTile = this.bindOptionFunction(options.drawTile, this.defaultDrawTile);
		this.drawOrder = this.bindNullableOptionFunction(options.drawOrder);
		this.canCacheTile = this.bindNullableOptionFunction(options.canCacheTile);

		if (this.canCacheTile === null &&
			this.drawCacheMode === "check") {
			throw Error("drawCacheMode of \"check\" requires canCacheTile function in options");
		}
	}

	draw(v = getDefaultViewpoint(), d: P5Layer = getDefaultP5DrawTarget()) {
		const g = d.getMaps().canvas;
		const viewArea = v.getWorldViewArea(d);

		// lock drawing to inside tile map
		viewArea.minX = Math.max(0, viewArea.minX / this.tileSize);
		viewArea.minY = Math.max(0, viewArea.minY / this.tileSize);
		viewArea.maxX = Math.min(this.width, viewArea.maxX / this.tileSize);
		viewArea.maxY = Math.min(this.height, viewArea.maxY / this.tileSize);

		// round to nearest tile cache chunk (or nearest tile if caching is off)
		viewArea.minX = Math.floor(viewArea.minX / this.drawCacheChunkSize);
		viewArea.minY = Math.floor(viewArea.minY / this.drawCacheChunkSize);
		viewArea.maxX = Math.ceil(viewArea.maxX / this.drawCacheChunkSize);
		viewArea.maxY = Math.ceil(viewArea.maxY / this.drawCacheChunkSize);

		push();
		scale(this.tileSize);

		let alwaysCache = false;
		switch (this.drawCacheMode) {
			default:
				throw Error(`drawCacheMode should be "never", "check" or "always" not (${this.drawCacheMode})`);

			case "never":
				this.drawTiles(
					viewArea.minX, viewArea.minY,
					viewArea.maxX, viewArea.maxY, g);
				break;

			case "always": alwaysCache = true;
			// eslint-disable-next-line no-fallthrough
			case "check":
				// this.drawCacheMode !== "never" thus
				assert(this.chunkPool !== null);

				this.padChunks(alwaysCache, v, d);

				// loop through every tile cache chunk
				for (let x = viewArea.minX; x < viewArea.maxX; x++) {
					for (let y = viewArea.minY; y < viewArea.maxY; y++) {
						if (alwaysCache || this.canCacheChunk(x, y)) {
							// maintain and draw tile cache
							this.drawChunk(x, y, g);
						} else {
							// clear tile cache
							const cacheIndex = x + y * (this.width / this.drawCacheChunkSize);
							const tileCache = this.chunks[cacheIndex];
							if (tileCache !== null) {
								this.chunkPool.release(tileCache);
								this.chunks[cacheIndex] = null;
							}
							// draw directly
							this.drawTiles(
								Math.max(viewArea.minX * this.drawCacheChunkSize, x * this.drawCacheChunkSize),
								Math.max(viewArea.minY * this.drawCacheChunkSize, y * this.drawCacheChunkSize),
								Math.min(viewArea.maxX * this.drawCacheChunkSize, (x + 1) * this.drawCacheChunkSize),
								Math.min(viewArea.maxY * this.drawCacheChunkSize, (y + 1) * this.drawCacheChunkSize), g);
						}
					}
				}

				this.cacheableChunks.fill(null);

				// delete old, unseen, tile cache chunks to save memory
				for (let i = 0; i < this.chunks.length; i++) {
					const tileCache = this.chunks[i];
					if (tileCache !== null &&
						getTime() - tileCache.lastUsed > this.drawCacheDecayTime) {
						this.chunkPool.release(tileCache);
						this.chunks[i] = null;
					}
				}
		}

		pop();
	}

	private padChunks(alwaysCache: boolean, v = getDefaultViewpoint(), d: P5Layer) {
		assert(this.chunkPool !== null);

		const viewArea = v.getWorldViewArea(d);

		// add padding and lock drawing to inside tile map
		viewArea.minX = Math.max(0,
			viewArea.minX / this.tileSize - this.drawCachePadding);
		viewArea.minY = Math.max(0,
			viewArea.minY / this.tileSize - this.drawCachePadding);
		viewArea.maxX = Math.min(this.width,
			viewArea.maxX / this.tileSize + this.drawCachePadding);
		viewArea.maxY = Math.min(this.height,
			viewArea.maxY / this.tileSize + this.drawCachePadding);

		// round to nearest tile cache chunk
		viewArea.minX = Math.floor(viewArea.minX / this.drawCacheChunkSize);
		viewArea.minY = Math.floor(viewArea.minY / this.drawCacheChunkSize);
		viewArea.maxX = Math.ceil(viewArea.maxX / this.drawCacheChunkSize);
		viewArea.maxY = Math.ceil(viewArea.maxY / this.drawCacheChunkSize);

		const endTime = getExactTime() + this.drawCachePaddingTime;
		let rush = false;

		// loop through every tile cache chunk
		for (let x = viewArea.minX; x < viewArea.maxX; x++) {
			for (let y = viewArea.minY; y < viewArea.maxY; y++) {
				const cacheIndex = x + y * (this.width / this.drawCacheChunkSize);
				let tileCache = this.chunks[cacheIndex];

				// skip drawn chunks
				if (tileCache === null) {
					if (!rush && (alwaysCache || this.canCacheChunk(x, y))) {
						tileCache = this.chunkPool.get();
						this.chunks[cacheIndex] = tileCache;

						// maintain and draw tile cache
						this.renderChunk(x, y, tileCache);

						// stop when time runs out
						if (getExactTime() > endTime)
							rush = true;
					}
				} else {
					// stop decay when visible / in padding
					tileCache.lastUsed = getTime();
				}
			}
		}
	}

	private canCacheChunk(chunkX: number, chunkY: number) {
		assert(this.canCacheTile !== null);

		const chunkIndex = chunkX + chunkY * (this.height / this.drawCacheChunkSize);
		const initCacheValue = this.cacheableChunks[chunkIndex];

		if (initCacheValue !== null)
			return initCacheValue;

		for (let x = 0; x < this.drawCacheChunkSize; x++) {
			for (let y = 0; y < this.drawCacheChunkSize; y++) {
				const worldX = x + chunkX * this.drawCacheChunkSize, worldY = y + chunkY * this.drawCacheChunkSize;
				const data = this.getTileData(worldX, worldY);

				if (!this.canCacheTile(data)) {
					this.cacheableChunks[chunkIndex] = false;
					return false;
				}
			}
		}

		this.cacheableChunks[chunkIndex] = true;
		return true;
	}

	private renderChunk(chunkX: number, chunkY: number, tileCache: P5CacheChunk) {
		const cache = tileCache.g;

		cache.push();
		cache.clear(0, 0, 0, 0);
		cache.scale(this.drawCacheTileResolution);

		const drawList: P5TileDrawList = [];

		for (let x = 0; x < this.drawCacheChunkSize; x++) {
			for (let y = 0; y < this.drawCacheChunkSize; y++) {
				const worldX = x + chunkX * this.drawCacheChunkSize, worldY = y + chunkY * this.drawCacheChunkSize;

				const data = this.getTileData(worldX, worldY);
				if (this.drawOrder) {
					drawList.push({
						data,
						x,
						y,
						order: this.drawOrder(data)
					});
				} else {
					this.drawTile(data, x, y, cache);
				}
			}
		}

		if (this.drawOrder) {
			drawList.sort((a, b) => a.order - b.order);
			for (const drawItem of drawList) {
				this.drawTile(drawItem.data, drawItem.x, drawItem.y, cache);
			}
		}

		cache.pop();
	}

	private drawChunk(chunkX: number, chunkY: number, g: P5LayerMap) {
		const tileImage = this.maintainChunk(chunkX, chunkY);

		// draw tile cache to screen
		g.image(tileImage,
			chunkX * this.drawCacheChunkSize, chunkY * this.drawCacheChunkSize,
			this.drawCacheChunkSize, this.drawCacheChunkSize);
	}

	private maintainChunk(chunkX: number, chunkY: number) {
		assert(this.chunkPool !== null);

		const tileCacheIndex = chunkX + chunkY * (this.width / this.drawCacheChunkSize);

		let tileCache = this.chunks[tileCacheIndex];
		if (tileCache === null ||
			getTime() - tileCache.lastUsed > this.drawCacheDecayTime) {
			// create new tile cache
			if (tileCache === null) {
				tileCache = this.chunkPool.get();
				this.chunks[tileCacheIndex] = tileCache;
			}

			this.renderChunk(chunkX, chunkY, tileCache);
		}

		return tileCache.g;
	}

	// draw tiles when they are not chunked
	private drawTiles(minX: number, minY: number, maxX: number, maxY: number, g: P5LayerMap) {
		g.push();

		const drawList: P5TileDrawList = [];

		for (let x = minX; x < maxX; x++) {
			for (let y = minY; y < maxY; y++) {
				const data = this.getTileData(x, y);

				if (this.drawOrder) {
					drawList.push({
						data,
						x,
						y,
						order: this.drawOrder(data)
					});
				} else {
					this.drawTile(data, x, y, g);
				}
			}
		}

		if (this.drawOrder) {
			drawList.sort((a, b) => a.order - b.order);
			for (const drawItem of drawList) {
				this.drawTile(drawItem.data, drawItem.x, drawItem.y, g);
			}
		}

		g.pop();
	}

	private defaultDrawTile(data: unknown, x: number, y: number, g: P5LayerMap) {
		g.noStroke();

		const brightness = (x + y) % 2 * 255;

		g.fill(brightness);
		g.rect(x, y, 1, 1);

		g.fill(255 - brightness);
		g.textAlign(CENTER, CENTER);
		g.textSize(0.2);
		g.text(String(data), x + 0.5001, y + 0.5001);
	}

	clearCaches() {
		if (this.drawCacheMode === "never")
			return; // thus
		assert(this.chunkPool !== null);

		for (const cache of this.chunks) {
			if (cache === null)
				continue;
			this.chunkPool.release(cache);
		}
		this.chunks.fill(null);
		this.cacheableChunks.fill(null);
	}

	clearCacheAtTile(tileX: number, tileY: number) {
		const tileCacheIndex = Math.floor(tileX / this.drawCacheChunkSize) +
			Math.floor(tileY / this.drawCacheChunkSize) * (this.width / this.drawCacheChunkSize);
		const tileCache = this.chunks[tileCacheIndex];

		if (tileCache == null)
			return; // thus
		assert(this.chunkPool !== null);

		this.chunkPool.release(tileCache);
		this.chunks[tileCacheIndex] = null;
	}
}