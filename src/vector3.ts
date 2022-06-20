/**
 * Handles vector math.
 * @module
 */

// author WD_STEVE
// version 3.3.1
// JS only

export type Vertex2 = { x: number, y: number };
export type Vertex3 = { x: number, y: number, z: number };



export class Vector2 {
	x: number;
	y: number;
	watcher?: Function;

	static fromObj(obj: Vertex2) {
		if (typeof obj.x !== "number" || typeof obj.y !== "number") {
			throw Error("Object can't be transformed into Vector2 without numeric x and y properties");
		}

		return new Vector2(obj.x, obj.y);
	}

	static fromObjFast(obj: Vertex2) {
		return new Vector2(obj.x, obj.y);
	}

	static fromDir(dir: number) {
		return new Vector2(Math.cos(dir), Math.sin(dir));
	}

	static fromDirMag(dir: number, mag: number) {
		return new Vector2(mag * Math.cos(dir), mag * Math.sin(dir));
	}

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	copy() {
		return new Vector2(this.x, this.y);
	}

	equal(vec: Vertex2) {
		return this.x === vec.x && this.y === vec.y;
	}

	set(vec: Vertex2) {
		this.x = vec.x;
		this.y = vec.y;
		return this;
	}

	setScalar(x = 0, y = x) {
		this.x = x;
		this.y = y;
		return this;
	}

	add(vec: Vertex2) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	addScalar(x = 0, y = x) {
		this.x += x;
		this.y += y
		return this;
	}

	sub(vec: Vertex2) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}

	subScalar(x = 0, y = x) {
		this.x -= x;
		this.y -= y;
		return this;
	}

	mult(vec: Vertex2) {
		this.x *= vec.x;
		this.y *= vec.y;
		return this;
	}

	multScalar(x = 1, y = x) {
		this.x *= x;
		this.y *= y
		return this;
	}

	div(vec: Vertex2) {
		this.x /= vec.x;
		this.y /= vec.y;
		return this;
	}

	divScalar(x = 1, y = x) {
		this.x /= x;
		this.y /= y
		return this;
	}

	rem(vec: Vertex2) {
		this.x %= vec.x;
		this.y %= vec.y;
		return this;
	}

	remScalar(x = 1, y = x) {
		this.x %= x;
		this.y %= y;
		return this;
	}

	mod(vec: Vertex2) {
		this.x = ((this.x % vec.x) + vec.x) % vec.x;
		this.y = ((this.y % vec.y) + vec.y) % vec.y;
		return this;
	}

	modScalar(x = 1, y = x) {
		this.x = ((this.x % x) + x) % x;
		this.y = ((this.y % y) + y) % y;
		return this;
	}

	abs() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		return this;
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}

	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}

	mix(vec: Vertex2, amount: number) {
		this.x = this.x + (vec.x - this.x) * amount;
		this.y = this.y + (vec.y - this.y) * amount;
		return this;
	}

	norm(magnitude = 1) {
		const mag = this.mag;
		if (mag === 0) return this;

		const multiplier = magnitude / mag;

		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	normArea(targetArea = 1) {
		const area = this.area;
		if (area === 0) return this;

		const multiplier = Math.sqrt(targetArea / area);

		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	limit(limit = 1) {
		if (this.mag > limit) this.norm(limit);
		return this;
	}

	setAngle(angle: number) {
		const mag = this.mag;
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
		return this;
	}

	angleTo(vec: Vertex2) {
		return Math.atan2(vec.y - this.y, vec.x - this.x);
	}

	rotate(angle: number) {
		const cosAngle = Math.cos(angle);
		const sinAngle = Math.sin(angle);

		const x = this.x * cosAngle - this.y * sinAngle;
		this.y = this.x * sinAngle + this.y * cosAngle;
		this.x = x;
		return this;
	}

	dot(vec: Vertex2) {
		return this.x * vec.x + this.y * vec.y;
	}

	cross(vec: Vertex2) {
		const top = vec.y * this.x - vec.x - this.y;
		const bottom = this.x * vec.y + this.y * vec.y;
		return Math.atan(top / bottom);
	}

	dist(vec: Vertex2) {
		return Math.hypot(this.x - vec.x, this.y - vec.y);
	}

	distSq(vec: Vertex2) {
		const distX = this.x - vec.x,
			distY = this.y - vec.y;
		return distX * distX + distY * distY;
	}

	get mag() {
		return Math.hypot(this.x, this.y);
	}

	get magSq() {
		return this.x * this.x + this.y * this.y;
	}

	set mag(magnitude) {
		this.norm(magnitude);
	}

	get area() {
		return this.x * this.y;
	}

	get angle() {
		return Math.atan2(this.y, this.x);
	}

	set angle(angle) {
		this.setAngle(angle);
	}

	get array() {
		return [this.x, this.y];
	}

	set array(arr: [number, number]) {
		this.x = arr[0];
		this.y = arr[1];
	}
}



export class Vector3 {
	x: number;
	y: number;
	z: number;
	watcher?: Function;

	static fromObj(obj: Vertex3) {
		if (typeof obj.x !== "number" || typeof obj.y !== "number" || typeof obj.z !== "number") {
			throw Error("Object can't be transformed into Vector3 without numeric x, y and z properties");
		}

		return new Vector3(obj.x, obj.y, obj.z);
	}

	static fromObjFast(obj: Vertex3) {
		return new Vector3(obj.x, obj.y, obj.z);
	}

	constructor(x = 0, y = x, z = y) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	copy() {
		return new Vector3(this.x, this.y, this.z);
	}

	equal(vec: Vertex3) {
		return this.x === vec.x && this.y === vec.y && this.z === vec.z;
	}

	set(vec: Vertex3) {
		this.x = vec.x;
		this.y = vec.y;
		this.z = vec.z;
		return this;
	}

	setScalar(x = 0, y = x, z = y) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	add(vec: Vertex3) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
		return this;
	}

	addScalar(x = 0, y = x, z = y) {
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}

	sub(vec: Vertex3) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
		return this;
	}

	subScalar(x = 0, y = x, z = y) {
		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	}

	mult(vec: Vertex3) {
		this.x *= vec.x;
		this.y *= vec.y;
		this.z *= vec.z;
		return this;
	}

	multScalar(x = 1, y = x, z = y) {
		this.x *= x;
		this.y *= y;
		this.z *= z;
		return this;
	}

	div(vec: Vertex3) {
		this.x /= vec.x;
		this.y /= vec.y;
		this.z /= vec.z;
		return this;
	}

	divScalar(x = 1, y = x, z = y) {
		this.x /= x;
		this.y /= y;
		this.z /= z;
		return this;
	}


	rem(vec: Vertex3) {
		this.x %= vec.x;
		this.y %= vec.y;
		this.z %= vec.z;
		return this;
	}

	remScalar(x = 1, y = x, z = y) {
		this.x %= x;
		this.y %= y;
		this.z %= z;
		return this;
	}

	mod(vec: Vertex3) {
		this.x = ((this.x % vec.x) + vec.x) % vec.x;
		this.y = ((this.y % vec.y) + vec.y) % vec.y;
		this.z = ((this.z % vec.z) + vec.z) % vec.z;
		return this;
	}

	modScalar(x = 1, y = x, z = y) {
		this.x = ((this.x % x) + x) % x;
		this.y = ((this.y % y) + y) % y;
		this.z = ((this.z % z) + z) % z;
		return this;
	}

	abs() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	mix(vec: Vertex3, amount: number) {
		this.x = this.x + (vec.x - this.x) * amount;
		this.y = this.y + (vec.y - this.y) * amount;
		this.z = this.z + (vec.y - this.z) * amount;
		return this;
	}

	norm(magnitude = 1) {
		const mag = this.mag;
		if (mag === 0) return this;

		const multiplier = magnitude / mag;

		this.x *= multiplier;
		this.y *= multiplier;
		this.z *= multiplier;
		return this;
	}

	limit(limit = 1) {
		if (this.mag > limit) this.norm(limit);
		return this;
	}

	dot(vec: Vertex3) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}

	cross(vec: Vertex3) {
		this.x = this.y * vec.z - this.z * vec.y;
		this.y = this.z * vec.x - this.x * vec.z;
		this.z = this.x * vec.y - this.y * vec.x;

		return this;
	}

	dist(vec: Vertex3) {
		const resultX = this.x - vec.x,
			resultY = this.y - vec.y,
			resultZ = this.z - vec.z;
		return Math.sqrt(resultX * resultX + resultY * resultY + resultZ * resultZ);
	}

	distSq(vec: Vertex3) {
		const resultX = this.x - vec.x,
			resultY = this.y - vec.y,
			resultZ = this.z - vec.z;
		return resultX * resultX + resultY * resultY + resultZ * resultZ;
	}

	get xy() {
		return new Vector2(this.x, this.y);
	}

	get yx() {
		return new Vector2(this.y, this.x);
	}

	get yz() {
		return new Vector2(this.y, this.z);
	}

	get zy() {
		return new Vector2(this.z, this.y);
	}

	get xz() {
		return new Vector2(this.x, this.z);
	}

	get zx() {
		return new Vector2(this.z, this.x);
	}

	get xyz() {
		return new Vector3(this.x, this.y, this.z);
	}

	get yxz() {
		return new Vector3(this.y, this.x, this.z);
	}

	get yzx() {
		return new Vector3(this.y, this.z, this.x);
	}

	get zyx() {
		return new Vector3(this.z, this.y, this.x);
	}

	get xzy() {
		return new Vector3(this.x, this.z, this.y);
	}

	get zxy() {
		return new Vector3(this.z, this.x, this.y);
	}

	get mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	get magSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	set mag(magnitude) {
		this.norm(magnitude);
	}

	get array() {
		return [this.x, this.y, this.z];
	}

	set array(arr: [number, number, number]) {
		this.x = arr[0];
		this.y = arr[1];
		this.z = arr[2];
	}
}

function watchedVectorMethod(method: Function, ...args: any[]) {
	const oldX = this.x, oldY = this.y, oldZ = this.z;
	const result = method.call(this, ...args);
	if (this.x !== oldX || this.y !== oldY || this.z !== oldZ) {
		this.watcher(this);
	}
	return result;
}

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
		if (!success) return false;
		(target.watcher as Function)(target);
		return true;
	},
};

export function watchVector<T extends Vector2 | Vector3>(vector: T, watcher: Function): T {
	vector.watcher = watcher;
	return new Proxy(vector, watchedVectorHandler);
}