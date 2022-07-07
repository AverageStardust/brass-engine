import { P5LayerMap } from "../layers/p5Layers";
import { Vector2 } from "../vector/vector2";

export abstract class ComponentAbstract {
	id = Symbol();
	private cache: Map<string, unknown> = new Map();
	protected _style: any;
	position = new Vector2();
	abstract size: Vector2;
	abstract targetSize: Vector2;
	abstract changed: boolean;
	weight = 1;

	constructor(style: any = {}) {
		this._style = style;
	}

	get style(): {} {
		return this.getStyle(this, "_style");
	}

	set style(value: any) {
		this.setStyle(this, "_style", value);
	}

	abstract draw(g: P5LayerMap): void;

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

	private getStyle(object: {}, prop: string): any {
		if (object.hasOwnProperty(prop)) {
			const value = Reflect.get(object, prop);
			if (typeof value !== "object") {
				return value;
			} else {
				return new Proxy(value, {
					get: this.getStyle.bind(this),
					set: this.setStyle.bind(this)
				});
			}
		} else {
			return Reflect.get(object, prop);
		}
	}

	private setStyle(object: {}, prop: string, value: unknown): boolean {
		if (object.hasOwnProperty(prop)) {
			if (typeof value === "object" && value !== null) {
				let succuss = true;
				for (const key of Object.keys(value)) {
					succuss &&= this.setStyle(
						Reflect.get(object, prop),
						key,
						Reflect.get(value, prop));
				}
				return succuss;
			} else {
				const succuss = Reflect.set(object, prop, value);
				if (succuss) this.displayChange();
				return succuss;
			}
		}
		throw Error(`Can't set none-existent style property (${prop})`);
	}
}