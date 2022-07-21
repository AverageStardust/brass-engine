import { Vertex2 } from "../vector/vector2";
import { refreshReglFast } from "./handleRegl";
import { DrawTarget, getDrawTargetOf } from "./drawTarget";



export function getDefaultCanvasDrawTarget() {
	return getDrawTargetOf("defaultCanvas", CanvasDrawTarget);
}



export class CanvasDrawTarget extends DrawTarget<{ canvas: HTMLCanvasElement; }> {
	constructor(sizer?: (self: CanvasDrawTarget) => Vertex2) {
		super(
			({ x, y }) => {
				const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
				canvas.width = x;
				canvas.height = y;
				return { canvas };
			},
			({ x, y }, { canvas }) => {
				canvas.width = x;
				canvas.height = y;
				refreshReglFast();
				return { canvas };
			},
			sizer
		);
	}
}
