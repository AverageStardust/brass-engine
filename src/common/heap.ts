abstract class HeapAbstract<T> {

	protected data: T[];
	private readonly compare: (a: T, b: T) => boolean;

	constructor(data: T[] = [], compare?: (a: T, b: T) => boolean) {
		if (compare === undefined)
			throw Error("Heap was expecting a compare function");

		this.data = data;
		this.compare = compare;

		if (this.data.length > 1)
			this.sort();

		return this;
	}

	insert(value: T) {
		this.data.push(value);
		this.siftUp(this.size - 1);

		return this;
	}

	remove(index = 0) {
		if (this.size === 0)
			return undefined;
		if (this.size === 1)
			return this.data.pop();
		if (this.data.length <= index)
			return undefined;

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

	log() {
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

				if (dataStr.length === 3)
					str += dataStr;
				else if (dataStr.length === 2)
					str += fillChar + dataStr;
				else if (dataStr.length === 1)
					str += fillChar + dataStr + fillChar;
				else
					str += "???";

				if (c % 2) {
					topStr += "\\" + fillChar.repeat(2);
				} else {
					topStr += fillChar.repeat(2) + "/";
				}

				i++;
				if (i >= this.size)
					break;

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
		if (index === 0)
			return this;

		const parentIndex = this.parent(index);

		if (!this.compare(
			this.data[index],
			this.data[parentIndex]))
			return this;

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

	protected abstract swap(indexA: number, indexB: number): this;

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

export class Heap<T> extends HeapAbstract<T> {
	protected swap(indexA: number, indexB: number) {
		const aValue = this.data[indexA];
		this.data[indexA] = this.data[indexB];
		this.data[indexB] = aValue;

		return this;
	}
}

export class MappedHeap<T> extends HeapAbstract<T> {
	private readonly map: Map<T, number>;

	constructor(data: T[] = [], compare?: (a: T, b: T) => boolean) {
		super([], compare);
		this.map = new Map();

		for (let i = 0; i < this.data.length; i++) {
			this.map.set(this.data[i], i);
		}
		this.data = data;

		if (this.data.length > 1)
			this.sort();
	}

	insert(value: T) {
		if (this.map.get(value) !== undefined) {
			this.removeValue(value);
		}

		this.map.set(value, this.data.length);
		super.insert(value);

		return this;
	}

	removeValue(value: T) {
		const index = this.map.get(value);
		if (index === undefined)
			return undefined;

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

export class MaxHeap<T> extends Heap<T> {
	constructor(data: T[]) {
		super(data, (a: T, b: T) => a > b);
	}
}

export class MinHeap<T> extends Heap<T> {
	constructor(data: T[]) {
		super(data, (a: T, b: T) => a < b);
	}
}

export class MappedMaxHeap<T> extends MappedHeap<T> {
	constructor(data: T[]) {
		super(data, (a: T, b: T) => a > b);
	}
}

export class MappedMinHeap<T> extends MappedHeap<T> {
	constructor(data: T[]) {
		super(data, (a: T, b: T) => a < b);
	}
}