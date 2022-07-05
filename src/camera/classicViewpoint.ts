import { Vector2 } from "../vector/vector2";
import { ViewpointAbstract, ViewpointAbstractOptions} from "./viewpointAbstract";




export class ClassicViewpoint extends ViewpointAbstract {
	constructor(scale = 100, translation = new Vector2(), options: ViewpointAbstractOptions = {}) {
		super(scale, translation, options);
	}

	update() { }

	protected getViewOrigin() {
		return new Vector2(0, 0);
	}
}
