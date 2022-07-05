import { Vertex2 } from "../vector/vector2";



export abstract class LayerAbstract<T extends { [key: string]: any; }> {
	id = Symbol();
	protected abstract size: Vertex2 | null;
	protected readonly creator: (size: Vertex2) => T;
	protected readonly resizer: (size: Vertex2, oldMaps: T) => T;
	protected maps!: T;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator) {

		this.creator = creator;
		this.resizer = resizer;

		this.setMaps(null);
	}

	hasSize() {
		return this.size !== null;
	}

	getSize(ratio = 1) {
		if (this.size === null)
			this.throwSizeError();
		return {
			x: this.size.x * ratio,
			y: this.size.y * ratio
		};
	}

	abstract getMaps(size?: Vertex2): T;

	sizeMaps(size: Vertex2) {
		if (this.size === null) {
			this.setMaps(this.creator(size));
		} else {
			if (this.size.x === size.x &&
				this.size.y === size.y)
				return;
			this.setMaps(this.resizer(size, this.maps));
		}
		this.size = size;
	}



	protected setMaps(maps: T | null) {
		if (maps === null) {
			this.maps === new Proxy({}, { get: this.throwSizeError });
		} else {
			this.maps = new Proxy(maps, { get: this.getMap.bind(this) });
		}
	}

	private getMap(maps: T, mapName: string) {
		if (!maps.hasOwnProperty(mapName)) {
			throw Error(`Can't get (${mapName}) map in DrawTarget`);
		}
		return maps[mapName];
	}

	protected throwSizeError(): never {
		throw Error("Could not use drawing layer, size has not been set");
	}
}
