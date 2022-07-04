import { Vector2 } from "../vector/vector2";
import { LeafComponentAbstract } from "./leafComponentAbstract";


export class EmptyComponent extends LeafComponentAbstract {
	targetSize = new Vector2(0, 0);

	draw() { }
}
