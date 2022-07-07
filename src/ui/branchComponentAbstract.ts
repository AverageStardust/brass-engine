import { Vector2 } from "../vector/vector2";
import { ComponentAbstract } from "./componentAbstract";
import { P5DrawBuffer, P5LayerMap } from "../layers/p5Layers";
import p5 from "p5";


export abstract class BranchComponentAbstract extends ComponentAbstract {
	protected children: ComponentAbstract[] = [];
	private _size: Vector2 = new Vector2();
	private _changed = true;
	drawBuffer = new P5DrawBuffer();

	constructor(style: any = {}) {
		style.bufferDisplay ??= true;
		super(style);
	}

	set size(size: Vector2) {
		size = size.copy().floor();
		this.distributeSize(size, this._size);
		this._size = size.copy().floor();
		this.changed = true;
	}

	get targetSize() {
		return this.cacheProperty("targetSize", this.collectTargetSize);
	}

	set changed(value) {
		this._changed = value;
	}

	get changed() {
		if (this._changed)
			return true;
		return this.children
			.map((child) => child.changed)
			.reduce((a, b) => a || b);
	}

	addChild(child: ComponentAbstract, location?: number | ComponentAbstract) {
		const index = this.evaluateChildLocation(location);
		this.children.splice(index, 0, child);
		this.displayChange();
		return this;
	}

	removeChild(location?: number | ComponentAbstract) {
		const index = this.evaluateChildLocation(location);
		this.children.splice(index, 1);
		this.displayChange();
		return this;
	}

	protected evaluateChildLocation(location: number | ComponentAbstract = this.children.length) {
		if (typeof location !== "number") {
			location = this.findChildIndex(location);
			if (location === -1) {
				throw Error("Could not locate child, not in parent");
			}
		}
		return Math.max(0, location);
	}

	findChildIndex(component: ComponentAbstract) {
		for (let i = 0; i < this.children.length; i++) {
			if (component.id === this.children[i].id) {
				return i;
			}
		}
		return -1;
	}

	findTarget(position: Vector2) {
		return this.findChildAt(position) ?? this;
	}

	findChildAt(position: Vector2) {
		for (const child of this.children) {
			if (position.x >= child.position.x &&
				position.x >= child.position.x + child.size.x &&
				position.y >= child.position.y &&
				position.y >= child.position.y + child.size.y) {
				return child;
			}
		}
		return null;
	}

	abstract distributeSize(size: Vector2, oldSize: Vector2): void;
	abstract collectTargetSize(): Vector2;

	draw(g: P5LayerMap) {
		if (this._style.bufferDisplay) {
			const buffer = this.drawBuffer.getMaps(this.size).canvas;
			if (this._changed) {
				this._draw(buffer);
			}
			g.image(buffer as unknown as p5.Image, 0, 0);
			return;
		}
		this._draw(g);
		this._changed = false;
	}

	_draw(g: P5LayerMap) {
		this.children.map((child) => {
			g.push();
			const { x, y } = child.position;
			g.translate(x, y);
			child.draw(g);
			g.pop();
		});
	}
}
