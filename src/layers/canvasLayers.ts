import { Vertex2 } from "../vector/vector2";
import { refreshReglFast } from "./handleRegl";
import { DrawTarget, getDrawTarget } from "./drawTarget";



export function getCanvasDrawTarget(name: string): CanvasDrawTarget {
	const drawTarget = getDrawTarget(name);
	if (!(drawTarget instanceof CanvasDrawTarget)) {
		throw Error(`Could not find (${name}) CanvasDrawTarget; DrawTarget under that name is not of subclass CanvasDrawTarget`);
	}
	return drawTarget;
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
