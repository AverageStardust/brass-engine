import { Vector2 } from "../vector/vector2";
import { P5DrawSurfaceMap } from "../drawSurface";
import { LeafComponentAbstract } from "./leafComponentAbstract";


export class ButtonComponent extends LeafComponentAbstract {
	targetSize = new Vector2(32, 32);

	draw(g: P5DrawSurfaceMap) {
		g.stroke(0);
		g.fill(240);
		g.rect(1, 1, this.size.x - 2, this.size.y - 2);
	}
}
