import { getP5DrawTarget } from "../layers/p5Layers";
import { getTime } from "../time";
import { Vector2 } from "../vector/vector2";
import { PathfinderAbstract } from "./pathfinderAbstract";
import { PathSituation } from "./PathSituationType";

export class PathAgent {
	private readonly pathfinder: PathfinderAbstract;
	readonly id = Symbol();

	readonly radius: number;
	position: Vector2 | null = null;
	direction: Vector2 | false = false;
	newGoal: boolean = true;
	leadership: number;

	processingSituation: PathSituation<unknown> | null = null;
	tryedPartCompute = false;

	pathCost = 0;
	pathGarbage = 0;
	path: Vector2[] = [];

	waitingNodeComfirmation = 0;
	computeStart = true;
	computeEnd = true;
	pathFailTime = 0;

	constructor(pathfinder: PathfinderAbstract, radius: number, leadership: number = Math.random()) {
		this.pathfinder = pathfinder;
		this.radius = radius;
		this.leadership = leadership;
	}

	drawPath(thickness = 0.2, fillColor = "red", d = getP5DrawTarget("defaultP5")) {
		const g = d.getMaps().canvas;
		if (this.position === null)
			return;

		g.push();

		g.noStroke();
		g.fill(fillColor);

		// add current position to path, only for drawing
		this.path.unshift(this.position);

		for (let i = 0; i < this.path.length; i++) {
			const node = this.path[i].copy().multScalar(this.pathfinder.scale);

			g.circle(node.x, node.y, thickness);

			if (i >= this.path.length - 1)
				continue;

			const nextNode = this.path[i + 1].copy().multScalar(this.pathfinder.scale);

			const offsetForward = nextNode.copy().sub(node).norm(thickness / 2);
			const offsetA = offsetForward.copy().rotate(-HALF_PI);
			const offsetB = offsetForward.copy().rotate(HALF_PI);

			// draw arrow from one path point to another
			g.triangle(
				node.x + offsetA.x, node.y + offsetA.y,
				nextNode.x, nextNode.y,
				node.x + offsetB.x, node.y + offsetB.y
			);
		}

		// remove current position from path, it was only there for drawing
		this.path.shift();

		g.pop();
	}

	getDirection(position?: Vector2) {
		if (position &&
			(this.position === null || !this.position.equal(position))) {
			const newPosition = position.copy().divScalar(this.pathfinder.scale);

			if (!this.pathfinder.validatePosition(newPosition)) {
				this.position = null;
				return false;
			}
			this.position = newPosition;
		} else {
			if (this.direction)
				return this.direction;
		}

		if (this.position === null)
			return false;

		while (this.path.length > 0) {
			// remove path node if too close
			if (this.position.dist(this.path[0]) < this.pathfinder.pathMinDist) {
				const pathNode = (this.path.shift() as Vector2).floor();
				this.pathfinder.setPheromones(pathNode);
			} else {
				// compute start of path if path node is too far
				if (this.position.dist(this.path[0]) > this.pathfinder.pathMaxDist) {
					if (this.processingSituation) {
						this.tryedPartCompute = false;
						this.processingSituation = null;
					}
					this.computeStart = true;
				}
				break;
			}
		}

		// without path return if goal is reached
		if (this.path.length === 0 || this.computeStart) {
			if (this.pathfinder.goal === null)
				return false;

			const goalDistance = this.position.dist(this.pathfinder.goal);
			const atGoal = goalDistance < this.pathfinder.pathMinDist * 2;

			if (atGoal) {
				this.setPath([]);
			} else {
				if (this.path.length === 0) {
					this.computeWhole = true;
				}
			}

			return atGoal;
		}

		// return direction to next node in path
		this.direction = this.path[0].copy()
			.multScalar(this.pathfinder.scale)
			.sub(this.position.copy().multScalar(this.pathfinder.scale));

		if (this.newGoal) {
			if (this.direction.mag < this.pathfinder.pathMinDist * 3 && random() < 0.2) {
				if (this.processingSituation) {
					this.tryedPartCompute = false;
					this.processingSituation = null;
				}
				this.computeEnd = true;
				this.newGoal = false;
			}
		}

		return this.direction;
	}

	reset() {
		this.setPath([]);

		this.tryedPartCompute = false;
		this.processingSituation = null;
		this.computeStart = true;
		this.computeEnd = true;
		this.pathFailTime = getTime();
	}

	setPath(path: Vector2[], cost = 0) {
		this.pathCost = cost;
		this.pathGarbage = 0;
		this.path = path;
	}

	set computeWhole(value) {
		this.computeStart = value;
		this.computeEnd = value;
	}

	get computeWhole() {
		return this.computeStart && this.computeEnd;
	}
}
