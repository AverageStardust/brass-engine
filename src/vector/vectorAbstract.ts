/**
 * Handles vector math.
 * @module vector
 */

export abstract class VectorAbstract {
	abstract array: number[];

	watch(watcher: Function) {
		return new Proxy(this, {
			get: this.getWatchedValue.bind(this, watcher),
			set: this.setWatchedValue.bind(this, watcher)
		});
	}

	private getWatchedValue(watcher: Function, _: this, prop: string) {
		const value = Reflect.get(this, prop);
		if (typeof value === "function") {
			return this.watchedVectorMethod.bind(this, watcher, value);
		}
		return value;
	}

	private setWatchedValue(watcher: Function, _: this, prop: string, value: unknown) {
		const oldValue = Reflect.get(this, prop);
		const success = Reflect.set(this, prop, value);
		if (!success) return false;
		if (oldValue === value) return true;
		watcher(this);
		return true;
	}

	private watchedVectorMethod(watcher: Function, method: Function, ...args: any[]) {
		const oldArray = this.array;
		const result = method.call(this, ...args);
		const newArray = this.array;

		for (let i = 0; i < oldArray.length; i++) {
			if (oldArray[i] !== newArray[i]) {
				watcher(this);
				break;
			}
		}

		return result;
	}
}