import { ViewpointAbstract } from "../camera/viewpointAbstract";
import { LighterAbstract, LighterAbstractOptions } from "./lighterAbstract";
import { CanvasLayer, getDefaultCanvasDrawTarget } from "../layers/canvasLayers";
import { TilemapAbstract } from "../tilemap/tilemapAbstract";
import { Vector2 } from "../vector/vector2";
import { ClassOf } from "../common/types";
import { generateTraceFragShader } from "./reglLighterShaders";



export type SdfClass = ClassOf<SdfAbstract> & { glslFunction: string, propertyCount: number };

interface ReglLighterOptions extends LighterAbstractOptions {
	setDefaultMaterials?: boolean;
	getTilemapMaterial?: (tilemap: TilemapAbstract, x: number, y: number) => string;

	tilemap: TilemapAbstract;

	sdfTypes?: SdfClass[];
}

interface Material {
	reflectivity: number;
	indexOfRefraction: number;
	scattering: number;
	transmissionCurve: number[];
}



export function makeAirMaterial() {
	return {
		reflectivity: 0,
		indexOfRefraction: 1,
		scattering: 0,
		transmissionCurve: new Array(256).fill(1),
	};
}

export function makeSolidMaterial(reflectedWavelengthCenter = 215, reflectedWavelengthRange = 40) {
	return {
		reflectivity: 1,
		indexOfRefraction: 1,
		scattering: 1.57,
		transmissionCurve: new Array(256).fill(1).map((_, wavelength) => {
			const reflected = Math.abs(wavelength - reflectedWavelengthCenter) < reflectedWavelengthRange;
			return reflected ? 1 : 0.2;
		}),
	};
}

export function makeGlassMaterial(reflectedWavelengthCenter = 127, reflectedWavelengthRange = 110) {
	return {
		reflectivity: 0,
		indexOfRefraction: 1.52,
		scattering: 0.05,
		transmissionCurve: new Array(256).fill(1).map((_, wavelength) => {
			const reflected = Math.abs(wavelength - reflectedWavelengthCenter) < reflectedWavelengthRange;
			return reflected ? 1 : 0.5;
		}),
	};
}

export abstract class SdfAbstract {
	position: Vector2;
	static propertyCount: number;

	constructor(x: number, y: number) {
		this.position = new Vector2(x, y);
	}

	getSdf(position: Vector2) {
		const location = position.copy().sub(this.position);
		return this.javascriptFunction(location, ...this.getProperties());
	}

	abstract getProperties(): number[];
	abstract javascriptFunction(location: Vector2, ...properties: number[]): number;
	static glslFunction: string;
}

export class CircleSdf extends SdfAbstract {
	radius: number;
	static propertyCount = 1;

	constructor(x: number, y: number, radius: number) {
		super(x, y);
		this.radius = radius;
	}

	getProperties() {
		return [this.radius];
	}

	javascriptFunction(location: Vector2, radius: number) {
		return location.mag - radius;
	}

	static glslFunction = `
(vec2 location, float radius) { 
\treturn length(location) - radius;
}
`;
}

export class ReglLighter extends LighterAbstract {
	private getTilemapMaterial: (tilemap: TilemapAbstract, x: number, y: number) => string;

	private materialIndexMap: Map<string, number> = new Map();
	private materialNames: (string | null)[];
	private materials: Material[];

	private tilemap: TilemapAbstract;
	private lastTilemapIdentity?: symbol;

	private worldWidth?: number;
	private worldHeight?: number;

	private tilemapKnownMaterial?: number[];
	private tilemapEdgeDistance?: number[];

	private sdfTypeMap: Map<SdfClass, number>;

	private worldKnownMaterial?: number[];
	private worldEdgeDistance?: number[];


	constructor(options: ReglLighterOptions) {
		super(options);

		this.materialNames = new Array(256).fill(null);
		this.materials = new Array(256).fill(null).map(makeAirMaterial);

		this.getTilemapMaterial = options.getTilemapMaterial ?? this.defaultgetTilemapMaterial;

		if (options.setDefaultMaterials ?? true) {
			this.setMaterial("air", makeAirMaterial());
			this.setMaterial("solid", makeSolidMaterial());
			this.setMaterial("glass", makeGlassMaterial());
		}

		this.tilemap = options.tilemap;
		// this.lastTilemapIdentity is not set because an update to tilemap data must be stimulated

		const sdfTypeArray: SdfClass[] = options.sdfTypes ?? [CircleSdf];

		this.sdfTypeMap = new Map(sdfTypeArray.map((sdfType, index) => [sdfType, index]));

		console.log(generateTraceFragShader(sdfTypeArray));
	}

	setMaterial(name: string, material: Material) {
		for (let i = 0; i < 256; i++) {
			const indexName = this.materialNames[i];
			if (indexName === null || indexName === name) {
				this.materialIndexMap.set(name, i);
				this.materialNames[i] = name;
				this.materials[i] = material;
				return;
			}
		}
		throw Error("Failed to assign new material, all 256 material indices in use.");
	}

	deleteMaterial(name: string) {
		this.materialIndexMap.delete(name);
	}

	begin(v: ViewpointAbstract = getDefaultViewpoint(), d: CanvasLayer = getDefaultCanvasDrawTarget()) {
		if (this.lastTilemapIdentity !== this.tilemap.identity) {

			this.lastTilemapIdentity = this.tilemap.identity;
		}
		return this;
	}

	end(d: CanvasLayer = getDefaultCanvasDrawTarget()) {
		return this;
	}

	private defaultgetTilemapMaterial(tilemap: TilemapAbstract, x: number, y: number) {
		return tilemap.getSolid(x, y) ? "solid" : "air";
	}
}

function getDefaultViewpoint(): ViewpointAbstract {
	throw new Error("Function not implemented.");
}
