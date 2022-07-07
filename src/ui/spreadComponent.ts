import { Vector2 } from "../vector/vector2";
import { BranchComponentAbstract } from "./branchComponentAbstract";



export class SpreadComponent extends BranchComponentAbstract {
	distributeSize(size: Vector2) {
		for (const child of this.children) {
			child.position = new Vector2();
			child.size = size;
		}
	}

	collectTargetSize() {
		return new Vector2(Infinity, Infinity);
	}
}
