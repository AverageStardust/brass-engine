import { VectorAbstract } from "./vectorAbstract";



export type Vertex2 = { x: number; y: number; };



export class Vector2 extends VectorAbstract {
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

	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		super();
		this.x = x;
		this.y = y;
	}

	copy() {
		return new Vector2(this.x, this.y);
	}

	equal(vec: Vertex2) {
		return this.x === vec.x && this.y === vec.y;
	}

	equalScalar(x: number, y = x) {
		return this.x === x && this.y === y;
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
		this.y += y;
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
		this.y *= y;
		return this;
	}

	div(vec: Vertex2) {
		this.x /= vec.x;
		this.y /= vec.y;
		return this;
	}

	divScalar(x = 1, y = x) {
		this.x /= x;
		this.y /= y;
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
		if (mag === 0)
			return this;

		const multiplier = magnitude / mag;

		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	normArea(targetArea = 1) {
		const area = this.area;
		if (area === 0)
			return this;

		const multiplier = Math.sqrt(targetArea / area);

		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	limit(limit = 1) {
		if (this.mag > limit)
			this.norm(limit);
		return this;
	}

	min(vec: Vector2) {
		this.x = Math.min(this.x, vec.x);
		this.y = Math.min(this.y, vec.y);
		return this;
	}

	minScalar(x: number, y = x) {
		this.x = Math.min(this.x, x);
		this.y = Math.min(this.y, y);
		return this;
	}

	max(vec: Vector2) {
		this.x = Math.max(this.x, vec.x);
		this.y = Math.max(this.y, vec.y);
		return this;
	}

	maxScalar(x: number, y = x) {
		this.x = Math.max(this.x, x);
		this.y = Math.max(this.y, y);
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

	angleBetween(vec: Vertex2) {
		const cosAngleBetween = (this.x * vec.x + this.y * vec.y) /
			(Math.hypot(this.x, this.y) * Math.hypot(vec.x, vec.y));
		return Math.acos(Math.max(0, Math.min(1, cosAngleBetween)));
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
		const x = this.x * vec.y + this.y * vec.y;
		const y = vec.y * this.x - vec.x - this.y;
		this.x = x;
		this.y = y;
	}

	dist(vec: Vertex2) {
		return Math.hypot(this.x - vec.x, this.y - vec.y);
	}

	distSq(vec: Vertex2) {
		const distX = this.x - vec.x, distY = this.y - vec.y;
		return distX * distX + distY * distY;
	}

	get xy() {
		return new Vector2(this.x, this.y);
	}

	set xy(vec: Vector2) {
		[this.x, this.y] = vec.array;
	}

	get yx() {
		return new Vector2(this.y, this.x);
	}

	set yx(vec: Vector2) {
		[this.y, this.x] = vec.array;
	}

	get mag() {
		return Math.hypot(this.x, this.y);
	}

	set mag(magnitude) {
		this.norm(magnitude);
	}

	get magSq() {
		return this.x * this.x + this.y * this.y;
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

	get array(): [number, number] {
		return [this.x, this.y];
	}

	set array([x, y]: [number, number]) {
		this.x = x;
		this.y = y;
	}
}
