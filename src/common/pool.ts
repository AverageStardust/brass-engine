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