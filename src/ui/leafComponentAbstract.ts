import { Vector2 } from "../vector/vector2";
import { ComponentAbstract } from "./componentAbstract";


export abstract class LeafComponentAbstract extends ComponentAbstract {
	size: Vector2 = new Vector2();
	changed: boolean = true;

	findTarget() {
		return this;
	}
}
