import { Vector2 } from "../vector/vector2";
import { BranchComponentAbstract } from "./branchComponentAbstract";

export enum DivDirection {
	Vertical = "vertical",
	Horizontal = "horizontal",
	VerticalReversed = "verticalReversed",
	HorizontalReversed = "horizontalReversed"
}

export class DivComponent extends BranchComponentAbstract {
	constructor(style: any = {}) {
		style.direction ??= DivDirection.Vertical;
		style.stretchAcross ??= false;
		style.stretchAlong ??= false;
		super(style);
	}

	distributeSize(size: Vector2) {
		const weightSum = this.children
			.map((child) => child.weight)
			.reduce((a, b) => a + b);

		if (this._style.direction === DivDirection.Horizontal) {
			let x = 0, unusedWidth = size.x;
			this.children.map((child) => {
				const width = Math.ceil(unusedWidth * child.weight / weightSum);
				unusedWidth -= width;
				child.position = new Vector2(
					x, this._style.stretch ? 0 : Math.floor((size.y - child.size.y) / 2));
				child.size = new Vector2(
					width, this._style.stretch ? size.y : Math.min(size.y, child.targetSize.y));
				x += width;
			});
		} else {
			let y = 0, unusedHeight = size.y;
			this.children.map((child) => {
				const height = Math.ceil(unusedHeight * child.weight / weightSum);
				unusedHeight -= height;
				child.position = new Vector2(
					this._style.stretch ? 0 : Math.floor((size.x - child.size.x) / 2), y);
				child.size = new Vector2(
					this._style.stretch ? size.x : Math.min(size.x, child.targetSize.x), height);
				y += height;
			});
		}
	}

	collectTargetSize(): Vector2 {
		let size: Vector2 = new Vector2();
		if (this.children.length === 0) return size;

		const direction = this._style.direction;
		const sizes = this.children
			.map((child) => child.size);

		if (direction === DivDirection.Vertical) {
			size = sizes.reduce(
				(a, b) => new Vector2(Math.max(a.x, b.x), a.y + b.y)) as Vector2;
		} else if (direction === DivDirection.Horizontal) {
			size = sizes.reduce(
				(a, b) => new Vector2(a.x + b.x, Math.max(a.y, b.y))) as Vector2;
		}

		return size;
	}
}
