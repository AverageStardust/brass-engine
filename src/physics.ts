import { Opaque } from "./common";
import { defaultDrawTarget } from "./drawTarget";
import { Vector2, Vertex2, watchVector } from "./vector3";



interface Collision {
    body: BodyAbstract;
    self: BodyAbstract;
    points: Vector2[];
}
type CollisionCallback = (collision: Collision) => void;
type InternalMatterBody = Matter.Body & { collisionFilter: { category: CollisionFitlerCategory }, __brassBody__: MaterialBodyAbstract };
type CollisionFilterIndex = Opaque<number, "CollisionFilterIndex">; // index for bitmask, between 0 and 31 inclusive
type CollisionFitlerMask = Opaque<number, "CollisionFitlerMask">; // bitmask for what categories to collide with
type CollisionFitlerCategory = Opaque<number, "CollisionFitlerCategory">; // bitmask with one bit set for collions
type MatterWorldDefinition = Matter.IEngineDefinition & { spaceScale: number };



let inited = false;
let lastDelta: number | null = null;
let engine: Matter.Engine;
let world: Matter.World;
let spaceScale: number;
const rays: Map<symbol, RayBody> = new Map();
const bodies: { [index: CollisionFilterIndex]: Map<number, MaterialBodyAbstract> } = Array(32).fill(null).map(() => new Map());



export function init(_options: Partial<MatterWorldDefinition> = {}) {
    if (typeof Matter !== "object") {
        throw Error("Matter was not found; Can't initalize Brass physics without Matter.js initalized first");
    }

    _options.gravity ??= { scale: 0 };
    spaceScale = _options.spaceScale ?? 1;
    const options = _options as Matter.IEngineDefinition;

    engine = Matter.Engine.create(options);
    world = engine.world;

    Matter.Events.on(engine, "collisionActive", handleActiveCollisions);

    inited = true;
}

function handleActiveCollisions({ pairs }: Matter.IEventCollision<Matter.Engine>) {
    pairs.map((pair) => {
        const bodyA = (pair.bodyA as InternalMatterBody).__brassBody__;
        const bodyB = (pair.bodyB as InternalMatterBody).__brassBody__;
        const points: Vector2[] = [];
        for (const { vertex } of pair.activeContacts) {
            points.push(new Vector2(vertex.x / spaceScale, vertex.y / spaceScale));
        }
        bodyA.triggerSensors({ self: bodyA, body: bodyB, points: points.map(v => v.copy()) });
        bodyB.triggerSensors({ self: bodyB, body: bodyA, points });
    });
}

function enforceInit(action: string) {
    if (inited) return;
    throw Error(`Physics must be enabled in Brass.init() before ${action}`);
}

export function update(delta: number) {
    enforceInit("updating physics");

    if (lastDelta === null) lastDelta = delta;
    Matter.Engine.update(engine, delta, delta / lastDelta);
    lastDelta = delta;

    for (const [key, ray] of rays.entries()) {
        const { hit, point, body } = ray.cast(delta, true);
        if (!hit) continue;

        ray.position = Vector2.fromObj(point);
        ray.triggerSensors({ body: body as MaterialBodyAbstract, self: ray, points: [point] });

        Matter.Events.trigger(body, "collisionActive", {
            pairs: [{
                body: ray,
                self: body as MaterialBodyAbstract,
                point: Vector2.fromObj(point)
            }]
        });

        rays.delete(key);
    }
}

export function drawColliders(weight = 0.5, g = defaultDrawTarget) {
    g.push();
    g.noFill();
    g.stroke(0, 255, 0);
    g.strokeWeight(weight);

    const bodyQueue = [...world.bodies];
    const queuedBodies = new Set(bodyQueue.map((b) => b.id));

    while (bodyQueue.length > 0) {
        const body = bodyQueue.pop() as Matter.Body;

        for (const part of body.parts) {
            if (!queuedBodies.has(part.id)) {
                bodyQueue.push(part);
                queuedBodies.add(part.id)
            }
        }

        g.beginShape();
        for (const vert of body.vertices) {
            g.vertex(vert.x / spaceScale, vert.y / spaceScale);
        }
        g.endShape(CLOSE);
    }
    g.pop();
}

export abstract class BodyAbstract {
    private sensors: CollisionCallback[] = [];

    constructor() {
        enforceInit("creating a body");
    }

    abstract get position(): Vector2;
    abstract get velocity(): Vector2;
    abstract get angle(): number;
    abstract get angularVelocity(): number;
    abstract get static(): boolean
    abstract get ghost(): boolean

    abstract set position(position: Vector2);
    abstract set velocity(velocity: Vector2);
    abstract set angle(angle: number);
    abstract set angularVelocity(angularVelocity: number);
    abstract set static(isStatic: boolean)
    abstract set ghost(isGhost: boolean)
    abstract set collisionCategory(category: number)
    abstract set collidesWith(category: number | number[])

    addSensor(callback: CollisionCallback) {
        this.sensors.push(callback);
    }

    removeSensor(callback: CollisionCallback) {
        const index = [].findIndex((sensor) => sensor === callback);

        this.sensors.splice(index, 1);
    }

    triggerSensors(collision: Collision) {
        this.sensors.forEach((callback) => callback(collision));
    }

    abstract rotate(rotation: number): this;
    abstract applyForce(force: Vertex2, position?: Vertex2): this
    abstract destroy(): void;

    protected validateCollisionIndex(index: number): CollisionFitlerCategory {
        if (typeof index !== "number" ||
            index !== Math.floor(index)) throw Error("Collision category must be an integer");
        if (index < 0 || index > 31) throw Error("Collision category must be in 0 through 31 inclusive");

        return index as CollisionFitlerCategory;
    }

    protected validateCollisionMask(mask: number): CollisionFitlerMask {
        if (typeof mask !== "number" ||
            mask !== Math.floor(mask)) throw Error("Collision mask must be an integer");
        if (mask < 0x00000000 || mask > 0xFFFFFFFF) throw Error("Collision mask must be 32-bit");

        return mask as CollisionFitlerMask;
    }

    protected collisionIndexToCategory(index: number): CollisionFitlerCategory {
        this.validateCollisionIndex(index);
        return 1 << index as CollisionFitlerCategory;
    }

    protected collisionCategoryToIndex(category: number): CollisionFilterIndex {
        if (category === 0x8000) {
            return 31 as CollisionFilterIndex;
        } else {
            const index = Math.log2(category);
            if (index !== Math.floor(index)) throw Error("Internal Matter.js body could not be fit in one collision catagory");
            return index as CollisionFilterIndex;
        }
    }
}

abstract class MaterialBodyAbstract extends BodyAbstract {
    body!: InternalMatterBody;

    constructor(body: null | Matter.Body) {
        super();

        if (body !== null) {
            this.setBody(body);
        }
    }

    protected setBody(body: Matter.Body) {
        if (this.body !== undefined) {
            this.destroy();
        }

        this.body = body as InternalMatterBody;
        this.body.__brassBody__ = this;
        this.body.collisionFilter.category = this.collisionIndexToCategory(0);

        bodies[0 as CollisionFilterIndex].set(this.body.id, this);

        Matter.World.add(world, body);
    }

    protected removeBody() {

    }

    get position(): Vector2 {
        const position = Vector2.fromObj(this.body.position).divScalar(spaceScale);
        return watchVector(position, this.setPosition.bind(this));
    }
    private setPosition(position: Vector2) {
        this.position = position;
    }

    get velocity(): Vector2 {
        const velocity = Vector2.fromObj(this.body.velocity).divScalar(spaceScale);
        return watchVector(velocity, this.setVelocity.bind(this));
    }
    private setVelocity(velocity: Vector2) {
        this.velocity = velocity;
    }

    get angle() {
        return this.body.angle;
    }

    get angularVelocity() {
        return this.body.angularVelocity;
    }

    get static() {
        return this.body.isStatic;
    }

    get ghost() {
        return this.body.isSensor;
    }

    set position(position: Vertex2) {
        position = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
        Matter.Body.setPosition(this.body, position);
    }

    set velocity(velocity: Vertex2) {
        velocity = Matter.Vector.create(velocity.x * spaceScale, velocity.y * spaceScale);
        Matter.Body.setVelocity(this.body, velocity);
    }

    set angle(angle: number) {
        Matter.Body.setAngle(this.body, angle);
    }

    set angularVelocity(angularVelocity: number) {
        Matter.Body.setAngularVelocity(this.body, angularVelocity);
    }

    set static(isStatic: boolean) {
        Matter.Body.setStatic(this.body, isStatic);
    }

    set ghost(isGhost: boolean) {
        this.body.isSensor = isGhost;
    }

    set collisionCategory(categoryIndex: number) {
        const oldCategoryIndex = this.collisionCategoryToIndex(this.body.collisionFilter.category);
        bodies[oldCategoryIndex].delete(this.body.id);

        this.body.collisionFilter.category = this.collisionIndexToCategory(categoryIndex);
        bodies[categoryIndex as CollisionFilterIndex].set(this.body.id, this);
    }

    set collidesWith(category: number | number[]) {
        this.body.collisionFilter.mask = 0xFFFFFFFF;
        if (Array.isArray(category)) {
            category.map((subCategory) => this.setCollidesWith(subCategory));
        } else {
            this.setCollidesWith(category);
        }
    }

    private setCollidesWith(category: number) {
        this.validateCollisionIndex(category);

        if (category < 0) { // unsets mask bit of category
            (this.body.collisionFilter.mask as number) &= ~(1 << -category);
        } else { // sets mask bit of category
            (this.body.collisionFilter.mask as number) |= 1 << category;
        }

        return this;
    }

    rotate(rotation: number) {
        Matter.Body.rotate(this.body, rotation);
        return this;
    }

    applyForce(force: Vertex2, position = this.position) {
        const matterForce = Matter.Vector.create(force.x * spaceScale, force.y * spaceScale);
        const matterPosition = Matter.Vector.create(position.x * spaceScale, position.y * spaceScale);
        Matter.Body.applyForce(this.body, matterPosition, matterForce);
        return this;
    }

    destroy() {
        const categoryIndex = this.collisionCategoryToIndex(this.body.collisionFilter.category);
        bodies[categoryIndex].delete(this.body.id);
        Matter.World.remove(world, this.body);
    }
}

export class RectBody extends MaterialBodyAbstract {
    constructor(x: number, y: number, width: number, height: number, options?: Matter.IBodyDefinition) {
        const body = Matter.Bodies.rectangle(x * spaceScale, y * spaceScale, width * spaceScale, height * spaceScale, options);
        super(body);
    }
}

export class CircleBody extends MaterialBodyAbstract {
    constructor(x: number, y: number, radius: number, options?: Matter.IBodyDefinition) {
        const body = Matter.Bodies.circle(x * spaceScale, y * spaceScale, radius * spaceScale, options);
        super(body);
    }
}

export class PolyBody extends MaterialBodyAbstract {
    constructor(x: number, y: number, verts: Vertex2[][], options?: Matter.IBodyDefinition) {

        const matterVerts = verts.map(
            (subVerts) => subVerts.map(
                (vert) => Matter.Vector.create(vert.x * spaceScale, vert.y * spaceScale)));

        const body = Matter.Bodies.fromVertices(x * spaceScale, y * spaceScale, matterVerts, options);
        super(body);
    }
}

export class GridBody extends MaterialBodyAbstract {
    private readonly x: number;
    private readonly y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly gridScale: number;
    private readonly chunkSize: number;
    private readonly options: Matter.IBodyDefinition;
    private readonly chunks = new Map<number, Matter.Body[]>();
    private readonly changedChunks = new Set<number>();

    constructor(width: number, height: number, grid: ArrayLike<any>,
        options: Matter.IBodyDefinition = {}, gridScale = 1, chunkSize = 16) {

        super(null);
        options.isStatic ??= true;

        let bodyOffset = { x: 0, y: 0 };
        if (options.position) {
            bodyOffset = options.position;
            options.position = { x: 0, y: 0 };
        }

        this.x = bodyOffset.x;
        this.y = bodyOffset.y;
        this.width = width;
        this.height = height;
        this.gridScale = gridScale;
        this.options = options;
        this.chunkSize = chunkSize;

        this.buildBody(grid);
    }

    buildBody(grid: ArrayLike<any>, minX = 0, minY = 0, maxX = Infinity, maxY = Infinity) {
        if (this.static) {
            this.buildParts(grid, minX, minY, maxX, maxY);

            Matter.Body.translate(this.body, {
                x: this.body.bounds.min.x + this.x,
                y: this.body.bounds.min.y + this.y
            });
        } else {
            let angle = this.options.angle ?? 0;
            if (this.body !== undefined) {
                angle = this.body.angle;
                Matter.Body.setAngle(this.body, 0);
            }
            this.buildParts(grid, minX, minY, maxX, maxY);
            Matter.Body.setAngle(this.body, angle);
            Matter.Body.setPosition(this.body, { x: this.x, y: this.y });
        }
    }

    get static() {
        if (this.body === undefined) {
            return this.options.isStatic as boolean;
        }
        return this.body.isStatic;
    }

    private buildParts(grid: ArrayLike<any>, minX: number, minY: number, maxX: number, maxY: number) {
        const
            startX = Math.max(0, minX),
            startY = Math.max(0, minY),
            endX = Math.min(this.width, maxX),
            endY = Math.min(this.height, maxY);

        const stripMap: Map<number, { width: number, height: number }> = new Map();

        // build grid into strips
        for (let y = startY; y < endY; y++) {
            let runStart: number | undefined = undefined;
            for (let x = startX; x < endX; x++) {
                if (!!grid[x + y * this.width]) {
                    if (runStart === undefined) {
                        runStart = x;
                    }
                } else {
                    if (runStart !== undefined) {
                        stripMap.set(runStart + y * this.width,
                            { width: x - runStart, height: 1 });
                        runStart = undefined;
                    }
                }
            }
            if (runStart !== undefined) {
                stripMap.set(runStart + y * this.width,
                    { width: endX - runStart, height: 1 });
            }
        }

        // combine stips width matching ends on adjacent rows 
        for (const [key, strip] of stripMap.entries()) {
            let combineStripKey = key;

            while (true) {
                combineStripKey += this.width;

                const combineStrip = stripMap.get(combineStripKey);
                if (combineStrip === undefined || combineStrip.width !== strip.width) break;

                strip.height += combineStrip.height;
                stripMap.delete(combineStripKey);
            }
        }

        const parts: InternalMatterBody[] = [];

        for (const [key, strip] of stripMap.entries()) {
            const
                x = key % this.width,
                y = Math.floor(key / this.width);

            const scaleProduct = this.gridScale * spaceScale;
            const part = createRectBodyFast(x * scaleProduct, y * scaleProduct,
                strip.width * scaleProduct, strip.height * scaleProduct) as InternalMatterBody;
            part.__brassBody__ = this;
            parts.push(part);
        }

        this.options.parts = parts;
        const body = Matter.Body.create(this.options);
        this.setBody(body);
    }
}

function createRectBodyFast(x: number, y: number, width: number, height: number) {
    const body = {
        id: Matter.Common.nextId(),
        type: "body",
        label: "rectBody",
        plugin: {},
        parts: [],
        angle: 0,
        vertices: [
            { x: -width * 0.5, y: -height * 0.5, index: 0, isInternal: false },
            { x: width * 0.5, y: -height * 0.5, index: 1, isInternal: false },
            { x: width * 0.5, y: height * 0.5, index: 2, isInternal: false },
            { x: -width * 0.5, y: height * 0.5, index: 3, isInternal: false }
        ],
        position: { x: x + width * 0.5, y: y + height * 0.5 },
        force: { x: 0, y: 0 },
        torque: 0,
        positionImpulse: { x: 0, y: 0 },
        constraintImpulse: { x: 0, y: 0, angle: 0 },
        totalContacts: 0,
        speed: 0,
        angularSpeed: 0,
        velocity: { x: 0, y: 0 },
        angularVelocity: 0,
        isSensor: false,
        isStatic: false,
        isSleeping: false,
        motion: 0,
        sleepThreshold: 60,
        density: 0.001,
        restitution: 0,
        friction: 0.1,
        frictionStatic: 0.5,
        frictionAir: 0.01,
        collisionFilter: {
            category: 0x0001,
            mask: 0xFFFFFFFF,
            group: 0
        },
        slop: 0.05,
        timeScale: 1,
        circleRadius: 0,
        positionPrev: { x: x + width * 0.5, y: y + height * 0.5 },
        anglePrev: 0,
        area: 0,
        mass: 0,
        inertia: 0,
        _original: null
    } as unknown as Matter.Body;

    body.parts = [body];
    body.parent = body;

    Matter.Body.set(body, {
        bounds: Matter.Bounds.create(body.vertices),
        vertices: body.vertices,
    });

    Matter.Bounds.update(body.bounds, body.vertices, body.velocity);

    return body;
}

export class RayBody extends BodyAbstract {
    private id = Symbol();

    position: Vector2;
    velocity: Vector2;

    private width: number;
    private mask: CollisionFitlerMask;

    constructor(x: number, y: number, width: number = 0.1, options: { velocity?: Vertex2, mask?: number }) {
        super();
        this.position = new Vector2(x, y);
        this.velocity = Vector2.fromObj(options.velocity ?? { x: 0, y: 0 });
        this.width = width;
        this.mask = this.validateCollisionMask(options.mask ?? 0xFFFFFFFF);

        rays.set(this.id, this);
    }

    get angle() {
        throw Error("RayBody can't have rotation");
        return 0;
    }

    get angularVelocity() {
        throw Error("RayBody can't have rotation");
        return 0;
    }

    get static() {
        return false;
    }

    get ghost() {
        return true;
    }

    set angle(_: number) {
        throw Error("RayBody can't have rotation");
    }

    set angularVelocity(_: number) {
        throw Error("RayBody can't have rotation");
    }

    set static(isStatic: boolean) {
        if (isStatic === true) {
            throw Error("RayBody can't have static behaviour enabled");
        }
    }

    set ghost(isGhost: boolean) {
        if (isGhost === false) {
            throw Error("RayBody can't have ghost behaviour disabled");
        }
    }

    set collisionCategory(_: number) { }

    set collidesWith(category: number | number[]) {
        if (Array.isArray(category)) {
            category.map((subCategory) => this.setCollidesWith(subCategory));
        } else {
            this.setCollidesWith(category);
        }
    }

    private setCollidesWith(category: number) {
        this.validateCollisionIndex(category);

        if (category < 0) {
            // unsets mask bit of category
            this.mask = (this.mask & (~(1 << -category))) as CollisionFitlerMask;
        } else {
            // sets mask bit of category
            this.mask = (this.mask | 1 << category) as CollisionFitlerMask;
        }

        return this;
    }

    rotate(_: number) {
        throw Error("RayBody can't have rotation");
        return this;
    }

    applyForce() { return this; }

    destroy() {
        rays.delete(this.id);
    }

    cast(delta: number, real = false, roughDistance = false, maxSteps = 20): {
        point: Vector2; progress: number; body: MaterialBodyAbstract | null, hit: boolean;
    } {
        const start = this.position;
        const end = Matter.Vector.add(this.position, Matter.Vector.mult(this.velocity, delta));

        const candidates: MaterialBodyAbstract[] = [];

        for (let i = 0; i < 32; i++) {
            if (!(this.mask & (1 << i))) continue;
            candidates.concat(...bodies[i as CollisionFilterIndex].values());
        }

        const candidateBodies = candidates.map((candidate) => candidate.body);

        const matterStart = Matter.Vector.create(start.x * spaceScale, start.y * spaceScale);
        let testJump = 0.25, testProgress = 0.5;
        let hits: Matter.ICollision[] = [];
        let testPoint: Vector2 | null = null;

        for (let i = 0; i < maxSteps; i++) {
            testPoint = new Vector2(start.x, start.y).mix(end, testProgress);
            const matterTestPoint = Matter.Vector.create(testPoint.x * spaceScale, testPoint.y * spaceScale);
            hits = Matter.Query.ray(candidateBodies, matterStart, matterTestPoint, this.width * spaceScale);

            if (hits.length < 1) {
                testProgress += testJump;
            } else if (hits.length === 1 && roughDistance) {
                break;
            } else {
                testProgress -= testJump;
            }
            testJump *= 0.5;
        }

        if (real) this.position = Vector2.fromObj(end);

        return {
            point: testPoint ?? start,
            progress: testProgress,
            body: (hits[0]?.bodyA as InternalMatterBody).__brassBody__ ?? null,
            hit: hits.length > 0
        }
    }
}