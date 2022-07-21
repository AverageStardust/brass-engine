export type DynamicTypedArrayType = "int8" | "int16" | "int32" | "uint8" | "uint16" | "uint32" | "float32" | "float64";
export type DynamicArrayType = "any" | DynamicTypedArrayType;
export type DynamicTypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array;
export type DynamicArray = unknown[] | DynamicTypedArray;



const arrayConstructors = {
	"any": Array,
	"int8": Int8Array,
	"int16": Int16Array,
	"int32": Int32Array,
	"uint8": Uint8Array,
	"uint16": Uint16Array,
	"uint32": Uint32Array,
	"float32": Float32Array,
	"float64": Float64Array
};



export function createDynamicArray(type: DynamicArrayType, size: number): DynamicArray {
	const constructor = getArrayConstructor(type);

	return new constructor(size);
}

export function cloneDynamicArray(resultType: DynamicArrayType, data: DynamicArray): DynamicArray {
	const constructor = getArrayConstructor(resultType);

	if (resultType === "any") {
		return new (constructor as ArrayConstructor)(...data);
	} else {
		// @ts-ignore because typed array constructors can take another array as input
		return new constructor(data);
	}
}

export function encodeDynamicTypedArray(data: DynamicTypedArray): string {
	const raw = new Uint8Array(data.buffer);

	const binary = [];
	for (let i = 0; i < raw.byteLength; i++) {
		binary.push(String.fromCharCode(raw[i]));
	}

	return btoa(binary.join(""));
}

export function decodeDynamicTypedArray(type: DynamicTypedArrayType, base64: string): DynamicTypedArray {
	const binary = window.atob(base64);

	const raw = new Uint8Array(binary.length);
	for (let i = 0; i < raw.byteLength; i++) {
		raw[i] = binary.charCodeAt(i);
	}

	return createDynamicTypedArray(type, raw.buffer);
}
function createDynamicTypedArray(type: DynamicArrayType, buffer: ArrayBuffer): DynamicTypedArray {
	const constructor = getArrayConstructor(type);

	// @ts-ignore because typed array constructor can take a buffer
	return new constructor(buffer);
}
function getArrayConstructor(type: DynamicArrayType) {
	const constructor = arrayConstructors[type];

	if (constructor === undefined) {
		throw Error(`Can't find type (${type}) array constructor`);
	}

	return constructor;
}