/**
 * Stores game-worlds on a square grid.
 * @module
 */

import { safeBind } from "../common/runtimeChecking";
import { cloneDynamicArray, createDynamicArray, decodeDynamicTypedArray, DynamicArray, DynamicArrayType, DynamicTypedArray, DynamicTypedArrayType, encodeDynamicTypedArray } from "../common/dynamicArray";
import { GridBody } from "../physics/gridBody";
import { getMatterWorld } from "../physics/bodyAbstract";



type SparseableDynamicArrayType = "sparse" | DynamicArrayType;
export type FieldDeclaration = {
	[name: string]: SparseableDynamicArrayType;
};

type SparseFieldData = { [name: `${number},${number}`]: any };
type SparseableDynamicArray = { sparse: true, data: SparseFieldData } | { sparse: false, data: DynamicArray };
type SolidFieldType = { sparse: false, data: Uint8Array };

interface LevelFields {
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

export interface Level {
	width: number;
	height: number;

	objects: any[];
	tilesets: { [name: string]: LevelTileset };

	fields: LevelFields;
}

interface LevelTileset {
	firstId: number;
	tiles: {
		[id: number]: {
			[name: string]: any;
		}
	};
}

export interface TilemapAbstractOptions {
	tileSize?: number;
	// name and data type stored for every tile
	// field IDs are stored under their name as properties
	fields?: FieldDeclaration
	solidField?: string;

	body?: boolean | Matter.IBodyDefinition;
	autoMaintainBody?: boolean;

	getTileData?: (x: number, y: number) => unknown;
	isTileSolid?: (data: any) => boolean;
}



const tilemaps: TilemapAbstract[] = [];



export function getTilemaps() {
	return tilemaps;
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

	protected readonly getTileData: (x: number, y: number) => unknown;
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

		if (getMatterWorld() !== undefined && options.body === undefined) {
			console.warn("Matter physics is active but Tilemap does not have body; If this is intentional pass false for the body option");
		}
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

		tilemaps.push(this);
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

	export(): Level {
		const fields: LevelFields = {};

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

	import(world: Level) {
		if (world === null) {
			throw Error("Tried to import (null) as world; Did you pass Brass.getLevel() before the world loaded?")
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