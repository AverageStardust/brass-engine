/**
 * Handles vector math.
 * @module vector
 */

import { UnknownFunction } from "../common/types";

export abstract class VectorAbstract {
	abstract array: number[];

	watch(watcher: (watchedVector: this) => void) {
		return new Proxy(this, {
			get: this.getWatchedValue.bind(this, watcher),
			set: this.setWatchedValue.bind(this, watcher)
		});
	}

	private getWatchedValue(watcher: (watchedVector: this) => void, _: this, prop: string) {
		const value = Reflect.get(this, prop);
		if (typeof value === "function") {
			return this.watchedVectorMethodWrapper.bind(this, watcher, value);
		}
		return value;
	}

	private setWatchedValue(watcher: (watchedVector: this) => void, _: this, prop: string, value: unknown) {
		const oldValue = Reflect.get(this, prop);
		const success = Reflect.set(this, prop, value);
		if (!success) return false;
		if (oldValue === value) return true;
		watcher(this);
		return true;
	}

	private watchedVectorMethodWrapper(watcher: (watchedVector: this) => void, method: UnknownFunction, ...args: unknown[]) {
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