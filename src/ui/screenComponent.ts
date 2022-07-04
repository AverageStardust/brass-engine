import { Vector2 } from "../vector/vector2";
import { getDrawTarget } from "../drawSurface";
import { BranchComponentAbstract } from "./branchComponentAbstract";



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
