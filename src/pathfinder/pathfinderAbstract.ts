/**
 * A* pathfinding over tilemaps. 
 * Optimized for hoards of enemies going to the same location, for example the player.
 * @module
 */

import { expect } from "../common";
import { getExactTime, getTime } from "../time";
import { Vector2, Vertex2 } from "../vector/vector2";
import { PathAgent } from "./pathAgent";
import { registerPathfinder } from "./pathfinder";
import { PathSituation, PathSituationType } from "./PathSituationType";




export type ComputePathArgs = [PathSituation<unknown>] | [Vector2, Vector2, number];

export interface PathfinderAbstractOptions {
	width: number;
	height: number;
	scale?: number;

	faliureDelay?: number;
	pathingRuntimeLimit?: number;
	pathingContinuousRuntimeLimit?: number;
	pathGarbageLimit?: number;
	targetDriftLimit?: number;
	targetDriftInfluence?: number;
	nodeComfirmationRate?: number;
	pheromones?: boolean;
	pheromoneDecayTime?: number;
	pheromoneStrength?: number;
	pathMinDist?: number;
	pathMaxDist?: number;
}



// class that finds paths for a group of agents to one goal
// this pathfinding system is optimized for groups with one collective goal
export abstract class PathfinderAbstract {

	protected readonly width: number;
	protected readonly height: number;
	readonly scale: number;

	protected readonly faliureDelay: number;
	protected readonly pathingRuntimeLimit: number;
	protected readonly pathingContinuousRuntimeLimit: number;
	protected readonly pathGarbageLimit: number;
	protected readonly targetDriftLimit: number;
	protected readonly targetDriftInfluence: number;
	protected readonly nodeComfirmationRate: number;
	protected readonly pheromoneDecayTime: number;
	protected readonly pheromoneStrength: number;
	readonly pathMinDist: number;
	readonly pathMaxDist: number;

	protected pheromoneTime: number;
	protected readonly pheromones: Int32Array | null;

	goal: null | Vector2;
	// confidence controls if only leaders or the whole hard tries to make paths
	// when the pathfinder is struggling this causes a few leaders to try harder and show others the way 
	protected confidence = 0.5;
	protected agents: PathAgent[];
	protected waitingAgent: number;


	constructor(options: PathfinderAbstractOptions) {
		this.width = options.width;
		this.height = options.height;
		this.scale = options.scale ?? 1;

		this.faliureDelay = options.faliureDelay ?? 300;
		this.pathingRuntimeLimit = options.pathingRuntimeLimit ?? 20000;
		this.pathingContinuousRuntimeLimit = options.pathingContinuousRuntimeLimit ?? 2000;
		this.pathGarbageLimit = options.pathGarbageLimit ?? 0.15;
		this.targetDriftLimit = options.targetDriftLimit ?? 2;
		this.targetDriftInfluence = options.targetDriftInfluence ?? 0.12;
		this.nodeComfirmationRate = options.nodeComfirmationRate ?? 10;
		this.pheromoneDecayTime = options.pheromoneDecayTime ?? 150000;
		this.pheromoneStrength = options.pheromoneStrength ?? 0.5;
		this.pathMinDist = options.pathMinDist ?? 0.1;
		this.pathMaxDist = options.pathMaxDist ?? 0.1;

		// pheromones make agents follow each other to find the same goal
		this.pheromoneTime = getTime();
		if (options.pheromones !== false) {
			const zeroPheromone = this.pheromoneTime - this.pheromoneDecayTime;
			this.pheromones = new Int32Array(this.width * this.height).fill(zeroPheromone);
		} else {
			this.pheromones = null;
		}

		this.goal = null;
		this.agents = [];
		this.waitingAgent = 0;

		registerPathfinder(this);
	}

	createAgent(radius: number, leadership?: number) {
		radius /= this.scale;
		const agent = new PathAgent(this, radius, leadership);
		this.agents.push(agent);
		return agent;
	}

	removeAgent(agent: PathAgent) {
		const index = this.agents.findIndex(({ id }) => id === agent.id);
		if (this.waitingAgent > index) this.waitingAgent--;
		this.agents.splice(index, 1);
	}

	setGoal(goal: Vector2) {
		if (goal === null) {
			this.goal = null;
			return false;
		}

		const newGoal = goal.copy().divScalar(this.scale);

		if (!this.validatePosition(newGoal)) {
			this.goal = null;
			return false;
		}
		this.goal = newGoal;

		// check all agents that are on route
		// if their new goal is far from their current goal, compute it again
		for (const agent of this.agents) {
			if (agent.path.length <= 0) continue;

			const lastNode = agent.path[agent.path.length - 1];
			if (lastNode.dist(this.goal) < this.pathMaxDist) continue;

			agent.newGoal = true;
		}

		return true;
	}

	confidenceDelta(delta: number) {
		// due to good or bad results change the confidence of the group
		this.confidence = Math.min(Math.max(this.confidence + delta, 0), 1);
	}

	update(endTime: number) {
		if (this.goal === null) return;

		if (this.confidence < 0.2) {
			this.confidenceDelta(0.01);
		}

		this.pheromoneTime = getTime();
		const skipFailuresAfter = getTime() - this.faliureDelay;
		const maxLeadership = Math.max(...this.agents.map((agents) => agents.leadership));
		const effectiveConfidence = Math.max(this.confidence, 1.01 - maxLeadership);

		// try to compute all agents before endTime and restart at where we leave off next time
		const lastAgentIndex = this.waitingAgent + this.agents.length;
		for (let _i = this.waitingAgent;
			_i < lastAgentIndex;
			_i++) {
			const i = _i % this.agents.length;
			this.waitingAgent = (_i + 1) % this.agents.length;

			const agent = this.agents[i];

			// skip if failed recently
			if (agent.pathFailTime > skipFailuresAfter) {
				continue;
			}

			// try to check already existing path for blocks
			if (agent.path.length > 0) this.confirmAgentNodes(agent);

			// skip if no computation is needed
			if (!(agent.computeStart || agent.computeEnd)) {
				this.confidenceDelta(0.001);
				continue;
			}

			// skip if no starting position
			if (agent.position === null) continue;

			// give up if low-confidence follower
			// lol
			if (agent.leadership < 1 - effectiveConfidence) {
				agent.reset();
				continue;
			}

			processing: {
				if (agent.processingSituation !== null) {
					const targetDrift = agent.processingSituation.start.dist(agent.position) +
						agent.processingSituation.end.dist(this.goal);

					agent.processingSituation.maxRuntime = Math.ceil(
						agent.processingSituation.maxRuntime / (1 + targetDrift * this.targetDriftInfluence)
					);

					// continue processing
					const situation = this.computePath(agent.processingSituation);
					if (situation.type === PathSituationType.Processing) break processing;
					// done processing
					if (situation.type === PathSituationType.Failed) {
						// failed
						if (targetDrift > this.targetDriftLimit) {
							// to much drift, no-fault restart
							agent.processingSituation = null;
							agent.tryedPartCompute = false;
						} else if (agent.tryedPartCompute) {
							// failed partial and whole, reset and wait
							agent.reset();
						} else {
							// failed only partial, record and start whole next time
							agent.processingSituation = null;
							agent.tryedPartCompute = true;
						}
						break processing;
					} else {
						// succeed
						if (agent.tryedPartCompute) {
							this.afterAgentComputeWhole(agent, situation);
						} else {
							this.afterAgentComputePart(agent, situation);
						}
						agent.tryedPartCompute = false;
					}
				} else {
					// if possible only compute part
					let continueToWhole = true;

					if (agent.path.length > 0 && !agent.tryedPartCompute) {
						const situation = this.attemptAgentPartCompute(agent);
						if (situation !== undefined) {
							this.afterAgentComputePart(agent, situation);
							break processing;
						}
						if (agent.processingSituation !== null) {
							break processing;
						}
					}

					const situation = this.attemptAgentWholeCompute(agent);
					if (situation !== undefined) {
						this.afterAgentComputeWhole(agent, situation);
					}
				}
			}

			if (getExactTime() > endTime) return;
		}
	}

	protected confirmAgentNodes(agent: PathAgent) {
		const nodesToComfirm = Math.min(agent.path.length, this.nodeComfirmationRate);

		for (let i = 0; i < nodesToComfirm; i++) {
			if (agent.waitingNodeComfirmation >= agent.path.length) {
				agent.waitingNodeComfirmation = 0;
			}

			const node = agent.path[agent.waitingNodeComfirmation];
			let radius = agent.radius;

			if (agent.waitingNodeComfirmation === agent.path.length - 1) {
				// goal node might be into corner
				radius = 0;
			}
			if (!this.confirmNode(node, radius)) {
				agent.reset();
				break;
			}

			agent.waitingNodeComfirmation++;
		}
	}

	protected attemptAgentPartCompute(agent: PathAgent) {
		expect(this.goal !== null);
		expect(agent.position !== null);

		// garbage is from computing parts of the path outside of the whole path context
		// don't compute part if there will be too much garbage
		let minGarbage = 0;
		const garbageLimit = agent.pathCost * this.pathGarbageLimit;
		if (agent.computeStart) {
			minGarbage += agent.position.dist(agent.path[0]) * 100;
		}
		if (agent.computeEnd) {
			minGarbage += agent.path[agent.path.length - 1].dist(this.goal) * 100;
		}

		if (agent.pathGarbage + minGarbage > garbageLimit) return;

		// compute path
		let pathSituation: PathSituation<unknown>;
		const runtimeLimit = Math.ceil(this.pathingRuntimeLimit * this.pathGarbageLimit);
		if (agent.computeStart) {
			pathSituation = this.computePath(agent.position, agent.path[0], runtimeLimit);
		} else {
			pathSituation = this.computePath(agent.path[agent.path.length - 1], this.goal, runtimeLimit);
		}

		if (pathSituation.type === PathSituationType.Processing) {
			agent.processingSituation = pathSituation;
			return;
		} else if (pathSituation.type === PathSituationType.Failed) {
			return;
		}

		return pathSituation;
	}

	protected afterAgentComputePart(agent: PathAgent, pathSituation: PathSituation<unknown>) {
		const garbageLimit = agent.pathCost * this.pathGarbageLimit;
		const partCost = pathSituation.cost as number;

		// throw away path if real path has too much garbage
		if (agent.pathGarbage + partCost > garbageLimit) return;

		// finish path
		const pathPart = this.spaceOutPath(pathSituation.path as Vertex2[]);
		if (agent.computeStart) {
			agent.path = pathPart.concat(agent.path);
			agent.computeStart = false;
		} else {
			agent.path = agent.path.concat(pathPart);
			agent.computeEnd = false;
		}
		agent.pathGarbage += partCost;
	}

	protected attemptAgentWholeCompute(agent: PathAgent) {
		expect(this.goal !== null);
		expect(agent.position !== null);

		const pathSituation = this.computePath(agent.position, this.goal, this.pathingRuntimeLimit);

		if (pathSituation.type === PathSituationType.Processing) {
			agent.processingSituation = pathSituation;
			return;
		} else if (pathSituation.type === PathSituationType.Failed) {
			return;
		}

		return pathSituation;
	}

	protected afterAgentComputeWhole(agent: PathAgent, pathSituation: PathSituation<unknown>) {
		const path = this.spaceOutPath(pathSituation.path as Vertex2[]);
		agent.setPath(path, pathSituation.cost);
		agent.computeWhole = false;
	}

	protected spaceOutPath(_path: Vertex2[]) {
		const path = _path.map(Vector2.fromObjFast);
		const newPath = [];

		for (let i = 0; i < path.length - 1; i++) {
			const nodeDistance = path[i].dist(path[i + 1]);

			newPath.push(path[i]);

			// if between nodes are needed
			if (nodeDistance > 1.01) {

				// space out between nodes evenly by interpolating node i and node i+1
				const interNodeCount = Math.floor(nodeDistance / 1);
				const firstInterNode = (nodeDistance - interNodeCount) / nodeDistance / 2;
				const interDistance = 1 / nodeDistance;

				for (let interProgress = firstInterNode;
					interProgress < 1;
					interProgress += interDistance) {

					const interNode = path[i].copy().mix(path[i + 1], interProgress);
					newPath.push(interNode);
				}
			}
		}

		newPath.push(path[path.length - 1]);

		return newPath;
	}

	protected abstract computePath(...args: ComputePathArgs): PathSituation<unknown>

	protected parseComputePathArgs(args: ComputePathArgs): PathSituation<unknown> {
		if (args.length === 1) {
			return args[0];
		} else {
			return {
				start: args[0],
				end: args[1],
				maxRuntime: args[2],
				runtime: 0,
				type: PathSituationType.Inital
			}
		}
	}

	protected abstract confirmNode(node: Vector2, radius: number): boolean;

	protected getPheromones({ x, y }: Vertex2) {
		if (this.pheromones === null) return 1;

		const pheromoneTime = this.pheromones[x + y * this.width];
		const pheromoneAge = this.pheromoneTime - pheromoneTime;
		const pheromoneLeft = (this.pheromoneDecayTime - pheromoneAge) / this.pheromoneDecayTime;

		return Math.max(0, 1 - pheromoneLeft * pheromoneLeft * this.pheromoneStrength);
	}

	setPheromones({ x, y }: Vertex2) {
		if (this.pheromones === null) return;

		this.pheromones[x + y * this.width] = this.pheromoneTime;
	}

	validatePosition(position: Vertex2) {
		return position.x >= 0 && position.y >= 0 &&
			position.x < this.width && position.y < this.height;
	}
}