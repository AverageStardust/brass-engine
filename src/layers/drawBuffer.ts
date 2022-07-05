import { Vertex2 } from "../vector/vector2";
import { LayerAbstract } from "./LayerAbstract";


export class DrawBuffer<T> extends LayerAbstract<T> {
	protected size: Vertex2 | null = null;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator) {
		super(creator, resizer);
	}

	getMaps(size?: Vertex2) {
		if (size === undefined) {
			if (this.size === null)
				this.throwSizeError();
		} else {
			this.sizeMaps(size);
		}
		return this.maps;
	}
}
