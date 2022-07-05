import { Vertex2 } from "../vector/vector2";
import { LayerAbstract } from "./LayerAbstract";



const drawTargets: Map<string, DrawTarget<any>> = new Map();



export function setDrawTarget(name: string, drawTarget: DrawTarget<any>) {
	if (hasDrawTarget(name)) {
		throw Error(`Can't overwrite (${name}) DrawTarget`);
	}
	drawTargets.set(name, drawTarget);
}

export function getDrawTarget(name: string): DrawTarget<any> {
	const drawTarget = drawTargets.get(name);
	if (drawTarget === undefined) {
		throw Error(`Could not find (${name}) DrawTarget; Maybe create one or run Brass.init() with drawTarget enabled`);
	}
	return drawTarget;
}

export const hasDrawTarget = drawTargets.has.bind(drawTargets);



export class DrawTarget<T> extends LayerAbstract<T> {
	protected size: Vertex2;
	private sizer: (self: DrawTarget<T>) => Vertex2;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator,
		sizer?: (self: DrawTarget<T>) => Vertex2) {
		super(creator, resizer);

		this.sizer = sizer ?? this.defaultSizer;
		this.size = this.getSizerResult();
		this.setMaps(this.creator(this.size));
	}

	setSizer(sizer: (self: DrawTarget<T>) => Vertex2) {
		this.sizer = sizer;
		this.refresh();
	}

	getMaps() {
		return this.maps;
	}

	refresh(causes: Symbol[] = []) {
		const size = this.getSizerResult();
		if (this.size !== undefined && this.size.x === size.x && this.size.y === size.y)
			return;

		for (const cause of causes) {
			if (cause !== this.id)
				continue;
			throw Error("Resize of DrawTarget caused itself to resize; Loop in sizer dependency chain");
		}

		this.sizeMaps(size);

		for (const drawTarget of drawTargets.values()) {
			if (drawTarget.id === this.id)
				continue;
			drawTarget.refresh(causes.concat(this.id));
		}
	}

	hasName(name: string) {
		if (!hasDrawTarget(name))
			return false;
		return getDrawTarget(name).id === this.id;
	}

	private getSizerResult(): Vertex2 {
		const floatSize = this.sizer(this);
		return {
			x: Math.floor(floatSize.x),
			y: Math.floor(floatSize.y)
		};
	}

	private defaultSizer(self: DrawTarget<any>) {
		if (self.hasName("default")) {
			return this.size;
		}
		return getDrawTarget("default").getSize();
	}
}