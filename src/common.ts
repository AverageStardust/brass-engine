import p5 from "p5";



export type Opaque<T, S> = T & { __opaque__: S };

export type ColorArgs = [string] | [number] | [number, number] | [number, number, number] | [number, number, number, number] | [p5.Color];

export type DynamicTypedArrayType = "int8" | "int16" | "int32" | "uint8" | "uint16" | "uint32" | "float32" | "float64";
export type DynamicArrayType = "any" | DynamicTypedArrayType;
export type DynamicTypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array;
export type DynamicArray = any[] | DynamicTypedArray;



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



export function assert(condition: boolean, message = "Assertion failed"): asserts condition {
	if (!condition) throw Error(message);
}

export function expect(condition: boolean, message = "Expectation failed"): asserts condition {
	if (!condition) console.error(message);
}


export function createColor(...colArgs: ColorArgs) {
	// @ts-ignore because this is safe, if not type-checkable
	return color(...colArgs);
}

export function createFastGraphics(width: number, height: number, renderer?: p5.RENDERER, pInst?: p5) {
	return new FastGraphics(width, height, renderer, pInst) as unknown as p5.Graphics;
}

// 99% evil hacks
class FastGraphics extends p5.Element {
	width: number;
	height: number;
	_pixelDensity: number;

	pInst: p5;
	canvas: HTMLCanvasElement;
	_renderer: any;

	constructor(width: number, height: number, renderer: p5.RENDERER = P2D, pInst?: p5) {
		const canvas = document.createElement("canvas");

		super(canvas as any, pInst);

		// @ts-ignore because this is all hacks
		this._glAttributes = {};
		for (var p in p5.prototype) {
			// @ts-ignore because this is all hacks
			if (!this[p]) {
				// @ts-ignore because this is all hacks
				if (typeof p5.prototype[p] === "function") {
					// @ts-ignore because this is all hacks
					this[p] = p5.prototype[p].bind(this);
				} else {
					// @ts-ignore because this is all hacks
					this[p] = p5.prototype[p];
				}
			}
		}

		this.pInst = (pInst ?? window) as p5;

		// @ts-ignore because this is all hacks
		p5.prototype._initializeInstanceVariables.apply(this);
		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this._pixelDensity = this.pInst.pixelDensity();

		if (renderer === WEBGL) {
			// @ts-ignore because this is all hacks
			this._renderer = new p5.RendererGL(this.canvas, this, false);
		} else {
			// @ts-ignore because this is all hacks
			this._renderer = new p5.Renderer2D(this.canvas, this, false);
		}

		this._renderer.resize(width, height);
		this._renderer._applyDefaults();
	}

	reset() {
		this._renderer.resetMatrix();
		if (this._renderer.isP3D) {
			this._renderer._update();
		}
	}

	remove() {
		// @ts-ignore because this is all hacks
		for (var elt_ev in this._events) {
			// @ts-ignore because this is all hacks
			this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
		}
	}
}



export class Pool<T> {
	private readonly pool: T[];
	readonly limited: boolean;
	private readonly generator: () => T;
	private readonly cleaner: (obj: T) => T;

	constructor(initalSize: number, limited: boolean, generator: () => T, cleaner?: (obj: T) => T) {
		this.pool = Array(initalSize).fill(null).map(generator);
		this.limited = limited;
		this.generator = generator;
		this.cleaner = cleaner ?? ((obj) => obj);
	}

	get() {
		if (this.pool.length <= 0) {
			if (this.limited) {
				throw Error(`Limited pool ran out of objects`);
			}
			return this.generator();
		}
		return this.cleaner(this.pool.pop() as T);
	}

	release(obj: T) {
		this.pool.push(obj);
	}

	get size() {
		return this.pool.length;
	}
}


abstract class HeapAbstract<HeapType> {

	protected data: HeapType[];
	private readonly compare: (a: HeapType, b: HeapType) => boolean;

	constructor(data: HeapType[] = [], compare?: (a: HeapType, b: HeapType) => boolean) {
		if (compare === undefined) throw Error("Heap was expecting a compare function");

		this.data = data;
		this.compare = compare;

		if (this.data.length > 1) this.sort();

		return this;
	}

	insert(value: any) {
		this.data.push(value);
		this.siftUp(this.size - 1);

		return this;
	}

	remove(index = 0) {
		if (this.size === 0) return undefined;
		if (this.size === 1) return this.data.pop();
		if (this.data.length <= index) return undefined;

		this.swap(index, this.data.length - 1);
		const value = this.data.pop();
		this.siftDown(index);

		return value;
	}

	top() {
		return this.data[0];
	}

	sort() {
		for (let i = this.size - 1; i >= 0; i--) {
			this.siftDown(i);
		}

		return this;
	}

	log() { // shit code for debugging
		const fillChar = "\u00A0";
		const rows = Math.floor(Math.log2(this.size) + 1);
		const rowLength = Math.pow(2, rows - 1) * 4 - 1;
		const output = [];

		for (let r = 0, i = 0; r < rows; r++) {
			const cols = Math.pow(2, r);
			let str = fillChar.repeat((Math.pow(2, rows - r - 1) - 1) * 2);
			let topStr = str;

			for (let c = 0; c < cols; c++) {
				const dataStr = String(this.data[i]).substr(0, 3);

				if (dataStr.length === 3) str += dataStr;
				else if (dataStr.length === 2) str += fillChar + dataStr;
				else if (dataStr.length === 1) str += fillChar + dataStr + fillChar;
				else str += "???";

				if (c % 2) {
					topStr += "\\" + fillChar.repeat(2);
				} else {
					topStr += fillChar.repeat(2) + "/";
				}

				i++;
				if (i >= this.size) break;

				if (c + 1 < cols) {
					const interStr = fillChar.repeat(
						(Math.pow(2, rows - r) - 1) * 2 - 1);
					str += interStr;
					topStr += interStr;
				}
			}

			if (r > 0) {
				output.push(topStr.padEnd(rowLength, fillChar));
			}
			output.push(str.padEnd(rowLength, fillChar));
		}

		console.log(output.join("\n"));

		return this;
	}

	private siftUp(index: number) {
		if (index === 0) return this;

		const parentIndex = this.parent(index);

		if (!this.compare(
			this.data[index],
			this.data[parentIndex])) return this;

		this.swap(index, parentIndex)
			.siftUp(parentIndex);

		return this;
	}

	private siftDown(index: number) {
		const leftIndex = this.childLeft(index);
		const rightIndex = this.childRight(index);

		// only continue with 2 children
		if (rightIndex >= this.size) {
			// check for single left child and left > parent
			if (leftIndex < this.size &&
				this.compare(
					this.data[leftIndex],
					this.data[index])) {
				// swap left and parent
				this.swap(index, leftIndex);
			}
			return this;
		}

		// check what is greater, left or right
		if (this.compare(
			this.data[leftIndex],
			this.data[rightIndex])) {
			// if left > right, then check if left > parent
			if (this.compare(
				this.data[leftIndex],
				this.data[index])) {
				// swap left and parent and continue at left
				this.swap(index, leftIndex)
					.siftDown(leftIndex);
			}
		} else {
			// if right > left, then check if right > parent
			if (this.compare(
				this.data[rightIndex],
				this.data[index])) {
				// swap right and parent and continue at right
				this.swap(index, rightIndex)
					.siftDown(rightIndex);
			}
		}

		return this;
	}

	protected abstract swap(indexA: number, indexB: number): this

	private parent(index: number) {
		return (index - 1) >> 1;
	}

	private childLeft(index: number) {
		return (index << 1) + 1;
	}

	private childRight(index: number) {
		return (index << 1) + 2;
	}

	get size() {
		return this.data.length;
	}
}

export class Heap<HeapType> extends HeapAbstract<HeapType> {
	protected swap(indexA: number, indexB: number) {
		const aValue = this.data[indexA];
		this.data[indexA] = this.data[indexB];
		this.data[indexB] = aValue;

		return this;
	}
}

export class MappedHeap<HeapType> extends HeapAbstract<HeapType> {
	private readonly map: Map<HeapType, number>;

	constructor(data: HeapType[] = [], compare?: (a: HeapType, b: HeapType) => boolean) {
		super([], compare);
		this.map = new Map();

		for (let i = 0; i < this.data.length; i++) {
			this.map.set(this.data[i], i);
		}
		this.data = data;

		if (this.data.length > 1) this.sort();
	}

	insert(value: HeapType) {
		if (this.map.get(value) !== undefined) {
			this.removeValue(value);
		}

		this.map.set(value, this.data.length);
		super.insert(value);

		return this;
	}

	removeValue(value: HeapType) {
		const index = this.map.get(value);
		if (index === undefined) return undefined;

		super.remove(index);
		this.map.delete(value);

		return value;
	}

	protected swap(indexA: number, indexB: number) {
		const aValue = this.data[indexA];
		const bValue = this.data[indexB];

		this.data[indexA] = bValue;
		this.map.set(bValue, indexA);

		this.data[indexB] = aValue;
		this.map.set(aValue, indexB);

		return this;
	}
}

export class MaxHeap<HeapType> extends Heap<HeapType> {
	constructor(data: HeapType[]) {
		super(data, (a: HeapType, b: HeapType) => a > b);
	}
}

export class MinHeap<HeapType> extends Heap<HeapType> {
	constructor(data: HeapType[]) {
		super(data, (a: HeapType, b: HeapType) => a < b);
	}
}

export class MappedMaxHeap<HeapType> extends MappedHeap<HeapType> {
	constructor(data: HeapType[]) {
		super(data, (a: HeapType, b: HeapType) => a > b);
	}
}

export class MappedMinHeap<HeapType> extends MappedHeap<HeapType> {
	constructor(data: HeapType[]) {
		super(data, (a: HeapType, b: HeapType) => a < b);
	}
}

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
	for (var i = 0; i < raw.byteLength; i++) {
		binary.push(String.fromCharCode(raw[i]));
	}

	return btoa(binary.join(""));
}

export function decodeDynamicTypedArray(type: DynamicTypedArrayType, base64: string): DynamicTypedArray {
	const binary = window.atob(base64);

	const raw = new Uint8Array(binary.length);
	for (var i = 0; i < raw.byteLength; i++) {
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