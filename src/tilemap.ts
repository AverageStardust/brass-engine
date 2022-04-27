import { defaultDrawTarget, DrawTarget } from "./drawTarget";
import { getExactTime, getTime } from "./time";
import { assertCompileTime, assertRunTime, cloneDynamicArray, createDynamicArray, createFastGraphics, decodeDynamicTypedArray, DynamicArray, DynamicArrayType, DynamicTypedArray, DynamicTypedArrayType, encodeDynamicTypedArray, Pool } from "./common";
import { defaultViewpoint } from "./viewpoint";
import p5 from "p5";
//import { createBody } from "./physics";
import { Vertex2 } from "./vector3";
import { GridBody } from "./physics";



type SparseableDynamicArrayType = "sparse" | DynamicArrayType;
export type FieldDeclaration = {
    [name: string]: SparseableDynamicArrayType;
};

type SparseFieldData = { [name: `${number},${number}`]: any };
type SparseableDynamicArray = { sparse: true, data: SparseFieldData } | { sparse: false, data: DynamicArray };
type SolidFieldType = { sparse: false, data: Uint8Array };

interface TilemapOptions {
    tileSize?: number;
    // name and data type stored for every tile
    // field IDs are stored under their name as properties
    fields?: FieldDeclaration

    body?: boolean | Matter.IBodyDefinition;
    autoMaintainBody?: boolean;

    tileCacheMode?: "never" | "check" | "always";
    tileCacheSize?: number; // tiles per cache chunk
    tileCacheResolution?: number; // pixels per tile in cache
    tileCacheDecayTime?: number; // milliseconds until unseen cache is deleted
    tileCachePadding?: number; // tiles off-screen should chunks will be rendered
    tileCachePaddingTime?: number; // milliseconds used on off-screen chunks rendering
    tileCachePoolInitalSize?: number; // how many tile caches to create on initalization

    getTileData?: (x: number, y: number) => any;
    drawTile?: (data: any, x: number, y: number, g: DrawTarget) => void;
    canCacheTile?: (data: any) => boolean;
    isSolidTile?: (data: any) => boolean;
}

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

interface TilemapWorldTileset {
    firstId: number;
    tiles: {
        [id: number]: {
            [name: string]: any;
        }
    };
}

export interface TilemapWorld {
    width: number;
    height: number;

    objects: any[];
    tilesets: { [name: string]: TilemapWorldTileset };

    fields: TilemapWorldFields;
}


interface TileCache {
    g: p5.Graphics;
    lastUsed: number;
}


const tilemapList: Tilemap[] = [];



export function update() {
    for (const tilemap of tilemapList) {
        tilemap.maintain();
    }
}

export class Tilemap {
    readonly width: number;
    readonly height: number;

    readonly tileSize: number;
    private readonly fields: SparseableDynamicArray[];
    private readonly fieldTypes: FieldDeclaration
    private readonly fieldIds: { [name: string]: number };

    private readonly hasBody: boolean;
    readonly body: GridBody | null;
    private readonly autoMaintainBody: boolean;
    private bodyValid: boolean;

    readonly tileCacheMode: "never" | "check" | "always"
    readonly tileCacheSize: number;
    private readonly tileCacheResolution: number;
    private readonly tileCacheDecayTime: number;
    private readonly tileCachePadding: number;
    private readonly tileCachePaddingTime: number;

    private readonly getTileData: (x: number, y: number) => any;
    private readonly drawTile: (data: any, x: number, y: number, g: DrawTarget) => void;
    private readonly canCacheTile: ((data: any) => boolean) | null;
    private readonly isSolidTile: ((data: any) => boolean) | null;

    private readonly tileCachePool: Pool<TileCache> | null;
    private readonly tileCaches: (TileCache | null)[];
    private readonly cacheableChunks: (boolean | null)[];

    constructor(width: number, height: number, options: TilemapOptions = {}) {
        this.width = width;
        this.height = height;
        this.tileSize = options.tileSize ?? 1;

        // build fields
        this.fields = [];
        this.fieldTypes = options.fields ?? {
            "_DEFAULTFIELD": "uint8"
        };
        this.fieldIds = {};

        this.fieldTypes["_SOLIDFIELD"] = "uint8";

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

            this.fields.push(this.createEmptyField(fieldType));
        }

        this.hasBody = !!options.body;
        this.autoMaintainBody = options.autoMaintainBody ?? true;

        // get tile cache properties
        this.tileCacheMode = options.tileCacheMode ?? "never";
        this.tileCacheSize = options.tileCacheSize ??
            (this.tileCacheMode === "never" ? 1 : 4);
        this.tileCacheResolution = options.tileCacheResolution ?? 64;
        this.tileCacheDecayTime = options.tileCacheDecayTime ?? 5000;
        this.tileCachePadding = options.tileCachePadding ?? 0;
        this.tileCachePaddingTime = options.tileCachePaddingTime ?? 3;

        if (this.width / this.tileCacheSize % 1 !== 0 ??
            this.height / this.tileCacheSize % 1 !== 0) {
            throw Error("Tilemap width and height must be a multiple of tileCacheSize");
        }

        const tileCacheSize = this.width * this.height
            / this.tileCacheSize / this.tileCacheSize;

        if (this.tileCacheMode === "never") {
            this.tileCachePool = null;
            this.tileCaches = [];
            this.cacheableChunks = [];
        } else {
            const tileCachePixelSize = this.tileCacheResolution * this.tileCacheSize;
            const tileCachePoolInitalSize = options.tileCachePoolInitalSize ??
                Math.ceil(defaultDrawTarget.width * defaultDrawTarget.height / tileCachePixelSize / tileCachePixelSize);

            this.tileCachePool = new Pool(tileCachePoolInitalSize, false,
                () => ({
                    g: createFastGraphics(tileCachePixelSize, tileCachePixelSize),
                    lastUsed: getTime()
                }),
                ({ g }) => ({ g, lastUsed: getTime() }));
            // graphical cahce of chunks
            this.tileCaches = Array(tileCacheSize).fill(null);
            // cache what chunks can be graphicly cached
            this.cacheableChunks = Array(tileCacheSize).fill(null);
        }

        this.getTileData = options.getTileData ?? this.get;
        this.drawTile = options.drawTile ?? this.defaultDrawTile;
        this.canCacheTile = options.canCacheTile ?? null;
        this.isSolidTile = options.isSolidTile ?? null;

        if (this.canCacheTile === null &&
            this.tileCacheMode === "check") {
            throw Error("tileCacheMode of \"check\" requires canCacheTile function in options");
        }

        // @ts-ignore because this._SOLIDFIELD is always defined
        const solidField = this.fields[this._SOLIDFIELD] as SolidFieldType;

        if (this.isSolidTile !== null) {
            const nullTileSolid = this.isSolidTile(this.getTileData(0, 0)) ? 1 : 0;

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

    viewBody(g = defaultDrawTarget) {
        if (this.body === null) return;

        throw "WIP";

        // const corner = this.body;

        // g.translate(corner.x, corner.y);

        // g.rotate(this.body.angle);
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
            throw Error("Tryed to import (null) as world; Did you pass Brass.getWorld() before the world loaded?")
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
                this.updateSolidData(x, y);
            }
        }
    }

    clearFields() {
        for (const fieldName in this.fieldIds) {
            const fieldId = this.fieldIds[fieldName];
            // @ts-ignore
            if (fieldId === this._SOLIDFIELD) continue;
            const fieldType = this.fieldTypes[fieldName]

            this.fields[fieldId] = this.createEmptyField(fieldType);
        }

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.updateSolidData(x, y);
            }
        }
    }

    maintain() {
        if (this.autoMaintainBody) this.maintainBody();
    }

    maintainBody(minX?: number, minY?: number, maxX?: number, maxY?: number) {
        if (this.body === null ||
            this.bodyValid) return;

        // @ts-ignore because this._SOLIDFIELD is always defined
        const solidField = this.fields[this._SOLIDFIELD] as SolidFieldType;

        this.body.buildBody(solidField.data, minX, minY, maxX, maxY);

        this.bodyValid = true;
    }

    private createEmptyField(type: SparseableDynamicArrayType): SparseableDynamicArray {
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

    clearCaches() {
        if (this.tileCacheMode === "never") return; // thus
        assertCompileTime(this.tileCachePool !== null);

        for (const cache of this.tileCaches) {
            if (cache === null) continue;
            this.tileCachePool.release(cache);
        }
        this.tileCaches.fill(null);
        this.cacheableChunks.fill(null);
    }

    draw(v = defaultViewpoint, g = defaultDrawTarget) {
        const viewArea = v.getViewArea(g);

        // lock drawing to inside tile map
        viewArea.minX = Math.max(0, viewArea.minX / this.tileSize);
        viewArea.minY = Math.max(0, viewArea.minY / this.tileSize);
        viewArea.maxX = Math.min(this.width, viewArea.maxX / this.tileSize);
        viewArea.maxY = Math.min(this.height, viewArea.maxY / this.tileSize);

        // round to nearest tile cache chunk (or nearest tile if caching is off)
        viewArea.minX = Math.floor(viewArea.minX / this.tileCacheSize);
        viewArea.minY = Math.floor(viewArea.minY / this.tileCacheSize);
        viewArea.maxX = Math.ceil(viewArea.maxX / this.tileCacheSize);
        viewArea.maxY = Math.ceil(viewArea.maxY / this.tileCacheSize);

        push();
        scale(this.tileSize);

        let alwaysCache = false;
        switch (this.tileCacheMode) {
            default:
                throw Error(`tileCacheMode should be "never", "check" or "always" not (${this.tileCacheMode})`);

            case "never":
                this.drawTiles(
                    viewArea.minX, viewArea.minY,
                    viewArea.maxX, viewArea.maxY, g);
                break;

            case "always":
                alwaysCache = true;
            case "check":
                // this.tileCacheMode !== "never" thus
                assertCompileTime(this.tileCachePool !== null);

                this.padTileCache(alwaysCache, v, g);

                // loop through every tile cache chunk
                for (let x = viewArea.minX; x < viewArea.maxX; x++) {
                    for (let y = viewArea.minY; y < viewArea.maxY; y++) {
                        if (alwaysCache || this.canCacheChunk(x, y)) {
                            // maintain and draw tile cache
                            this.drawTileCache(x, y, g);
                        } else {
                            // clear tile cache
                            const cacheIndex = x + y * (this.width / this.tileCacheSize);
                            const tileCache = this.tileCaches[cacheIndex];
                            if (tileCache !== null) {
                                this.tileCachePool.release(tileCache);
                                this.tileCaches[cacheIndex] = null;
                            }
                            // draw directly
                            this.drawTiles(
                                Math.max(viewArea.minX * this.tileCacheSize, x * this.tileCacheSize),
                                Math.max(viewArea.minY * this.tileCacheSize, y * this.tileCacheSize),
                                Math.min(viewArea.maxX * this.tileCacheSize, (x + 1) * this.tileCacheSize),
                                Math.min(viewArea.maxY * this.tileCacheSize, (y + 1) * this.tileCacheSize), g);
                        }
                    }
                }

                this.cacheableChunks.fill(null);

                // delete old, unseen, tile cache chunks to save memory
                for (let i = 0; i < this.tileCaches.length; i++) {
                    const tileCache = this.tileCaches[i];
                    if (tileCache !== null &&
                        getTime() - tileCache.lastUsed > this.tileCacheDecayTime) {
                        this.tileCachePool.release(tileCache);
                        this.tileCaches[i] = null;
                    }
                }
        }

        pop();
    }

    private padTileCache(alwaysCache: boolean, v = defaultViewpoint, g = defaultDrawTarget) {
        assertCompileTime(this.tileCachePool !== null);

        const viewArea = v.getViewArea(g);

        // add padding and lock drawing to inside tile map
        viewArea.minX = Math.max(0,
            viewArea.minX / this.tileSize - this.tileCachePadding);
        viewArea.minY = Math.max(0,
            viewArea.minY / this.tileSize - this.tileCachePadding);
        viewArea.maxX = Math.min(this.width,
            viewArea.maxX / this.tileSize + this.tileCachePadding);
        viewArea.maxY = Math.min(this.height,
            viewArea.maxY / this.tileSize + this.tileCachePadding);

        // round to nearest tile cache chunk
        viewArea.minX = Math.floor(viewArea.minX / this.tileCacheSize);
        viewArea.minY = Math.floor(viewArea.minY / this.tileCacheSize);
        viewArea.maxX = Math.ceil(viewArea.maxX / this.tileCacheSize);
        viewArea.maxY = Math.ceil(viewArea.maxY / this.tileCacheSize);

        const endTime = getExactTime() + this.tileCachePaddingTime;
        let rush = false;

        // loop through every tile cache chunk
        for (let x = viewArea.minX; x < viewArea.maxX; x++) {
            for (let y = viewArea.minY; y < viewArea.maxY; y++) {
                const cacheIndex = x + y * (this.width / this.tileCacheSize);
                let tileCache = this.tileCaches[cacheIndex];

                // skip drawn chunks
                if (tileCache === null) {
                    if (!rush && (alwaysCache || this.canCacheChunk(x, y))) {
                        tileCache = this.tileCachePool.get();
                        this.tileCaches[cacheIndex] = tileCache;

                        // maintain and draw tile cache
                        this.updateTileCache(x, y, tileCache);

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
        assertCompileTime(this.canCacheTile !== null);

        const chunkIndex = chunkX + chunkY * (this.height / this.tileCacheSize);
        const initCacheValue = this.cacheableChunks[chunkIndex];

        if (initCacheValue !== null) return initCacheValue;

        for (let x = 0; x < this.tileCacheSize; x++) {
            for (let y = 0; y < this.tileCacheSize; y++) {
                const worldX = x + chunkX * this.tileCacheSize,
                    worldY = y + chunkY * this.tileCacheSize;
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

    private drawTileCache(chunkX: number, chunkY: number, g: DrawTarget) {
        assertCompileTime(this.tileCachePool !== null);

        const tileCacheIndex = chunkX + chunkY * (this.width / this.tileCacheSize);

        let tileCache = this.tileCaches[tileCacheIndex];
        if (tileCache === null ||
            getTime() - tileCache.lastUsed > this.tileCacheDecayTime) {
            // create new tile cache
            if (tileCache === null) {
                tileCache = this.tileCachePool.get();
                this.tileCaches[tileCacheIndex] = tileCache;
            }

            this.updateTileCache(chunkX, chunkY, tileCache);
        }

        // draw tile cache to screen
        g.image(tileCache.g,
            chunkX * this.tileCacheSize, chunkY * this.tileCacheSize,
            this.tileCacheSize, this.tileCacheSize);
    }

    private updateTileCache(chunkX: number, chunkY: number, tileCache: TileCache) {
        const cache = tileCache.g;

        cache.push();
        cache.clear(0, 0, 0, 0);
        cache.scale(this.tileCacheResolution);

        for (let x = 0; x < this.tileCacheSize; x++) {
            for (let y = 0; y < this.tileCacheSize; y++) {
                const worldX = x + chunkX * this.tileCacheSize,
                    worldY = y + chunkY * this.tileCacheSize;

                const data = this.getTileData(worldX, worldY);
                this.drawTile(data, x, y, cache);
            }
        }

        cache.pop();
    }

    private drawTiles(minX: number, minY: number, maxX: number, maxY: number, g: DrawTarget) {
        g.push();

        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                const data = this.getTileData(x, y);
                this.drawTile(data, x, y, g);
            }
        }

        g.pop();
    }

    private defaultDrawTile(data: any, x: number, y: number, g = defaultDrawTarget) {
        g.noStroke();

        const brightness = (x + y) % 2 * 255;

        g.fill(brightness)
        g.rect(x, y, 1, 1);

        g.fill(255 - brightness);
        g.textAlign(CENTER, CENTER);
        g.textSize(0.2);
        g.text(String(data), x + 0.5001, y + 0.5001);
    }

    clearTileCache(tileX: number, tileY: number) {
        const tileCacheIndex = Math.floor(tileX / this.tileCacheSize) +
            Math.floor(tileY / this.tileCacheSize) * (this.width / this.tileCacheSize);
        const tileCache = this.tileCaches[tileCacheIndex];

        if (tileCache == null) return; // thus
        assertCompileTime(this.tileCachePool !== null);

        this.tileCachePool.release(tileCache);
        this.tileCaches[tileCacheIndex] = null;
    }

    getSolid(x: number, y: number) {
        // @ts-ignore because this._SOLIDFIELD is always defined
        const solid = this.get(x, y, this._SOLIDFIELD);
        if (solid === undefined) return undefined;
        return Boolean(solid);
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

        this.clearTileCache(x, y);
        this.updateSolidData(x, y);

        return true;
    }

    private updateSolidData(x: number, y: number) {
        if (this.isSolidTile === null) return;

        // @ts-ignore because this._SOLIDFIELD is always defined
        const solidField = this.fields[this._SOLIDFIELD] as SolidFieldType;
        const isSolid = this.isSolidTile(this.getTileData(x, y));
        const solidIndex = x + y * this.width;

        if (this.body !== null) {
            if (!!solidField.data[solidIndex] !== isSolid) {
                this.bodyValid = false;
            }
        }

        solidField.data[solidIndex] = isSolid ? 1 : 0;
    }

    validateCoord(x: number, y: number) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    get area() {
        return this.width * this.height;
    }
}