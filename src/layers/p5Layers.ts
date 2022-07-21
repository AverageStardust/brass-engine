import p5 from "p5";
import { createFastGraphics } from "../common/fastGraphics";
import { Vertex2 } from "../vector/vector2";
import { DrawBuffer } from "./drawBuffer";
import { DrawTarget, getDrawTargetOf } from "./drawTarget";
import { LayerAbstract } from "./LayerAbstract";



// these would both have canvas properties anyway, for some reason they were not in the typing
export type P5LayerMap = p5.Graphics | p5;
export type P5Layer = LayerAbstract<{ canvas: P5LayerMap }>;



export function getDefaultP5DrawTarget() {
	return getDrawTargetOf("defaultP5", P5DrawTarget);
}


export class P5DrawBuffer extends DrawBuffer<{ canvas: P5LayerMap }> {
	constructor(arg: p5.RENDERER | P5LayerMap = P2D) {
		super(
			({ x, y }) => {
				if (typeof arg === "string") {
					return { canvas: createFastGraphics(x, y, arg) };
				} else {
					if (arg.width !== x || arg.height !== y) {
						arg.resizeCanvas(x, y, true);
					}
					return { canvas: arg };
				}
			},
			({ x, y }, { canvas }) => {
				canvas.resizeCanvas(x, y, true);
				return { canvas };
			}
		);
	}
}

export class P5DrawTarget extends DrawTarget<{ canvas: P5LayerMap; }> {
	constructor(sizer?: (self: P5DrawTarget) => Vertex2,
		arg: p5.RENDERER | P5LayerMap = P2D) {
		super(
			({ x, y }) => {
				if (typeof arg === "string") {
					return { canvas: createFastGraphics(x, y, arg) };
				} else {
					if (arg.width !== x || arg.height !== y) {
						arg.resizeCanvas(x, y, true);
					}
					return { canvas: arg };
				}
			},
			({ x, y }, { canvas }) => {
				canvas.resizeCanvas(x, y, true);
				return { canvas };
			},
			sizer
		);
	}
}
