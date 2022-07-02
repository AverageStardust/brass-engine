import { Vector2 } from "./vector";
import { getDrawTarget, P5DrawBuffer, P5DrawSurfaceMap } from "./drawSurface";
import p5 from "p5";

export abstract class ComponentAbstract {
	private cache: Map<string, unknown> = new Map();
	position = new Vector2();
	abstract size;
	abstract targetSize: Vector2;
	abstract changed: boolean;
	weight = 1;

	abstract draw(g: P5DrawSurfaceMap);

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

export abstract class LeafComponentAbstract extends ComponentAbstract {
	size: Vector2 = new Vector2();
	changed: boolean;
}

export abstract class BranchComponentAbstract extends ComponentAbstract {
	protected children: ComponentAbstract[] = [];
	private _size: Vector2 = new Vector2();
	private _changed = true;
	bufferDisplay = false;
	drawBuffer = new P5DrawBuffer();

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
		if (this._changed) return true;
		return this.children
			.map((child) => child.changed)
			.reduce((a, b) => a || b);
	}

	abstract distributeSize(size: Vector2, oldSize: Vector2);
	abstract collectTargetSize(): Vector2;

	draw(g: P5DrawSurfaceMap) {
		if (this.bufferDisplay) {
			const buffer = this.drawBuffer.getMaps(this.size).canvas;
			this._draw(buffer);
			g.image(buffer as unknown as p5.Image, 0, 0);
			return;
		}
		this._draw(g);
	}

	_draw(g: P5DrawSurfaceMap) {
		this.children.map((child) => {
			g.push();
			const { x, y } = child.position;
			g.translate(x, y);
			child.draw(g);
			g.pop();
		});
	}
}

export class EmptyComponent extends LeafComponentAbstract {
	targetSize = new Vector2(0, 0);

	draw() { }
}

export class ButtonComponent extends LeafComponentAbstract {
	targetSize = new Vector2(32, 32);

	draw(g: P5DrawSurfaceMap) {
		g.stroke(0);
		g.fill(240);
		g.rect(1, 1, this.size.x - 2, this.size.y - 2);
	}
}


export class ScreenComponent extends BranchComponentAbstract {
	distributeSize(size: Vector2, oldSize: Vector2) {
		const scaleRatio = size.copy().div(oldSize);
		for (const child of this.children) {
			child.position.mult(scaleRatio);
			child.position.mult(scaleRatio);
		}
	}

	collectTargetSize() {
		return Vector2.fromObjFast(getDrawTarget("default").getSize());
	}
}

export class ListComponent extends BranchComponentAbstract {
	vertical = true;
	strechChildren = true;

	distributeSize(size: Vector2) {
		const weightSum = this.children
			.map((child) => child.weight)
			.reduce((a, b) => a + b);

		if (this.vertical) {
			let y = 0, unusedHeight = size.y;
			this.children.map((child) => {
				const height = Math.ceil(unusedHeight * child.weight / weightSum);
				unusedHeight -= height;
				child.position = new Vector2(
					this.strechChildren ? 0 : Math.floor((size.x - child.size.x) / 2), y);
				child.size = new Vector2(
					this.strechChildren ? size.x : Math.min(size.x, child.targetSize.x), height);
				y += height;
			});
		} else {
			let x = 0, unusedWidth = size.x;
			this.children.map((child) => {
				const width = Math.ceil(unusedWidth * child.weight / weightSum);
				unusedWidth -= width;
				child.position = new Vector2(
					x, this.strechChildren ? 0 : Math.floor((size.y - child.size.y) / 2));
				child.size = new Vector2(
					width, this.strechChildren ? size.y : Math.min(size.y, child.targetSize.y));
				x += width;
			});
		}
	}

	collectTargetSize() {
		const sizes = this.children
			.map((child) => child.size);
		if (this.vertical) {
			return sizes.reduce(
				(a, b) => new Vector2(Math.max(a.x, b.x), a.y + b.y));
		} else {
			return sizes.reduce(
				(a, b) => new Vector2(a.x + b.x, Math.max(a.y, b.y)));
		}
	}
}