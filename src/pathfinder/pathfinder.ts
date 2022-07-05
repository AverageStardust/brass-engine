import { getExactTime } from "../core/time";
import { getPathfinders } from "./pathfinderAbstract";

const pathfinderUpdateTime = 3;
let waitingPathfinder = 0;



export function update() {
	const endTime = getExactTime() + pathfinderUpdateTime;

	const pathfinders = getPathfinders();

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