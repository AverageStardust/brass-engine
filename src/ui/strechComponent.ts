import { Vector2 } from "../vector/vector2";
import { BranchComponentAbstract } from "./branchComponentAbstract";



export class StrechComponent extends BranchComponentAbstract {
	distributeSize(size: Vector2, oldSize: Vector2) {
		const scaleRatio = size.copy().div(oldSize);
		for (const child of this.children) {
			child.position.mult(scaleRatio);
			child.position.mult(scaleRatio);
		}
	}

	collectTargetSize() {
		return new Vector2(Infinity, Infinity);
	}
}
