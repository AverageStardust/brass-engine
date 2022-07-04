import { Vector2 } from "../vector/vector2";
import { P5DrawSurfaceMap } from "../drawSurface";

export abstract class ComponentAbstract {
	id = Symbol();
	private cache: Map<string, unknown> = new Map();
	position = new Vector2();
	abstract size;
	abstract targetSize: Vector2;
	abstract changed: boolean;
	weight = 1;

	abstract draw(g: P5DrawSurfaceMap);

	abstract findTarget(position: Vector2): ComponentAbstract | null;

	protected cacheProperty<T>(name: string, getValue: () => T): T {
		if (this.cache.has(name)) {
			return this.cache.get(name) as T;
		}
		const value = getValue();
		this.cache.set(name, value);
		return value;
	}

	protected displayChange() {
		this.changed = true;
		this.cache.clear();
	}
}