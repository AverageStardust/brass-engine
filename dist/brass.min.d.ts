/// <reference types="matter-js" />
import p5 from "p5";
import REGL from "../../globalTypes/regl";
declare function createFastGraphics(width: number, height: number, renderer?: p5.RENDERER, pInst?: p5): p5.Graphics;
declare class Pool<T> {
    private readonly pool;
    readonly limited: boolean;
    private readonly generator;
    private readonly cleaner;
    constructor(initalSize: number, limited: boolean, generator: () => T, cleaner?: (obj: T) => T);
    get(): T;
    release(obj: T): void;
    get size(): number;
}
declare abstract class HeapAbstract<HeapType> {
    protected data: HeapType[];
    private readonly compare;
    constructor(data?: HeapType[], compare?: (a: HeapType, b: HeapType) => boolean);
    insert(value: any): this;
    remove(index?: number): HeapType | undefined;
    top(): HeapType;
    sort(): this;
    log(): this;
    private siftUp;
    private siftDown;
    protected abstract swap(indexA: number, indexB: number): this;
    private parent;
    private childLeft;
    private childRight;
    get size(): number;
}
declare class Heap<HeapType> extends HeapAbstract<HeapType> {
    protected swap(indexA: number, indexB: number): this;
}
declare class MappedHeap<HeapType> extends HeapAbstract<HeapType> {
    private readonly map;
    constructor(data?: HeapType[], compare?: (a: HeapType, b: HeapType) => boolean);
    insert(value: HeapType): this;
    removeValue(value: HeapType): HeapType | undefined;
    protected swap(indexA: number, indexB: number): this;
}
declare class MaxHeap<HeapType> extends Heap<HeapType> {
    constructor(data: HeapType[]);
}
declare class MinHeap<HeapType> extends Heap<HeapType> {
    constructor(data: HeapType[]);
}
declare class MappedMaxHeap<HeapType> extends MappedHeap<HeapType> {
    constructor(data: HeapType[]);
}
declare class MappedMinHeap<HeapType> extends MappedHeap<HeapType> {
    constructor(data: HeapType[]);
}
declare abstract class VectorAbstract {
    abstract array: number[];
    watch(watcher: Function): this;
    private getWatchedValue;
    private setWatchedValue;
    private watchedVectorMethod;
}
type Vertex2 = {
    x: number;
    y: number;
};
declare class Vector2 extends VectorAbstract {
    static fromObj(obj: Vertex2): Vector2;
    static fromObjFast(obj: Vertex2): Vector2;
    static fromDir(dir: number): Vector2;
    static fromDirMag(dir: number, mag: number): Vector2;
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    copy(): Vector2;
    equal(vec: Vertex2): boolean;
    set(vec: Vertex2): this;
    setScalar(x?: number, y?: number): this;
    add(vec: Vertex2): this;
    addScalar(x?: number, y?: number): this;
    sub(vec: Vertex2): this;
    subScalar(x?: number, y?: number): this;
    mult(vec: Vertex2): this;
    multScalar(x?: number, y?: number): this;
    div(vec: Vertex2): this;
    divScalar(x?: number, y?: number): this;
    rem(vec: Vertex2): this;
    remScalar(x?: number, y?: number): this;
    mod(vec: Vertex2): this;
    modScalar(x?: number, y?: number): this;
    abs(): this;
    floor(): this;
    round(): this;
    ceil(): this;
    mix(vec: Vertex2, amount: number): this;
    norm(magnitude?: number): this;
    normArea(targetArea?: number): this;
    limit(limit?: number): this;
    setAngle(angle: number): this;
    angleTo(vec: Vertex2): number;
    angleBetween(vec: Vertex2): number;
    rotate(angle: number): this;
    dot(vec: Vertex2): number;
    cross(vec: Vertex2): void;
    dist(vec: Vertex2): number;
    distSq(vec: Vertex2): number;
    get mag(): number;
    get magSq(): number;
    set mag(magnitude: number);
    get area(): number;
    get angle(): number;
    set angle(angle: number);
    get array(): number[];
    set array([x, y]: number[]);
}
declare abstract class LayerAbstract<T extends {
    [key: string]: any;
}> {
    id: symbol;
    protected abstract size: Vertex2 | null;
    protected readonly creator: (size: Vertex2) => T;
    protected readonly resizer: (size: Vertex2, oldMaps: T) => T;
    protected maps: T;
    constructor(creator: (size: Vertex2) => T, resizer?: (size: Vertex2, oldMaps: T) => T);
    hasSize(): boolean;
    getSize(ratio?: number): {
        x: number;
        y: number;
    };
    abstract getMaps(size?: Vertex2): T;
    sizeMaps(size: Vertex2): void;
    protected setMaps(maps: T | null): void;
    private getMap;
    protected throwSizeError(): never;
}
declare function setDrawTarget(name: string, drawTarget: DrawTarget<any>): void;
declare function getDrawTarget(name: string): DrawTarget<any>;
declare const hasDrawTarget: (key: string) => boolean;
declare class DrawTarget<T> extends LayerAbstract<T> {
    protected size: Vertex2;
    private sizer;
    constructor(creator: (size: Vertex2) => T, resizer?: (size: Vertex2, oldMaps: T) => T, sizer?: (self: DrawTarget<T>) => Vertex2);
    setSizer(sizer: (self: DrawTarget<T>) => Vertex2): void;
    getMaps(): T;
    refresh(causes?: Symbol[]): void;
    hasName(name: string): boolean;
    private getSizerResult;
    private defaultSizer;
}
declare class DrawBuffer<T> extends LayerAbstract<T> {
    protected size: Vertex2 | null;
    constructor(creator: (size: Vertex2) => T, resizer?: (size: Vertex2, oldMaps: T) => T);
    getMaps(size?: Vertex2): T;
}
type P5LayerMap = p5.Graphics | p5;
type P5Layer = LayerAbstract<{
    canvas: P5LayerMap;
}>;
declare function getP5DrawTarget(name: string): P5DrawTarget;
declare class P5DrawBuffer extends DrawBuffer<{
    canvas: P5LayerMap;
}> {
    constructor(arg?: p5.RENDERER | P5LayerMap);
}
declare class P5DrawTarget extends DrawTarget<{
    canvas: P5LayerMap;
}> {
    constructor(sizer?: (self: P5DrawTarget) => Vertex2, arg?: p5.RENDERER | P5LayerMap);
}
interface ViewpointAbstractOptions {
    integerTranslation?: boolean;
    integerScaling?: boolean;
    shakeSpeed?: number;
}
declare abstract class ViewpointAbstract {
    scale: number;
    translation: Vector2;
    protected integerTranslation: boolean;
    protected integerScaling: boolean;
    private shakeSpeed;
    private shakeStrength;
    private shakeDecay;
    protected shakePosition: Vector2;
    constructor(scale: number, translation: Vector2, options?: ViewpointAbstractOptions);
    abstract update(delta: number): void;
    view(d?: P5Layer): void;
    getScreenViewArea(d?: P5Layer): {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };
    getWorldViewArea(d?: P5Layer): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    traslateScreen(screenTranslation: Vector2): void;
    screenToWorld(screenCoord: Vector2, d?: P5DrawTarget): Vector2;
    worldToScreen(worldCoord: Vector2, d?: P5DrawTarget): Vector2;
    protected abstract getViewOrigin(g: P5Layer): Vector2;
    protected get effectiveTranslation(): Vector2;
    protected get effectiveScale(): number;
    shake(strength: number, duration?: number): void;
    protected updateShake(delta: number): void;
}
type MatterWorldDefinition = Partial<Matter.IEngineDefinition & {
    spaceScale: number;
}>;
declare function drawColliders(weight?: number, d?: P5DrawTarget): void;
declare global {
    let _targetFrameRate: number;
}
interface Timewarp {
    duration: number;
    rate: number;
}
interface InitOptions {
    sketch?: p5;
    drawTarget?: p5.Graphics | DrawTarget<any>;
    viewpoint?: ViewpointAbstract;
    maxFrameRate?: number;
    maxTimeDelta?: number;
    minTimeDelta?: number;
    sound?: boolean;
    matter?: boolean | MatterWorldDefinition;
    regl?: boolean;
}
declare function setTestStatus(newStatus: boolean | string): void;
declare function getTestStatus(): string | true | null;
declare function init$0(options?: InitOptions): void;
declare function update$0(delta?: number): void;
declare function timewarp(duration: number, rate?: number): void;
declare function getTimewarp(): Timewarp | undefined;
declare function getTimewarps(): Timewarp[];
declare function disableContextMenu(): void;
declare abstract class InputDeviceAbstract {
    private readonly buttonStateChanges;
    private readonly axisStateChanges;
    private readonly vectorStateChanges;
    private readonly buttonState;
    private readonly axisState;
    private readonly vectorState;
    readonly devicePrefix: string;
    constructor(devicePrefix: string, buttonList: string[], axisList: string[], vectorList: string[]);
    abstract update(): void;
    applyState(mapper: InputMapper): void;
    applyStateChange(mapper: InputMapper): void;
    protected clearState(): void;
    protected setButton(name: string, value: boolean): void;
    protected setAxis(name: string, value: number): void;
    protected setVector(name: string, value: Vertex2): void;
}
declare class InputState<T> {
    protected readonly state: Map<string, T>;
    protected readonly unitName: string;
    constructor(unitName: string);
    has(name: string): boolean;
    get(name: string): T;
    setSafe(name: string, value: T): void;
    set(name: string, value: T): void;
    add(name: string, value: T): void;
}
declare class ButtonInputState extends InputState<boolean> {
    private readonly unions;
    private readonly nextResolves;
    constructor(unitName: string);
    update(): void;
    setSafe(name: string, value: boolean): void;
    set(name: string, value: boolean): void;
    next(): Promise<string>;
    private updateUnion;
    private joinUnion;
    setAvailableUnion(unionName: string, names: string[]): void;
    setUnion(unionName: string, names: string[]): void;
}
declare class InputMapper {
    readonly button: ButtonInputState;
    readonly axis: InputState<number>;
    readonly vector: InputState<Vector2>;
    readonly devices: InputDeviceAbstract[];
    readonly derivers: ((mapper: InputMapper) => void)[];
    constructor(devices?: string[], derivers?: (string | ((mapper: InputMapper) => void))[]);
    update(): void;
    has(devicePrefix: string): boolean;
}
type ColorArgs = [
    string
] | [
    number
] | [
    number,
    number
] | [
    number,
    number,
    number
] | [
    number,
    number,
    number,
    number
] | [
    p5.Color
];
interface LighterAbstractOptions {
    resolution?: number;
}
interface P5LighterOptions extends LighterAbstractOptions {
    blur?: number;
    color?: p5.Color;
}
interface DirectionalOptions {
    cacheName?: any;
    cacheTime?: number;
    rays?: number;
    raySteps?: number;
    rayWidth?: number;
    raysCollideWith?: "everything" | "nothing" | number | number[];
    drawOffscreen?: boolean;
}
declare class P5Lighter {
    private lightBuffer;
    private resolution;
    private _blur;
    private color;
    private directionalCache;
    private viewpoint;
    constructor(options?: P5LighterOptions);
    begin(v?: ViewpointAbstract, d?: P5DrawTarget): this;
    end(d?: P5Layer): void;
    set blur(value: number);
    get blur(): number;
    fill(...colArgs: ColorArgs): this;
    point(x: number, y: number, r: number): this;
    cone(x: number, y: number, angle: number, width?: number, distance?: number): this;
    world(vignette?: number): this;
    directional(x: number, y: number, radius: number, options?: DirectionalOptions): void;
    private simulateDirectional;
    private findDirectionalLineSegment;
    private castDirectionalRays;
    private resetLightCanvas;
    private getLightCanvas;
    get lightCanvas(): p5 | null;
    private throwBeginError;
}
type DynamicTypedArrayType = "int8" | "int16" | "int32" | "uint8" | "uint16" | "uint32" | "float32" | "float64";
type DynamicArrayType = "any" | DynamicTypedArrayType;
type DynamicTypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array;
type DynamicArray = any[] | DynamicTypedArray;
type Opaque<T, S> = T & {
    __opaque__: S;
};
interface Collision {
    body: BodyAbstract;
    self: BodyAbstract;
    points: Vector2[];
}
type CollisionCallback = (collision: Collision) => void;
type CollisionFilterIndex = Opaque<number, "CollisionFilterIndex">;
type CollisionFilterMask = Opaque<number, "CollisionFilterMask">;
type CollisionFilterCategory = Opaque<number, "CollisionFilterCategory">;
declare abstract class BodyAbstract {
    private sensors;
    alive: boolean;
    data: any;
    constructor();
    abstract get position(): Vector2;
    abstract get velocity(): Vector2;
    abstract get angle(): number;
    abstract get angularVelocity(): number;
    abstract get static(): boolean;
    abstract get ghost(): boolean;
    abstract set position(position: Vector2);
    abstract set velocity(velocity: Vector2);
    abstract set angle(angle: number);
    abstract set angularVelocity(angularVelocity: number);
    abstract set static(isStatic: boolean);
    abstract set ghost(isGhost: boolean);
    abstract set collisionCategory(category: number);
    abstract set collidesWith(category: "everything" | "nothing" | number | number[]);
    addSensor(callback: CollisionCallback): this;
    removeSensor(callback: CollisionCallback): this;
    triggerSensors(collision: Collision): this;
    abstract rotate(rotation: number): this;
    abstract applyForce(force: Vertex2, position?: Vertex2): this;
    kill(): void;
    protected validateCollisionIndex(index: number): CollisionFilterCategory;
    protected validateCollisionMask(mask: number): CollisionFilterMask;
    protected collisionIndexToCategory(index: number): CollisionFilterCategory;
    protected collisionCategoryToIndex(category: number): CollisionFilterIndex;
}
type InternalMatterBody = Matter.Body & {
    collisionFilter: {
        category: CollisionFilterCategory;
    };
    __brassBody__: MaterialBodyAbstract;
};
declare abstract class MaterialBodyAbstract extends BodyAbstract {
    body: InternalMatterBody;
    constructor(body: Matter.Body);
    protected setBody(body: Matter.Body): void;
    protected removeBody(): void;
    get position(): Vector2;
    private setPosition;
    get velocity(): Vector2;
    private setVelocity;
    get angle(): number;
    get angularVelocity(): number;
    get static(): boolean;
    get ghost(): boolean;
    set position(position: Vertex2);
    set velocity(velocity: Vertex2);
    set angle(angle: number);
    set angularVelocity(angularVelocity: number);
    set static(isStatic: boolean);
    set ghost(isGhost: boolean);
    set collisionCategory(categoryIndex: number);
    set collidesWith(category: "everything" | "nothing" | number | number[]);
    private setCollidesWith;
    rotate(rotation: number): this;
    applyForce(force: Vertex2, position?: Vector2): this;
    kill(): void;
    protected remove(): void;
}
declare class GridBody extends MaterialBodyAbstract {
    private readonly x;
    private readonly y;
    private readonly width;
    private readonly height;
    private readonly gridScale;
    private readonly options;
    constructor(width: number, height: number, grid: ArrayLike<any>, options?: Matter.IBodyDefinition, gridScale?: number);
    buildBody(grid: ArrayLike<any>, minX?: number, minY?: number, maxX?: number, maxY?: number): void;
    get static(): boolean;
    private buildParts;
}
type SparseableDynamicArrayType = "sparse" | DynamicArrayType;
type FieldDeclaration = {
    [name: string]: SparseableDynamicArrayType;
};
type SparseFieldData = {
    [name: `${number},${number}`]: any;
};
type SparseableDynamicArray = {
    sparse: true;
    data: SparseFieldData;
} | {
    sparse: false;
    data: DynamicArray;
};
interface LevelFields {
    [name: string]: {
        type: "sparse";
        data: SparseFieldData;
    } | ({
        type: DynamicArrayType;
    } & ({
        data: any[];
    } | {
        data: string;
        encoding: DynamicTypedArrayType;
    }));
}
interface Level {
    width: number;
    height: number;
    objects: any[];
    tilesets: {
        [name: string]: LevelTileset;
    };
    fields: LevelFields;
}
interface LevelTileset {
    firstId: number;
    tiles: {
        [id: number]: {
            [name: string]: any;
        };
    };
}
interface TilemapAbstractOptions {
    tileSize?: number;
    fields?: FieldDeclaration;
    solidField?: string;
    body?: boolean | Matter.IBodyDefinition;
    autoMaintainBody?: boolean;
    getTileData?: (x: number, y: number) => unknown;
    isTileSolid?: (data: any) => boolean;
}
declare abstract class TilemapAbstract {
    readonly width: number;
    readonly height: number;
    readonly tileSize: number;
    protected readonly fields: SparseableDynamicArray[];
    protected readonly fieldIds: {
        [name: string]: number;
    };
    protected readonly solidFieldId: number;
    protected readonly fieldTypes: FieldDeclaration;
    private readonly hasBody;
    private readonly autoMaintainBody;
    readonly body: GridBody | null;
    private bodyValid;
    protected readonly getTileData: (x: number, y: number) => unknown;
    private readonly isTileSolid;
    constructor(width: number, height: number, options?: TilemapAbstractOptions);
    bindOptionsFunction(func?: Function): any;
    maintain(): void;
    maintainBody(minX?: number, minY?: number, maxX?: number, maxY?: number): void;
    get(x: number, y: number, fieldId?: number): any;
    set(value: any, x: number, y: number, fieldId?: number): boolean;
    getSolid(x: number, y: number): boolean | undefined;
    export(): Level;
    import(world: Level): void;
    private updateSolidAtTile;
    clearFields(): void;
    private createField;
    abstract clearCaches(): void;
    abstract clearCacheAtTile(tileX: number, tileY: number): void;
    validateCoord(x: number, y: number): boolean;
    get area(): number;
}
type Asset = p5.Image | p5.Graphics | p5.SoundFile | Level;
type AssetDefinitionArgs = [
    string
] | [
    string,
    string
];
declare function loaded(): boolean;
declare function loadProgress(): number;
declare function loadImageEarly(...args: AssetDefinitionArgs): Promise<unknown>;
declare function loadImageLate(...args: AssetDefinitionArgs): Promise<Asset>;
declare function loadImageDynamic(qualitySteps: number | string[], ...args: AssetDefinitionArgs): Promise<Asset>[];
declare function getImage(name: string): p5.Image | p5.Graphics;
declare function loadSoundEarly(...args: AssetDefinitionArgs): Promise<unknown>;
declare function loadSoundLate(...args: AssetDefinitionArgs): Promise<Asset>;
declare function getSound(name: string): p5.SoundFile;
declare function setUnsafeLevelLoading(value?: boolean): void;
declare function loadLevelEarly(fields: FieldDeclaration, ...args: AssetDefinitionArgs): Promise<unknown>;
declare function loadLevelLate(fields: FieldDeclaration, ...args: AssetDefinitionArgs): Promise<Asset>;
declare function getLevel(name: string): Level | null;
type ParticleClass = new (...rest: any[]) => Particle;
declare class Particle {
    position: Vector2;
    radius: number;
    lifetime: number;
    private spawnTime;
    constructor();
    update(delta: number): void;
    draw(g: P5LayerMap): void;
    alive(): boolean;
    visable(viewArea: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }): boolean;
    kill(): void;
    get age(): number;
}
declare function draw(v?: ViewpointAbstract, d?: P5DrawTarget): void;
declare function forEachParticle(func: (particle: Particle) => void): void;
declare function forEachVisableParticle(func: (particle: Particle) => void, v?: ViewpointAbstract, d?: P5DrawTarget): void;
declare function setParticleLimit(limit: number): void;
declare function emitParticles(classVar: ParticleClass, amount: number, position: Vertex2, ...data: any[]): void;
declare function emitParticle(classVar: ParticleClass, position: Vertex2, ...data: any[]): void;
declare class VelocityParticle extends Particle {
    protected velocity: Vector2;
    constructor(velocity?: Vector2);
    protected updateKinomatics(delta: number): void;
    protected collide(tilemap: TilemapAbstract): void;
}
declare enum PathSituationType {
    Inital = 0,
    Processing = 1,
    Failed = 2,
    Succeed = 3
}
type PathSituation<T> = {
    start: Vector2;
    end: Vector2;
    maxRuntime: number;
    runtime: number;
    type: PathSituationType;
    state?: T;
    path?: Vertex2[];
    cost?: number;
};
declare class PathAgent {
    private readonly pathfinder;
    readonly id: symbol;
    readonly radius: number;
    position: Vector2 | null;
    direction: Vector2 | false;
    newGoal: boolean;
    leadership: number;
    processingSituation: PathSituation<unknown> | null;
    tryedPartCompute: boolean;
    pathCost: number;
    pathGarbage: number;
    path: Vector2[];
    waitingNodeComfirmation: number;
    computeStart: boolean;
    computeEnd: boolean;
    pathFailTime: number;
    constructor(pathfinder: PathfinderAbstract, radius: number, leadership?: number);
    drawPath(thickness?: number, fillColor?: string, d?: P5DrawTarget): void;
    getDirection(position?: Vector2): boolean | Vector2;
    reset(): void;
    setPath(path: Vector2[], cost?: number): void;
    set computeWhole(value: boolean);
    get computeWhole(): boolean;
}
type ComputePathArgs = [
    PathSituation<unknown>
] | [
    Vector2,
    Vector2,
    number
];
interface PathfinderAbstractOptions {
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
declare abstract class PathfinderAbstract {
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
    protected confidence: number;
    protected agents: PathAgent[];
    protected waitingAgent: number;
    constructor(options: PathfinderAbstractOptions);
    createAgent(radius: number, leadership?: number): PathAgent;
    removeAgent(agent: PathAgent): void;
    setGoal(goal: Vector2): boolean;
    confidenceDelta(delta: number): void;
    update(endTime: number): void;
    protected confirmAgentNodes(agent: PathAgent): void;
    protected attemptAgentPartCompute(agent: PathAgent): PathSituation<unknown> | undefined;
    protected afterAgentComputePart(agent: PathAgent, pathSituation: PathSituation<unknown>): void;
    protected attemptAgentWholeCompute(agent: PathAgent): PathSituation<unknown> | undefined;
    protected afterAgentComputeWhole(agent: PathAgent, pathSituation: PathSituation<unknown>): void;
    protected spaceOutPath(_path: Vertex2[]): Vector2[];
    protected abstract computePath(...args: ComputePathArgs): PathSituation<unknown>;
    protected parseComputePathArgs(args: ComputePathArgs): PathSituation<unknown>;
    protected abstract confirmNode(node: Vector2, radius: number): boolean;
    protected getPheromones({ x, y }: Vertex2): number;
    setPheromones({ x, y }: Vertex2): void;
    validatePosition(position: Vertex2): boolean;
}
type NodePrimative = Opaque<number, "NodePrimitive">;
interface AStarState {
    gCosts: Map<NodePrimative, number>;
    fCosts: Map<NodePrimative, number>;
    sources: Map<NodePrimative, NodePrimative | null>;
    open: MappedHeap<NodePrimative>;
}
declare class AStarPathfinder extends PathfinderAbstract {
    tilemap: TilemapAbstract;
    constructor(tilemap: TilemapAbstract, _options?: Omit<PathfinderAbstractOptions, "width" | "height">);
    createAgent(radius: number, leadership?: number): PathAgent;
    protected computePath(...args: ComputePathArgs): PathSituation<AStarState>;
    private computeAStar;
    private computeNeighbors;
    private reconstructPath;
    private primitivizePosition;
    private deprimitivizePosition;
    private heuristic;
    protected confirmNode(node: Vector2, radius: number): boolean;
}
declare class RectBody extends MaterialBodyAbstract {
    constructor(x: number, y: number, width: number, height: number, options?: Matter.IBodyDefinition);
}
declare class CircleBody extends MaterialBodyAbstract {
    constructor(x: number, y: number, radius: number, options?: Matter.IBodyDefinition);
}
declare class PolyBody extends MaterialBodyAbstract {
    constructor(x: number, y: number, verts: Vertex2[][], options?: Matter.IBodyDefinition);
}
declare class RayBody extends BodyAbstract {
    private id;
    position: Vector2;
    velocity: Vector2;
    private width;
    private mask;
    constructor(x: number, y: number, width?: number, options?: {
        velocity?: Vertex2;
        mask?: number;
    });
    get angle(): number;
    get angularVelocity(): number;
    get static(): boolean;
    get ghost(): boolean;
    set angle(_: number);
    set angularVelocity(_: number);
    set static(isStatic: boolean);
    set ghost(isGhost: boolean);
    set collisionCategory(_: number);
    set collidesWith(category: "everything" | "nothing" | number | number[]);
    private setCollidesWith;
    rotate(_: number): never;
    applyForce(): never;
    kill(): void;
    protected remove(): void;
    castOverTime(delta: number, steps?: number): {
        point: Vector2;
        dist: Number;
        body: null | MaterialBodyAbstract;
    };
    cast(_displacement: Vector2, steps?: number): {
        point: Vector2;
        dist: number;
        body: MaterialBodyAbstract | null;
    };
}
interface P5TilemapOptions extends TilemapAbstractOptions {
    drawCacheMode?: "never" | "check" | "always";
    drawCacheChunkSize?: number;
    drawCacheTileResolution?: number;
    drawCacheDecayTime?: number;
    drawCachePadding?: number;
    drawCachePaddingTime?: number;
    drawCachePoolInitalSize?: number;
    drawTile?: (data: any, x: number, y: number, g: P5LayerMap) => void;
    drawOrder?: (data: any) => number;
    canCacheTile?: (data: any) => boolean;
}
declare class P5Tilemap extends TilemapAbstract {
    readonly drawCacheMode: "never" | "check" | "always";
    readonly drawCacheChunkSize: number;
    private readonly drawCacheTileResolution;
    private readonly drawCacheDecayTime;
    private readonly drawCachePadding;
    private readonly drawCachePaddingTime;
    private readonly drawTile;
    private readonly drawOrder;
    private readonly canCacheTile;
    private readonly chunkPool;
    private readonly chunks;
    private readonly cacheableChunks;
    constructor(width: number, height: number, options?: P5TilemapOptions);
    draw(v?: ViewpointAbstract, d?: P5DrawTarget): void;
    private padChunks;
    private canCacheChunk;
    private renderChunk;
    private drawChunk;
    private maintainChunk;
    private drawTiles;
    private defaultDrawTile;
    clearCaches(): void;
    clearCacheAtTile(tileX: number, tileY: number): void;
}
declare function getTime(): number;
declare function getExactTime(): number;
declare function getSimTime(): number;
declare function setLoadingTips(tips: string[]): void;
declare function drawFPS(d?: P5DrawTarget): void;
declare function drawLoading(d?: P5DrawTarget): void;
declare function resize(_width?: number, _height?: number): void;
declare function getRegl(): REGL.Regl;
declare function refreshRegl(): void;
declare function refreshReglFast(): void;
declare function getCanvasDrawTarget(name: string): CanvasDrawTarget;
declare class CanvasDrawTarget extends DrawTarget<{
    canvas: HTMLCanvasElement;
}> {
    constructor(sizer?: (self: CanvasDrawTarget) => Vertex2);
}
declare function drawNativeToP5(p5Target?: P5DrawTarget, canvasTarget?: CanvasDrawTarget): void;
declare function setDefaultViewpoint(viewpoint: ViewpointAbstract): void;
declare function getDefaultViewpoint(): ViewpointAbstract;
declare class ClassicViewpoint extends ViewpointAbstract {
    constructor(scale?: number, translation?: Vector2, options?: ViewpointAbstractOptions);
    update(): void;
    protected getViewOrigin(): Vector2;
}
interface ViewpointOptions extends ViewpointAbstractOptions {
    jump?: number;
    follow?: number;
    drag?: number;
    outrun?: number;
}
declare class Viewpoint extends ViewpointAbstract {
    private velocity;
    private _target;
    private previousTarget;
    private readonly jump;
    private readonly follow;
    private readonly drag;
    private readonly outrun;
    constructor(scale?: number, translation?: Vector2, options?: ViewpointOptions);
    update(delta: number): void;
    protected getViewOrigin(d: P5DrawTarget): Vector2;
    set target(value: Vector2);
    get target(): Vector2;
}
export { createFastGraphics, Pool, Heap, MaxHeap, MinHeap, MappedHeap, MappedMaxHeap, MappedMinHeap, init$0 as init, update$0 as update, setTestStatus, getTestStatus, timewarp, getTimewarp, getTimewarps, InputMapper, disableContextMenu, P5Lighter, loadImageEarly, loadImageLate, loadImageDynamic, getImage, loadSoundEarly, loadSoundLate, getSound, setUnsafeLevelLoading, loadLevelEarly, loadLevelLate, getLevel, loaded, loadProgress, setParticleLimit, emitParticles, emitParticle, forEachParticle, forEachVisableParticle, draw as drawParticles, Particle, VelocityParticle, AStarPathfinder, drawColliders, RectBody, CircleBody, PolyBody, GridBody, RayBody, P5Tilemap, getTime, getExactTime, getSimTime, drawFPS, drawLoading, setLoadingTips, Vertex2, Vector2, resize, getRegl, refreshRegl, refreshReglFast, DrawBuffer, DrawTarget, setDrawTarget, hasDrawTarget, getDrawTarget, P5DrawBuffer, P5DrawTarget, getP5DrawTarget, CanvasDrawTarget, getCanvasDrawTarget, drawNativeToP5, setDefaultViewpoint, getDefaultViewpoint, ClassicViewpoint, Viewpoint };
