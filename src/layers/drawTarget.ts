import { getSketch } from "../core/sketch";
import { Vertex2 } from "../vector/vector2";
import { honorReglRefresh } from "./handleRegl";
import { LayerAbstract } from "./LayerAbstract";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const drawTargets: Map<string, DrawTarget<any>> = new Map();
let globalWidth: number, globalHeight: number;



export function resize(_width = window.innerWidth, _height = window.innerHeight) {
	globalWidth = _width;
	globalHeight = _height;
	getDrawTarget("default").refresh();
	syncDefaultDrawTargetWithSketch();
	honorReglRefresh();
}

export function syncDefaultDrawTargetWithSketch() {
	const { x, y } = getDrawTarget("default").getSize();
	const sketch = getSketch();
	sketch.width = x;
	sketch.height = y;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setDrawTarget(name: string, drawTarget: DrawTarget<any>) {
	if (hasDrawTarget(name)) {
		throw Error(`Can't overwrite (${name}) DrawTarget`);
	}
	drawTargets.set(name, drawTarget);
}

export function getDrawTarget(name: string) {
	const drawTarget = drawTargets.get(name);
	if (drawTarget === undefined) {
		throw Error(`Could not find (${name}) DrawTarget; Maybe create one or run Brass.init() with drawTarget enabled`);
	}
	return drawTarget;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDrawTargetOf<T>(name: string, classConstructor: new (...args: any[]) => T): T {
	const drawTarget = getDrawTarget(name);
	if (!(drawTarget instanceof classConstructor)) {
		throw Error(`Could not find (${name}) P5DrawTarget; DrawTarget under that name is not of subclass P5DrawTarget`);
	}
	return drawTarget;
}

export const hasDrawTarget = drawTargets.has.bind(drawTargets);



export class DrawTarget<T extends { [key: string]: unknown }> extends LayerAbstract<T> {
	protected size: Vertex2 | null = null;
	private sizer: (self: DrawTarget<T>) => Vertex2;

	constructor(
		creator: (size: Vertex2) => T,
		resizer: (size: Vertex2, oldMaps: T) => T = creator,
		sizer?: (self: DrawTarget<T>) => Vertex2) {
		super(creator, resizer);

		this.sizer = sizer ?? this.defaultSizer;
	}

	setSizer(sizer: (self: DrawTarget<T>) => Vertex2) {
		this.sizer = sizer;
		this.ensureSize();
		this.refresh();
	}

	getMaps() {
		this.ensureSize();
		return this.maps;
	}

	ensureSize() {
		if (this.size === null) {
			this.size = this.getSizerResult();
			this.setMaps(this.creator(this.size));
		}
	}

	refresh(causes: symbol[] = []) {
		const size = this.getSizerResult();
		if (this.size !== null && this.size.x === size.x && this.size.y === size.y)
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

	private defaultSizer<T extends { [key: string]: unknown }>(self: DrawTarget<T>) {
		if (!hasDrawTarget("default")) {
			throw Error("Can't use draw target, run Brass.init() first");
		}
		if (self.hasName("default")) {
			return {
				x: globalWidth,
				y: globalHeight
			};
		}
		return getDrawTarget("default").getSize();
	}
}