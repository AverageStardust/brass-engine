import { getExactTime } from "../time";
import { PathfinderAbstract } from "./pathfinderAbstract";

export const pathfinders: PathfinderAbstract[] = [];
let waitingPathfinder = 0;
const pathfinderUpdateTime = 3;



export function update() {
	const endTime = getExactTime() + pathfinderUpdateTime;

	//try to update all pathfinder before endTime and restart at where we leave off next time
	const lastPathfinderIndex = waitingPathfinder + pathfinders.length;
	for (let _i = waitingPathfinder; _i < lastPathfinderIndex; _i++) {
		const i = _i % pathfinders.length;
		waitingPathfinder = (_i + 1) % pathfinders.length;

		pathfinders[i].update(endTime);

		if (getExactTime() > endTime)
			return;
	}
}

export function registerPathfinder(pathfinder: PathfinderAbstract) {
	pathfinders.push(pathfinder);
}