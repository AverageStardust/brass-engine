/// <reference types="matter-js" />
import p5 from "p5";
import REGL from "../types/regl";
type Opaque<T, S> = T & {
    __opaque__: S;
};
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
type DynamicTypedArrayType = "int8" | "int16" | "int32" | "uint8" | "uint16" | "uint32" | "float32" | "float64";
type DynamicArrayType = "any" | DynamicTypedArrayType;
type DynamicTypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array;
type DynamicArray = any[] | DynamicTypedArray;
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
type Vertex2 = {
    x: number;
    y: number;
};
type Vertex3 = {
    x: number;
    y: number;
    z: number;
};
declare class Vector2 {
    x: number;
    y: number;
    watcher?: Function;
    static fromObj(obj: Vertex2): Vector2;
    static fromObjFast(obj: Vertex2): Vector2;
    static fromDir(dir: number): Vector2;
    static fromDirMag(dir: number, mag: number): Vector2;
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
    rotate(angle: number): this;
    dot(vec: Vertex2): number;
    cross(vec: Vertex2): number;
    dist(vec: Vertex2): number;
    distSq(vec: Vertex2): number;
    get mag(): number;
    get magSq(): number;
    set mag(magnitude: number);
    get area(): number;
    get angle(): number;
    set angle(angle: number);
    get array(): [
        number,
        number
    ];
    set array(arr: [
        number,
        number
    ]);
}
declare class Vector3 {
    x: number;
    y: number;
    z: number;
    watcher?: Function;
    static fromObj(obj: Vertex3): Vector3;
    static fromObjFast(obj: Vertex3): Vector3;
    constructor(x?: number, y?: number, z?: number);
    copy(): Vector3;
    equal(vec: Vertex3): boolean;
    set(vec: Vertex3): this;
    setScalar(x?: number, y?: number, z?: number): this;
    add(vec: Vertex3): this;
    addScalar(x?: number, y?: number, z?: number): this;
    sub(vec: Vertex3): this;
    subScalar(x?: number, y?: number, z?: number): this;
    mult(vec: Vertex3): this;
    multScalar(x?: number, y?: number, z?: number): this;
    div(vec: Vertex3): this;
    divScalar(x?: number, y?: number, z?: number): this;
    rem(vec: Vertex3): this;
    remScalar(x?: number, y?: number, z?: number): this;
    mod(vec: Vertex3): this;
    modScalar(x?: number, y?: number, z?: number): this;
    abs(): this;
    floor(): this;
    round(): this;
    ceil(): this;
    mix(vec: Vertex3, amount: number): this;
    norm(magnitude?: number): this;
    limit(limit?: number): this;
    dot(vec: Vertex3): number;
    cross(vec: Vertex3): this;
    dist(vec: Vertex3): number;
    distSq(vec: Vertex3): number;
    get xy(): Vector2;
    get yx(): Vector2;
    get yz(): Vector2;
    get zy(): Vector2;
    get xz(): Vector2;
    get zx(): Vector2;
    get xyz(): Vector3;
    get yxz(): Vector3;
    get yzx(): Vector3;
    get zyx(): Vector3;
    get xzy(): Vector3;
    get zxy(): Vector3;
    get mag(): number;
    get magSq(): number;
    set mag(magnitude: number);
    get array(): [
        number,
        number,
        number
    ];
    set array(arr: [
        number,
        number,
        number
    ]);
}
declare function watchVector<T extends Vector2 | Vector3>(vector: T, watcher: Function): T;
type P5DrawSurfaceMap = (p5.Graphics | p5);
type P5DrawSurface = DrawSurfaceAbstract<{
    canvas: P5DrawSurfaceMap;
}>;
declare function setDrawTarget(name: string, drawTarget: DrawTarget<any>): void;
declare function getDrawTarget(name: string): DrawTarget<any>;
declare const hasDrawTarget: (key: string) => boolean;
declare function getP5DrawTarget(name: string): P5DrawTarget;
declare function getCanvasDrawTarget(name: string): CanvasDrawTarget;
declare function resize(width?: number, height?: number): void;
declare function getRegl(): REGL.Regl;
declare function refreshRegl(): void;
declare function refreshReglFast(): void;
declare function displayRegl(d?: P5DrawTarget): void;
declare abstract class DrawSurfaceAbstract<T extends {
    [key: string]: any;
}> {
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
declare class DrawTarget<T> extends DrawSurfaceAbstract<T> {
    private id;
    protected size: Vertex2;
    private sizer;
    constructor(creator: (size: Vertex2) => T, resizer?: (size: Vertex2, oldMaps: T) => T, sizer?: () => Vertex2);
    setSizer(sizer: () => Vertex2): void;
    getMaps(): T;
    refresh(causes?: Symbol[]): void;
    private getSizerResult;
}
declare class P5DrawTarget extends DrawTarget<{
    canvas: P5DrawSurfaceMap;
}> {
    constructor(sizer?: () => Vertex2, arg?: p5.RENDERER | P5DrawSurfaceMap);
}
declare class CanvasDrawTarget extends DrawTarget<{
    canvas: HTMLCanvasElement;
}> {
    constructor(sizer?: () => Vertex2);
}
interface AbstractViewpointOptions {
    integerTranslation?: boolean;
    integerScaling?: boolean;
    shakeSpeed?: number;
}
interface ViewpointOptions extends AbstractViewpointOptions {
    jump?: number;
    follow?: number;
    drag?: number;
    outrun?: number;
}
declare function setDefaultViewpoint(viewpoint: ViewpointAbstract): void;
declare function getDefaultViewpoint(): ViewpointAbstract;
declare abstract class ViewpointAbstract {
    scale: number;
    translation: Vector2;
    protected integerTranslation: boolean;
    protected integerScaling: boolean;
    private shakeSpeed;
    private shakeStrength;
    private shakeDecay;
    protected shakePosition: Vector2;
    constructor(scale: number, translation: Vector2, options?: AbstractViewpointOptions);
    abstract update(delta: number): void;
    view(d?: P5DrawTarget): void;
    getViewArea(d?: P5DrawTarget): {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };
    traslateScreen(screenTranslation: Vector2): void;
    screenToWorld(screenCoord: Vector2, d?: P5DrawTarget): Vector2;
    worldToScreen(worldCoord: Vector2, d?: P5DrawTarget): Vector2;
    protected abstract getViewOrigin(g: P5DrawTarget): Vector2;
    protected get effectiveTranslation(): Vector2;
    protected get effectiveScale(): number;
    shake(strength: number, duration?: number): void;
    protected updateShake(delta: number): void;
}
declare class ClassicViewpoint extends ViewpointAbstract {
    constructor(scale?: number, translation?: Vector2, options?: ViewpointOptions);
    update(delta: number): void;
    protected getViewOrigin(): Vector2;
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
interface Timewarp {
    duration: number;
    rate: number;
}
interface InitOptions {
    sketch?: p5;
    drawTarget?: p5.Graphics | DrawTarget<any>;
    viewpoint?: ViewpointAbstract;
    maxTimeDelta?: number;
    sound?: boolean;
    matter?: boolean | Partial<Matter.IEngineDefinition>;
    regl?: boolean;
}
declare function setTestStatus(newStatus: boolean | string): void;
declare function getTestStatus(): string | true | null;
declare function init$1(options?: InitOptions): void;
declare function update(delta?: number): void;
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
interface LighterOptions {
    resolution?: number;
    blur?: number;
    color?: p5.Color;
}
declare class Lighter {
    private lightMap;
    private resolution;
    private _blur;
    private color;
    constructor(options?: LighterOptions);
    begin(v?: ViewpointAbstract, d?: P5DrawTarget): this;
    end(d?: P5DrawSurface): void;
    set blur(value: number);
    get blur(): number;
    fill(...colArgs: ColorArgs): this;
    point(x: number, y: number, r: number): this;
    cone(x: number, y: number, angle: number, width?: number, distance?: number): this;
    world(): this;
    private resetLightMap;
    private getLightCanvas;
}
interface Collision {
    body: BodyAbstract;
    self: BodyAbstract;
    points: Vector2[];
}
type CollisionCallback = (collision: Collision) => void;
type InternalMatterBody = Matter.Body & {
    collisionFilter: {
        category: CollisionFilterCategory;
    };
    __brassBody__: MaterialBodyAbstract;
};
type CollisionFilterIndex = Opaque<number, "CollisionFilterIndex">;
type CollisionFilterMask = Opaque<number, "CollisionFilterMask">;
type CollisionFilterCategory = Opaque<number, "CollisionFilterCategory">;
declare function drawColliders(weight?: number, d?: P5DrawTarget): void;
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
    abstract set collidesWith(category: number | number[]);
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
    set collidesWith(category: number | number[]);
    private setCollidesWith;
    rotate(rotation: number): this;
    applyForce(force: Vertex2, position?: Vector2): this;
    kill(): void;
    protected destroy(): void;
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
    set collidesWith(category: number | number[]);
    private setCollidesWith;
    rotate(_: number): this;
    applyForce(): this;
    kill(): void;
    protected destroy(): void;
    cast(delta: number, steps?: number): {
        point: Vector2;
        dist: Number;
        body: null | MaterialBodyAbstract;
    };
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
interface TilemapWorldFields {
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
interface TilemapWorld {
    width: number;
    height: number;
    objects: any[];
    tilesets: {
        [name: string]: TilemapWorldTileset;
    };
    fields: TilemapWorldFields;
}
interface TilemapWorldTileset {
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
    getTileData?: (x: number, y: number) => any;
    isTileSolid?: (data: any) => boolean;
}
interface P5TilemapOptions extends TilemapAbstractOptions {
    drawCacheMode?: "never" | "check" | "always";
    drawCacheChunkSize?: number;
    drawCacheTileResolution?: number;
    drawCacheDecayTime?: number;
    drawCachePadding?: number;
    drawCachePaddingTime?: number;
    drawCachePoolInitalSize?: number;
    drawTile?: (data: any, x: number, y: number, g: P5DrawSurfaceMap) => void;
    drawOrder?: (data: any) => number;
    canCacheTile?: (data: any) => boolean;
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
    protected readonly getTileData: (x: number, y: number) => any;
    private readonly isTileSolid;
    constructor(width: number, height: number, options?: TilemapAbstractOptions);
    bindOptionsFunction(func?: Function): any;
    maintain(): void;
    maintainBody(minX?: number, minY?: number, maxX?: number, maxY?: number): void;
    get(x: number, y: number, fieldId?: number): any;
    set(value: any, x: number, y: number, fieldId?: number): boolean;
    getSolid(x: number, y: number): boolean | undefined;
    export(): TilemapWorld;
    import(world: TilemapWorld): void;
    private updateSolidAtTile;
    clearFields(): void;
    private createField;
    abstract clearCaches(): void;
    abstract clearCacheAtTile(tileX: number, tileY: number): void;
    validateCoord(x: number, y: number): boolean;
    get area(): number;
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
type Asset = p5.Image | p5.Graphics | p5.SoundFile | TilemapWorld;
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
declare function enableUnsafeWorldLoading(): void;
declare function loadWorldEarly(fields: FieldDeclaration, ...args: AssetDefinitionArgs): Promise<unknown>;
declare function loadWorldLate(fields: FieldDeclaration, ...args: AssetDefinitionArgs): Promise<Asset>;
declare function getWorld(name: string): TilemapWorld | null;
type ParticleClass = new (position: Vector2, ...rest: any[]) => ParticleAbstract;
declare function draw(v?: ViewpointAbstract, d?: P5DrawTarget): void;
declare function setParticleLimit(limit: number): void;
declare function emit(classVar: ParticleClass, amount: number, position: Vertex2, ...data: any[]): void;
declare function emitSingle(classVar: ParticleClass, position: Vertex2, ...data: any[]): void;
declare class ParticleAbstract {
    position: Vector2;
    radius: number;
    lifetime: number;
    private spawnTime;
    constructor(position: Vertex2);
    update(delta: number): void;
    draw(g: P5DrawSurfaceMap): void;
    alive(): boolean;
    kill(): void;
    get age(): number;
}
declare class VelocityParticleAbstract extends ParticleAbstract {
    protected velocity: Vector2;
    constructor(position: Vector2, velocity?: Vector2);
    protected updateKinomatics(delta: number): void;
    protected collide(tilemap: TilemapAbstract): void;
}
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
type ComputePathArgs = [
    PathSituation<unknown>
] | [
    Vector2,
    Vector2,
    number
];
interface SizedPathfinderOptions extends PathfinderOptions {
    width: number;
    height: number;
}
type NodePrimative = Opaque<number, "NodePrimitive">;
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
    protected pheromoneTime: number;
    protected readonly pheromones: Int32Array | null;
    goal: null | Vector2;
    protected confidence: number;
    protected agents: PathAgent[];
    protected waitingAgent: number;
    constructor(options: SizedPathfinderOptions);
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
interface AStarState {
    gCosts: Map<NodePrimative, number>;
    fCosts: Map<NodePrimative, number>;
    sources: Map<NodePrimative, NodePrimative | null>;
    open: MappedHeap<NodePrimative>;
}
declare class AStarPathfinder extends PathfinderAbstract {
    tilemap: TilemapAbstract;
    constructor(tilemap: TilemapAbstract, options?: PathfinderOptions);
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
declare function getTime(): number;
declare function getExactTime(): number;
declare function getSimTime(): number;
declare function setLoadingTips(tips: string[]): void;
declare function drawFPS(d?: P5DrawTarget): void;
declare function drawLoading(d?: P5DrawTarget): void;
export { Heap, MaxHeap, MinHeap, MappedHeap, MappedMaxHeap, MappedMinHeap, init$1 as init, update, setTestStatus, getTestStatus, timewarp, getTimewarp, getTimewarps, InputMapper, disableContextMenu, Lighter, loadImageEarly, loadImageLate, loadImageDynamic, getImage, loadSoundEarly, loadSoundLate, getSound, enableUnsafeWorldLoading, loadWorldEarly, loadWorldLate, getWorld, loaded, loadProgress, setParticleLimit, emit, emitSingle, draw as drawParticles, ParticleAbstract, VelocityParticleAbstract, AStarPathfinder, RectBody, CircleBody, PolyBody, GridBody, RayBody, drawColliders, P5Tilemap, getTime, getExactTime, getSimTime, drawFPS, drawLoading, setLoadingTips, Vertex2, Vertex3, Vector2, Vector3, watchVector, DrawTarget, P5DrawTarget, CanvasDrawTarget, setDrawTarget, hasDrawTarget, getDrawTarget, getP5DrawTarget, getCanvasDrawTarget, resize, getRegl, refreshRegl, refreshReglFast, displayRegl, ClassicViewpoint, Viewpoint, setDefaultViewpoint, getDefaultViewpoint };
