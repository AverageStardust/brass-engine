/**
 * Handles vector math.
 * @module vector
 */

 const watchedVectorHandler: ProxyHandler<any> = {
	get(target, prop) {
		const value = Reflect.get(target, prop);
		if (typeof value === "function") {
			return watchedVectorMethod.bind(target, value);
		}
		return value;
	},

	set(target, prop, value) {
		const success = Reflect.set(target, prop, value);
		if (!success)
			return false;
		(target.watcher as Function)(target);
		return true;
	},
 };
 


export class VectorAbstract {
	watcher?: Function;
}

export function watchVector<T extends VectorAbstract>(vector: T, watcher: Function): T {
	vector.watcher = watcher;
	return new Proxy(vector, watchedVectorHandler);
}

function watchedVectorMethod(method: Function, ...args: any[]) {
	const oldX = this.x, oldY = this.y, oldZ = this.z;
	const result = method.call(this, ...args);
	if (this.x !== oldX || this.y !== oldY || this.z !== oldZ) {
		this.watcher(this);
	}
	return result;
}