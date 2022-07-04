import { Vector2 } from "../vector/vector2";
import { P5DrawBuffer, P5DrawSurfaceMap } from "../drawSurface";
import p5 from "p5";
import { ComponentAbstract } from "./componentAbstract";


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
		if (this._changed)
			return true;
		return this.children
			.map((child) => child.changed)
			.reduce((a, b) => a || b);
	}

	findTarget(position) {
		return this.findChildAt(position) ?? this;
	}

	findChildAt(position) {
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
