/**
 * Stores and draws game-worlds on a square grid.
 * @module
 */

import { getP5DrawTarget, P5DrawTarget, P5DrawSurfaceMap } from "./drawSurface";
import { getExactTime, getTime } from "./time";
import { cloneDynamicArray, createDynamicArray, createFastGraphics, decodeDynamicTypedArray, DynamicArray, DynamicArrayType, DynamicTypedArray, DynamicTypedArrayType, encodeDynamicTypedArray, Pool, safeBind, assert } from "./common";
import { getDefaultViewpoint } from "./viewpoint";
import { GridBody } from "./physics";
import p5 from "p5";



type SparseableDynamicArrayType = "sparse" | DynamicArrayType;
export type FieldDeclaration = {
	[name: string]: SparseableDynamicArrayType;
};

type SparseFieldData = { [name: `${number},${number}`]: any };
type SparseableDynamicArray = { sparse: true, data: SparseFieldData } | { sparse: false, data: DynamicArray };
type SolidFieldType = { sparse: false, data: Uint8Array };

interface TilemapWorldFields {
	[name: string]: {
		type: "sparse";
		data: SparseFieldData
	} | ({
		type: DynamicArrayType
	} & ({
		data: any[]
	} | {
		data: string
		encoding: DynamicTypedArrayType
	}))
}

export interface TilemapWorld {
	width: number;
	height: number;

	objects: any[];
	tilesets: { [name: string]: TilemapWorldTileset };

	fields: TilemapWorldFields;
}

interface TilemapWorldTileset {
	firstId: number;
	tiles: {
		[id: number]: {
			[name: string]: any;
		}
	};
}

interface TilemapAbstractOptions {
	tileSize?: number;
	// name and data type stored for every tile
	// field IDs are stored under their name as properties
	fields?: FieldDeclaration
	solidField?: string;

	body?: boolean | Matter.IBodyDefinition;
	autoMaintainBody?: boolean;

	getTileData?: (x: number, y: number) => any;
	isTileSolid?: (data: any) => boolean;
}

interface P5TilemapOptions extends TilemapAbstractOptions {
	drawCacheMode?: "never" | "check" | "always";
	drawCacheChunkSize?: number; // tiles per cache chunk
	drawCacheTileResolution?: number; // pixels per tile in chunk cache
	drawCacheDecayTime?: number; // milliseconds until unseen chunk is deleted
	drawCachePadding?: number; // tiles off-screen should chunks will be rendered
	drawCachePaddingTime?: number; // milliseconds used on off-screen chunks rendering
	drawCachePoolInitalSize?: number; // how many tile caches to create on initialization

	drawTile?: (data: any, x: number, y: number, g: P5DrawSurfaceMap) => void;
	drawOrder?: (data: any) => number;
	canCacheTile?: (data: any) => boolean;
}

interface P5CacheChunk {
	g: p5.Graphics;
	lastUsed: number;
}



const tilemapList: TilemapAbstract[] = [];



export function update() {
	for (const tilemap of tilemapList) {
		tilemap.maintain();
	}
}

export abstract class TilemapAbstract {
	readonly width: number;
	readonly height: number;

	readonly tileSize: number;
	protected readonly fields: SparseableDynamicArray[];
	protected readonly fieldIds: { [name: string]: number };
	protected readonly solidFieldId: number;
	protected readonly fieldTypes: FieldDeclaration

	private readonly hasBody: boolean;
	private readonly autoMaintainBody: boolean;
	readonly body: GridBody | null;
	private bodyValid: boolean;

	protected readonly getTileData: (x: number, y: number) => any;
	private readonly isTileSolid: ((data: any) => boolean) | null;

	constructor(width: number, height: number, options: TilemapAbstractOptions = {}) {
		this.width = width;
		this.height = height;
		this.tileSize = options.tileSize ?? 1;

		// build fields
		this.fields = [];
		this.fieldTypes = options.fields ?? {
			"_DEFAULTFIELD": "uint8"
		};

		const solidFieldName = options.solidField ?? "";

		if (this.fieldTypes[solidFieldName] === undefined) {
			this.fieldTypes[solidFieldName] = "uint8";
		} else if (this.fieldTypes[solidFieldName] !== "uint8") {
			throw Error("Solid field must be of type uint8");
		}

		this.fields = [];
		this.fieldIds = {};
		for (let fieldName in this.fieldTypes) {
			const fieldType = this.fieldTypes[fieldName];

			const upperFieldName = fieldName.toUpperCase();
			// @ts-ignore because this is safe-ish and an index signature would cause other properties to be poorly checked
			if (this[upperFieldName] !== undefined) {
				throw Error(`field name (${upperFieldName}) collided in tilemap namespace`);
			}

			// @ts-ignore because this is safe-ish and an index signature would cause other properties to be poorly checked
			this[upperFieldName] = this.fields.length;
			this.fieldIds[fieldName] = this.fields.length;

			this.fields.push(this.createField(fieldType));
		}

		this.solidFieldId = this.fieldIds[solidFieldName];

		this.hasBody = !!options.body;
		this.autoMaintainBody = options.autoMaintainBody ?? true;

		this.getTileData = this.bindOptionsFunction(options.getTileData) ?? this.get;
		this.isTileSolid = this.bindOptionsFunction(options.isTileSolid) ?? null;

		const solidField = this.fields[this.solidFieldId] as SolidFieldType;

		if (this.isTileSolid !== null) {
			const nullTileSolid = this.isTileSolid(this.getTileData(0, 0)) ? 1 : 0;

			solidField.data.fill(nullTileSolid);
		}

		this.body = null;
		if (this.hasBody) {
			let bodyOptions = {};
			if (typeof options.body === "object") {
				bodyOptions = options.body;
			}
			this.body = new GridBody(this.width, this.height, solidField.data,
				bodyOptions, this.tileSize);
		}
		this.bodyValid = this.hasBody;

		tilemapList.push(this);
	}

	bindOptionsFunction(func?: Function) {
		if (!func) return func;
		return safeBind(func, this);
	}

	maintain() {
		if (this.autoMaintainBody) this.maintainBody();
	}

	maintainBody(minX?: number, minY?: number, maxX?: number, maxY?: number) {
		if (this.body === null ||
			this.bodyValid) return;

		const solidField = this.fields[this.solidFieldId] as SolidFieldType;

		this.body.buildBody(solidField.data, minX, minY, maxX, maxY);

		this.bodyValid = true;
	}

	get(x: number, y: number, fieldId = 0) {
		if (!this.validateCoord(x, y)) return undefined;

		const field = this.fields[fieldId];

		if (field.sparse) {
			const value = field.data[`${x},${y}`];
			if (value === undefined) return null;
			return value;
		}

		return field.data[x + y * this.width];
	}

	set(value: any, x: number, y: number, fieldId = 0) {
		if (!this.validateCoord(x, y)) return false;

		const field = this.fields[fieldId];

		if (field.sparse) {
			field.data[`${x},${y}`] = value;
		} else {
			field.data[x + y * this.width] = value;
		}

		this.clearCacheAtTile(x, y);
		this.updateSolidAtTile(x, y);

		return true;
	}

	getSolid(x: number, y: number) {
		const solid = this.get(x, y, this.solidFieldId);
		if (solid === undefined) return undefined;
		return Boolean(solid);
	}

	export(): TilemapWorld {
		const fields: TilemapWorldFields = {};

		for (const fieldName in this.fieldIds) {
			const fieldId = this.fieldIds[fieldName];
			const fieldType = this.fieldTypes[fieldName];
			const fieldData = this.fields[fieldId].data;

			if (fieldType === "sparse") {
				fields[fieldName] = {
					type: "sparse",
					data: fieldData as SparseFieldData
				};
			} else if (fieldType === "any") {
				fields[fieldName] = {
					type: "any",
					data: fieldData as any[]
				};
			} else {
				fields[fieldName] = {
					type: fieldType,
					data: encodeDynamicTypedArray(fieldData as DynamicTypedArray),
					encoding: fieldType
				};
			}
		}

		return {
			width: this.width,
			height: this.height,
			objects: [],
			tilesets: {},
			fields
		}
	}

	import(world: TilemapWorld) {
		if (world === null) {
			throw Error("Tried to import (null) as world; Did you pass Brass.getWorld() before the world loaded?")
		}

		if (world.width > this.width ||
			world.height > this.height) throw Error("Can't import world larger than tilemap");

		this.clearCaches();
		this.clearFields();

		for (const fieldName in world.fields) {

			const feildId = this.fieldIds[fieldName];
			if (feildId === undefined) {
				throw Error(`Can't import field (${fieldName}); field was not declared for the tilemap`);
			}

			const feildType = this.fieldTypes[fieldName];
			const field = world.fields[fieldName];
			if (feildType === undefined || feildType !== field.type) {
				throw Error(`Can't import field (${fieldName}); field type did not match with any fields declared for the tilemap`);
			}

			if (field.type === "sparse") {
				this.fields[feildId] = {
					sparse: true,
					data: field.data
				}
			} else {
				let data: DynamicArray;

				if ("encoding" in field) {
					const encodedData = decodeDynamicTypedArray(field.encoding, field.data);
					if (field.encoding !== field.type) {
						data = cloneDynamicArray(field.type, encodedData);
					} else {
						data = encodedData;
					}
				} else {
					data = field.data;
				}

				if (this.width === world.width &&
					this.height === world.height) {
					this.fields[feildId].data = data;
				} else {
					for (let x = 0; x < world.width; x++) {
						for (let y = 0; y < world.height; y++) {
							// @ts-ignore because field is never sparse on this code path
							this.fields[feildId].data[x + y * this.width] = data[x + y * world.width];
						}
					}
				}
			}
		}


		for (let x = 0; x < world.width; x++) {
			for (let y = 0; y < world.height; y++) {
				this.updateSolidAtTile(x, y);
			}
		}
	}

	private updateSolidAtTile(x: number, y: number) {
		if (this.isTileSolid === null) return;

		const solidField = this.fields[this.solidFieldId] as SolidFieldType;
		const isSolid = this.isTileSolid(this.getTileData(x, y));
		const solidIndex = x + y * this.width;

		if (this.body !== null) {
			if (!!solidField.data[solidIndex] !== isSolid) {
				this.bodyValid = false;
			}
		}

		solidField.data[solidIndex] = isSolid ? 1 : 0;
	}

	clearFields() {
		for (const fieldName in this.fieldIds) {
			const fieldId = this.fieldIds[fieldName];

			if (fieldId === this.solidFieldId) continue;
			const fieldType = this.fieldTypes[fieldName]

			this.fields[fieldId] = this.createField(fieldType);
		}

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.updateSolidAtTile(x, y);
			}
		}
	}

	private createField(type: SparseableDynamicArrayType): SparseableDynamicArray {
		if (type === "sparse") {
			return {
				sparse: true,
				data: {}
			};
		} else {
			const data = createDynamicArray(type, this.area);
			return {
				sparse: false,
				data
			}
		}
	}

	abstract clearCaches(): void;
	abstract clearCacheAtTile(tileX: number, tileY: number): void;

	validateCoord(x: number, y: number) {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	get area() {
		return this.width * this.height;
	}
}

export class P5Tilemap extends TilemapAbstract {
	readonly drawCacheMode: "never" | "check" | "always"
	readonly drawCacheChunkSize: number;
	private readonly drawCacheTileResolution: number;
	private readonly drawCacheDecayTime: number;
	private readonly drawCachePadding: number;
	private readonly drawCachePaddingTime: number;

	private readonly drawTile: (data: any, x: number, y: number, g: P5DrawSurfaceMap) => void;
	private readonly drawOrder: ((data: any) => number) | null;
	private readonly canCacheTile: ((data: any) => boolean) | null;

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

		this.drawTile = this.bindOptionsFunction(options.drawTile) ?? this.defaultDrawTile;
		this.drawOrder = this.bindOptionsFunction(options.drawOrder) ?? null;
		this.canCacheTile = this.bindOptionsFunction(options.canCacheTile) ?? null;

		if (this.canCacheTile === null &&
			this.drawCacheMode === "check") {
			throw Error("drawCacheMode of \"check\" requires canCacheTile function in options");
		}
	}

	draw(v = getDefaultViewpoint(), d = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;
		const viewArea = v.getViewArea(d);

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

			case "always":
				alwaysCache = true;
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

	private padChunks(alwaysCache: boolean, v = getDefaultViewpoint(), d: P5DrawTarget) {
		const g = d.getMaps().canvas;
		assert(this.chunkPool !== null);

		const viewArea = v.getViewArea(d);

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
						if (getExactTime() > endTime) rush = true;
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

		if (initCacheValue !== null) return initCacheValue;

		for (let x = 0; x < this.drawCacheChunkSize; x++) {
			for (let y = 0; y < this.drawCacheChunkSize; y++) {
				const worldX = x + chunkX * this.drawCacheChunkSize,
					worldY = y + chunkY * this.drawCacheChunkSize;
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

		const drawList = [];

		for (let x = 0; x < this.drawCacheChunkSize; x++) {
			for (let y = 0; y < this.drawCacheChunkSize; y++) {
				const worldX = x + chunkX * this.drawCacheChunkSize,
					worldY = y + chunkY * this.drawCacheChunkSize;

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

	private drawChunk(chunkX: number, chunkY: number, g: P5DrawSurfaceMap) {
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
	private drawTiles(minX: number, minY: number, maxX: number, maxY: number, g: P5DrawSurfaceMap) {
		g.push();

		const drawList = [];

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

	private defaultDrawTile(data: any, x: number, y: number, g: P5DrawSurfaceMap) {
		g.noStroke();

		const brightness = (x + y) % 2 * 255;

		g.fill(brightness)
		g.rect(x, y, 1, 1);

		g.fill(255 - brightness);
		g.textAlign(CENTER, CENTER);
		g.textSize(0.2);
		g.text(String(data), x + 0.5001, y + 0.5001);
	}

	clearCaches() {
		if (this.drawCacheMode === "never") return; // thus
		assert(this.chunkPool !== null);

		for (const cache of this.chunks) {
			if (cache === null) continue;
			this.chunkPool.release(cache);
		}
		this.chunks.fill(null);
		this.cacheableChunks.fill(null);
	}

	clearCacheAtTile(tileX: number, tileY: number) {
		const tileCacheIndex = Math.floor(tileX / this.drawCacheChunkSize) +
			Math.floor(tileY / this.drawCacheChunkSize) * (this.width / this.drawCacheChunkSize);
		const tileCache = this.chunks[tileCacheIndex];

		if (tileCache == null) return; // thus
		assert(this.chunkPool !== null);

		this.chunkPool.release(tileCache);
		this.chunks[tileCacheIndex] = null;
	}
}