import { MappedHeap, Opaque } from "../common";
import { TilemapAbstract } from "../tilemap/tilemapAbstract";
import { Vector2, Vertex2 } from "../vector/vector2";
import { PathfinderAbstract, PathfinderAbstractOptions, ComputePathArgs } from "./pathfinderAbstract";
import { PathSituation, PathSituationType } from "./PathSituationType";



export type NodePrimative = Opaque<number, "NodePrimitive">;

interface AStarState {
	gCosts: Map<NodePrimative, number>;
	fCosts: Map<NodePrimative, number>;
	sources: Map<NodePrimative, NodePrimative | null>;
	open: MappedHeap<NodePrimative>;
}



export class AStarPathfinder extends PathfinderAbstract {
	tilemap: TilemapAbstract;

	constructor(tilemap: TilemapAbstract, _options: Omit<PathfinderAbstractOptions, "width" | "height"> = {}) {
		const options  = _options as PathfinderAbstractOptions;
		options.width = tilemap.width;
		options.height = tilemap.height;
		
		options.scale = tilemap.tileSize;

		super(options);

		this.tilemap = tilemap;
	}

	createAgent(radius: number, leadership?: number) {
		if (radius > 0.5 * this.scale) {
			throw Error("AStarPathfinder can't handle agents wider than one tilemap cell");
		}

		return super.createAgent(radius, leadership);
	}

	protected computePath(...args: ComputePathArgs) {
		let situation = this.parseComputePathArgs(args) as PathSituation<AStarState>;
		// convert world coords to tile coords and run A*
		situation = this.computeAStar(situation);

		if (situation.type === PathSituationType.Succeed) {
			// convert tile coords to world coords
			// {x: 4, y: 2} => {x: 4.5, y: 2.5}
			situation.path = (situation.path as Vertex2[]).map(obj => ({ x: obj.x + 0.5, y: obj.y + 0.5 }));

			// add path to start and end tile
			situation.path.unshift(situation.start.copy());
			situation.path.push(situation.end.copy());
		}

		return situation;
	}

	private computeAStar(situation: PathSituation<AStarState>): PathSituation<AStarState> {
		if (situation.type === PathSituationType.Inital) {
			if (this.tilemap.getSolid(situation.start.x, situation.start.y) ||
				this.tilemap.getSolid(situation.end.x, situation.end.y)) {
				// path is not possible, start or end is blocked
				situation.type = PathSituationType.Failed;
				return situation;
			}

			situation.type = PathSituationType.Processing;
			situation.state = {
				gCosts: new Map<NodePrimative, number>(),
				fCosts: new Map<NodePrimative, number>(),
				sources: new Map<NodePrimative, NodePrimative | null>(),
				open: new MappedHeap<NodePrimative>([], (a, b) => ((situation.state as AStarState).fCosts.get(a) as number) <
					((situation.state as AStarState).fCosts.get(b) as number))
			};

		}

		const
			start = situation.start.copy().floor(), end = situation.end.copy().floor();
		const
			startPrimative = this.primitivizePosition(start), endPrimative = this.primitivizePosition(end);
		const
			{
				gCosts, fCosts, sources, open
			} = situation.state as AStarState;

		gCosts.set(startPrimative, 0);
		fCosts.set(startPrimative, this.heuristic(start, end));
		sources.set(startPrimative, null);

		open.insert(startPrimative);

		const initalRunTime = situation.runtime;
		while (open.size > 0) {
			if (situation.runtime >= situation.maxRuntime) {
				// could not find path fast enough
				situation.type = PathSituationType.Failed;
				this.confidenceDelta(-0.05);
				return situation;
			} else if (situation.runtime - initalRunTime >= this.pathingContinuousRuntimeLimit) {
				this.confidenceDelta(-0.01);
				return situation;
			}
			situation.runtime++;

			const currentPrimative = open.remove() as NodePrimative;
			const current = this.deprimitivizePosition(currentPrimative);

			if (currentPrimative === endPrimative) {
				return this.reconstructPath(situation, currentPrimative, gCosts, sources);
			}

			const currectGCost = gCosts.get(currentPrimative) as number;
			const neighbors = this.computeNeighbors(current);
			for (const { position, dCost } of neighbors) {
				const positionPrimative = this.primitivizePosition(position);

				const newGCost = currectGCost + Math.round(dCost * this.getPheromones(position));
				const oldGCost = gCosts.get(positionPrimative);
				if (oldGCost === undefined || newGCost < oldGCost) {
					sources.set(positionPrimative, currentPrimative);
					gCosts.set(positionPrimative, newGCost);
					fCosts.set(positionPrimative, newGCost +
						this.heuristic(position, end));

					// this will remove and reinsert the neighbor if it is already in the heap
					open.insert(positionPrimative);
				}
			}
		}

		// no open nodes and no path was not found
		situation.type = PathSituationType.Failed;
		return situation;
	}

	private computeNeighbors({ x, y }: Vertex2) {
		const neighbors: { position: Vertex2, dCost: number }[] = [];

		const left = this.tilemap.getSolid(x - 1, y) === false;
		const right = this.tilemap.getSolid(x + 1, y) === false;
		const up = this.tilemap.getSolid(x, y - 1) === false;
		const down = this.tilemap.getSolid(x, y + 1) === false;

		if (left) {
			neighbors.push({
				position: { x: x - 1, y },
				dCost: 100
			});
		}
		if (right) {
			neighbors.push({
				position: { x: x + 1, y },
				dCost: 100
			});
		}
		if (up) {
			neighbors.push({
				position: { x, y: y - 1 },
				dCost: 100
			});

			if (left && this.tilemap.getSolid(x - 1, y - 1) === false) {
				neighbors.push({
					position: { x: x - 1, y: y - 1 },
					dCost: 141
				});
			}
			if (right && this.tilemap.getSolid(x + 1, y - 1) === false) {
				neighbors.push({
					position: { x: x + 1, y: y - 1 },
					dCost: 141
				});
			}
		}
		if (down) {
			neighbors.push({
				position: { x, y: y + 1 },
				dCost: 100
			});

			if (left && this.tilemap.getSolid(x - 1, y + 1) === false) {
				neighbors.push({
					position: { x: x - 1, y: y + 1 },
					dCost: 141
				});
			}
			if (right && this.tilemap.getSolid(x + 1, y + 1) === false) {
				neighbors.push({
					position: { x: x + 1, y: y + 1 },
					dCost: 141
				});
			}
		}

		return neighbors;
	}

	private reconstructPath(situation: PathSituation<AStarState>, originPrimative: NodePrimative, gCosts: Map<NodePrimative, number>, sources: Map<NodePrimative, NodePrimative | null>) {
		const path: { x: number, y: number }[] = [];
		const cost = gCosts.get(originPrimative) as number;

		let nodePrimative: NodePrimative | null = originPrimative;
		while (nodePrimative !== null) {
			path.push(this.deprimitivizePosition(nodePrimative));
			nodePrimative = sources.get(nodePrimative) as (NodePrimative | null);
		}
		path.reverse();

		situation.type = PathSituationType.Succeed;
		situation.path = path;
		situation.cost = cost;
		return situation;
	}

	private primitivizePosition({ x, y }: Vertex2) {
		return x + this.tilemap.width * y as NodePrimative;
	}

	private deprimitivizePosition(prim: NodePrimative) {
		return {
			x: prim % this.tilemap.width,
			y: Math.floor(prim / this.tilemap.width)
		};
	}

	private heuristic(start: Vertex2, end: Vertex2) {
		return Math.round(Math.hypot(end.x - start.x, end.y - start.y) * 100);
	}

	protected confirmNode(node: Vector2, radius: number) {
		const minX = Math.floor(node.x - radius), maxX = Math.ceil(node.x + radius), minY = Math.floor(node.y - radius), maxY = Math.ceil(node.y + radius);

		for (let x = minX; x < maxX; x++) {
			for (let y = minY; y < maxY; y++) {
				if (this.tilemap.getSolid(Math.floor(x), Math.floor(y))) {
					return false;
				}
			}
		}

		return true;
	}
}
