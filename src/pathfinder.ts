import { expect, MappedHeap, Opaque } from "./common";
import { defaultDrawTarget } from "./drawTarget";
import { Tilemap } from "./tilemap";
import { getExactTime, getTime } from "./time";
import { Vector2, Vertex2 } from "./vector3";



interface PathfinderOptions {
    width?: number;
    height?: number;
    scale?: number;

    faliureDelay?: number;
    pathingRuntimeLimit?: number;
    pathingContinuousRuntimeLimit?: number;
    pathGarbageLimit?: number;
    targetDriftLimit?: number;
    targetDriftInfluence?: number;
    nodeComfirmationRate?: number;
    pheromones?: boolean;
    pheromoneStrength?: number;
    pheromoneDecayTime?: number;
}

enum PathSituationType {
    Inital,
    Processing,
    Failed,
    Succeed
}

// state of one agent's pathfinding goals
// allows async pathfinding
// T changes for different algorithms internal state
type PathSituation<T> = {
    start: Vector2;
    end: Vector2;
    maxRuntime: number;
    runtime: number;
    type: PathSituationType;
    state?: T;
    path?: Vertex2[];
    cost?: number
};

type ComputePathArgs = [PathSituation<unknown>] | [Vector2, Vector2, number];

interface SizedPathfinderOptions extends PathfinderOptions {
    width: number;
    height: number;
}

type NodePrimative = Opaque<number, "NodePrimative">;



const pathfinders: PathfinderAbstract[] = [];
let waitingPathfinder = 0;
const pathfinderUpdateTime = 3;
const pathfinderMinDist = 0.1;
const pathfinderMaxDist = 2;



export function update() {
    const endTime = getExactTime() + pathfinderUpdateTime;

    //try to update all pathfinder before endTime and restart at where we leave off next time
    const lastPathfinderIndex = waitingPathfinder + pathfinders.length;
    for (let _i = waitingPathfinder;
        _i < lastPathfinderIndex;
        _i++) {
        const i = _i % pathfinders.length;
        waitingPathfinder = (_i + 1) % pathfinders.length;

        pathfinders[i].update(endTime);

        if (getExactTime() > endTime) return;
    }
}



// class that finds paths for a group of agents to one goal
// this pathfinding system is optimized for groups with one collective goal
abstract class PathfinderAbstract {

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

    protected pheromoneTime: number;
    protected readonly pheromones: Int32Array | null;

    goal: null | Vector2;
    // confidence controls if only leaders or the whole hard tries to make paths
    // when the pathfinder is struggling this causes a few leaders to try harder and show others the way 
    protected confidence = 0.5;
    protected agents: PathAgent[];
    protected waitingAgent: number;


    constructor(options: SizedPathfinderOptions) {
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

        pathfinders.push(this);
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
        // if their new goal is far from their current goal, recompute
        for (const agent of this.agents) {
            if (agent.path.length <= 0) continue;

            const lastNode = agent.path[agent.path.length - 1];
            if (lastNode.dist(this.goal) < pathfinderMinDist) continue;

            if (agent.processingSituation) {
                agent.tryedPartCompute = false;
                agent.processingSituation = null;
            }
            agent.computeEnd = true;
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

            // skip if failed resently
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
                            // failed partal and whole, reset and wait
                            agent.reset();
                        } else {
                            // failed only partal, record and start whole next time
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

                // space out between nodes evenly by interplating node i and node i+1
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



interface AStarState {
    gCosts: Map<NodePrimative, number>,
    fCosts: Map<NodePrimative, number>,
    sources: Map<NodePrimative, NodePrimative | null>,
    open: MappedHeap<NodePrimative>
}

export class AStarPathfinder extends PathfinderAbstract {
    tilemap: Tilemap;

    constructor(tilemap: Tilemap, options: PathfinderOptions = {}) {
        options.width = tilemap.width;
        options.height = tilemap.height;
        options.scale = tilemap.tileSize;

        super(options as SizedPathfinderOptions);

        this.tilemap = tilemap;
    }

    createAgent(radius: number) {
        if (radius > 0.5 * this.scale) {
            throw Error("AStarPathfinder can't handle agents wider than one tilemap cell");
        }

        return super.createAgent(radius);
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
                // path is not posible, start or end is blocked
                situation.type = PathSituationType.Failed;
                return situation;
            }

            situation.type = PathSituationType.Processing;
            situation.state = {
                gCosts: new Map<NodePrimative, number>(),
                fCosts: new Map<NodePrimative, number>(),
                sources: new Map<NodePrimative, NodePrimative | null>(),
                open: new MappedHeap<NodePrimative>([], (a, b) =>
                    ((situation.state as AStarState).fCosts.get(a) as number) <
                    ((situation.state as AStarState).fCosts.get(b) as number))
            };

        }

        const
            start = situation.start.copy().floor(),
            end = situation.end.copy().floor();
        const
            startPrimative = this.primitivizePosition(start),
            endPrimative = this.primitivizePosition(end);
        const
            {
                gCosts,
                fCosts,
                sources,
                open
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
        const neighbors = [];

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
        const path = [];
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
        }
    }

    private heuristic(start: Vertex2, end: Vertex2) {
        return Math.round(Math.hypot(end.x - start.x, end.y - start.y) * 100);
    }

    protected confirmNode(node: Vector2, radius: number) {
        const minX = Math.floor(node.x - radius),
            maxX = Math.ceil(node.x + radius),
            minY = Math.floor(node.y - radius),
            maxY = Math.ceil(node.y + radius);

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

class PathAgent {
    private readonly pathfinder: PathfinderAbstract;
    readonly id = Symbol();

    readonly radius: number;
    position: Vector2 | null = null;
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

    drawPath(thickness = 0.2, fillColor = "red", g = defaultDrawTarget) {
        if (this.position === null) return;

        g.push();

        g.noStroke();
        g.fill(fillColor);

        // add current postion to path, only for drawing
        this.path.unshift(this.position);

        for (let i = 0; i < this.path.length; i++) {
            const node = this.path[i].copy().multScalar(this.pathfinder.scale);

            g.circle(node.x, node.y, thickness);

            if (i >= this.path.length - 1) continue;

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

        // remove current postion from path, it was only there for drawing
        this.path.shift();

        g.pop();
    }

    getDirection(position: Vector2) {
        const newPosition = position.copy().divScalar(this.pathfinder.scale);

        if (!this.pathfinder.validatePosition(newPosition)) {
            this.position = null;
            return false;
        }
        this.position = newPosition;

        while (this.path.length > 0) {
            // remove path node if too close
            if (this.position.dist(this.path[0]) < pathfinderMinDist) {
                const pathNode = (this.path.shift() as Vector2).floor();
                this.pathfinder.setPheromones(pathNode);
            } else {
                // recompute start of path if path node is too far
                if (this.position.dist(this.path[0]) > pathfinderMaxDist) {
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
            if (this.pathfinder.goal === null) return false;

            const goalDistance = this.position.dist(this.pathfinder.goal);
            const atGoal = goalDistance < pathfinderMinDist * 2;

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
        return this.path[0].copy().multScalar(this.pathfinder.scale).sub(position);
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