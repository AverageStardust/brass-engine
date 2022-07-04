import { Vector2, Vertex2 } from "../vector/vector2";


export enum PathSituationType {
	Inital,
	Processing,
	Failed,
	Succeed
}
// state of one agent's pathfinding goals
// allows async pathfinding
// T changes for different algorithms internal state

export type PathSituation<T> = {
	start: Vector2;
	end: Vector2;
	maxRuntime: number;
	runtime: number;
	type: PathSituationType;
	state?: T;
	path?: Vertex2[];
	cost?: number;
};
