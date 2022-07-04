import { Vector2 } from "../vector/vector2";
import { BranchComponentAbstract } from "./branchComponentAbstract";

export enum DivDirection {
	Vertical = "vertical",
	Horizontal = "horizontal"
}

export class DivComponent extends BranchComponentAbstract {
	direction = DivDirection.Vertical;
	stretch = true;

	distributeSize(size: Vector2) {
		const weightSum = this.children
			.map((child) => child.weight)
			.reduce((a, b) => a + b);

		if (this.direction === DivDirection.Horizontal) {
			let x = 0, unusedWidth = size.x;
			this.children.map((child) => {
				const width = Math.ceil(unusedWidth * child.weight / weightSum);
				unusedWidth -= width;
				child.position = new Vector2(
					x, this.stretch ? 0 : Math.floor((size.y - child.size.y) / 2));
				child.size = new Vector2(
					width, this.stretch ? size.y : Math.min(size.y, child.targetSize.y));
				x += width;
			});
		} else {
			let y = 0, unusedHeight = size.y;
			this.children.map((child) => {
				const height = Math.ceil(unusedHeight * child.weight / weightSum);
				unusedHeight -= height;
				child.position = new Vector2(
					this.stretch ? 0 : Math.floor((size.x - child.size.x) / 2), y);
				child.size = new Vector2(
					this.stretch ? size.x : Math.min(size.x, child.targetSize.x), height);
				y += height;
			});
		}
	}

	collectTargetSize() {
		const sizes = this.children
			.map((child) => child.size);
		if (this.direction === DivDirection.Vertical) {
			return sizes.reduce(
				(a, b) => new Vector2(Math.max(a.x, b.x), a.y + b.y));
		} else if (this.direction === DivDirection.Horizontal) {
			return sizes.reduce(
				(a, b) => new Vector2(a.x + b.x, Math.max(a.y, b.y)));
		}
	}
}
