import p5 from "p5";
import { defaultDrawTarget, DrawTarget } from "./drawTarget";
import { getTime } from "./time";
import { ColorArgs, createColor, createFastGraphics } from "./common";
import { Vector2 } from "./vector3";



interface AbstractViewpointOptions {
    integerTranslation?: boolean;
    integerScaling?: boolean;

    shapeSpeed?: number;
    lightResolution?: number;
    lightBlur?: number;
}

interface ViewpointOptions extends AbstractViewpointOptions {
    jump?: number;
    follow?: number;
    drag?: number;
    outrun?: number;
}



export let defaultViewpoint: ViewpointAbstract;
const viewpointList: ViewpointAbstract[] = [];



export function updateViewpoints(delta: number) {
    for (const viewpoint of viewpointList) {
        viewpoint.update(delta);
    }
}

export function earlyResizeViewpoints(g = defaultDrawTarget) {
    for (const viewpoint of viewpointList) {
        viewpoint.earlyResizeLightMap(g);
    }
}

export function lateResizeViewpoints(g = defaultDrawTarget) {
    for (const viewpoint of viewpointList) {
        viewpoint.lateResizeLightMap(g);
    }
}

export function setDefaultViewport(viewport: ViewpointAbstract) {
    if (defaultViewpoint !== undefined) {
        throw Error("Found more than one default viewpoint");
    }
    defaultViewpoint = viewport;
}


export abstract class ViewpointAbstract {
    scale: number
    translation: Vector2

    private integerTranslation: boolean;
    private integerScaling: boolean;

    private shakeSpeed: number;
    private shakeStrength = 0;
    private shakeDecay = 0;
    private shakePosition: Vector2;

    private _lightMap: p5.Graphics | null = null;
    private lightResolution: number;
    private lightBlur: number;
    private lightColor: p5.Color;
    private lightAdditive = true;

    constructor(scale: number, translation: Vector2, options: AbstractViewpointOptions = {}) {
        // camera
        this.scale = scale;
        this.translation = translation;

        this.integerTranslation = options.integerTranslation ?? true;
        this.integerScaling = options.integerScaling ?? false;

        // shake
        this.shakeSpeed = options.shapeSpeed ?? 0.015;
        this.shakePosition = new Vector2();

        // lighting
        this.lightResolution = options.lightResolution ?? 0.25;
        if (options.lightBlur !== undefined) {
            this.lightBlur = options.lightBlur;
        } else {
            this.lightBlur = 1;
        }

        this.lightColor = color(255);

        viewpointList.push(this);
    }

    // camera
    abstract update(delta: number): void;

    view(g = defaultDrawTarget) {
        const screenCenter = this.getEffectiveScreenCenter(g);
        g.translate(screenCenter.x, screenCenter.y);

        g.scale(this.effectiveScale);

        const translation = this.effectiveTranslation;
        g.translate(-translation.x, -translation.y);

        g.translate(-this.shakePosition.x, -this.shakePosition.y);
    }

    getViewArea(g = defaultDrawTarget) {
        const translation = this.effectiveTranslation;
        const edgeDistance = this.getEffectiveScreenCenter(g)
            .divScalar(this.effectiveScale);

        return {
            minX: translation.x - edgeDistance.x,
            maxX: translation.x + edgeDistance.x,
            minY: translation.y - edgeDistance.y,
            maxY: translation.y + edgeDistance.y
        };
    }

    traslateScreen(screenTranslation: Vector2) {
        const worldTraslation = screenTranslation.copy().divScalar(this.effectiveScale);
        this.translation.add(worldTraslation);
    }

    screenToWorld(screenCoord: Vector2, g = defaultDrawTarget) {
        const coord = screenCoord.copy();

        const screenCenter = this.getEffectiveScreenCenter(g);
        coord.sub(screenCenter);

        coord.divScalar(this.effectiveScale);

        const translation = this.effectiveTranslation;
        coord.add(translation);

        coord.add(this.shakePosition);

        return coord;
    }

    private getEffectiveScreenCenter(g = defaultDrawTarget) {
        if (this.integerTranslation) {
            return new Vector2(Math.round(g.width / 2), Math.round(g.height / 2));
        }

        return new Vector2(g.width / 2, g.height / 2);
    }

    private get effectiveTranslation() {
        if (this.integerTranslation) {
            return this.translation.copy()
                .multScalar(this.scale).round()
                .divScalar(this.scale);
        }

        return this.translation.copy();
    }

    private get effectiveScale() {
        if (this.integerScaling) {
            if (this.scale > 1) {
                return Math.round(this.scale);
            } else {
                return 1 / Math.round(1 / this.scale);
            }
        }

        return this.scale;
    }

    // shake
    shake(strength: number, duration = 1000) {
        this.shakeStrength += strength;
        this.shakeDecay += strength / duration;
    }

    protected updateShake(delta: number) {
        this.shakeStrength -= this.shakeDecay * delta;

        if (this.shakeStrength <= 0) {
            this.shakeStrength = 0;
            this.shakeDecay = 0;
        }

        this.shakePosition.x =
            noise(8104, getTime() * this.shakeSpeed * 2) * 0.3 +
            noise(9274, getTime() * this.shakeSpeed / 2) * 0.7;
        this.shakePosition.y =
            noise(5928, getTime() * this.shakeSpeed * 2) * 0.3 +
            noise(2395, getTime() * this.shakeSpeed / 2) * 0.7;
        this.shakePosition.subScalar(0.5).multScalar(this.shakeStrength);
    }

    // light
    beginLight(g = defaultDrawTarget) {
        const size = this.getLightMapSize(g);

        if (this._lightMap === null) {
            this._lightMap = createFastGraphics(size.x, size.y);
            this.setLightMapColor(this.lightColor);
        } else {
            this.resizeLightMap();
        }

        this.resetLightMap();
        this.scale *= this.lightResolution;
        this.view(this.lightMap);
        this.scale /= this.lightResolution;
    }

    blur(value: number) {
        this.lightBlur = value;

        if (this.lightAdditive) {
            this.light(this.lightColor);
        } else {
            this.shadow(this.lightColor);
        }
    }

    light(...colArgs: ColorArgs) {
        this.lightMap.blendMode(ADD);
        this.lightAdditive = true;
        this.setLightMapColor(...colArgs);

    }

    shadow(...colArgs: ColorArgs) {
        this.lightMap.blendMode(DIFFERENCE);
        this.lightAdditive = false;
        this.setLightMapColor(...colArgs);

    }

    pointLight(x: number, y: number, r: number) {
        this.lightMap.circle(x, y, r * 2);
    }

    coneLight(x: number, y: number, angle: number, width = HALF_PI, distance = 1000) {
        this.lightMap.triangle(x, y,
            x + Math.cos(angle - width / 2) * distance,
            y + Math.sin(angle - width / 2) * distance,
            x + Math.cos(angle + width / 2) * distance,
            y + Math.sin(angle + width / 2) * distance);
    }

    endLight(g = defaultDrawTarget) {
        g.push();
        g.resetMatrix();

        g.blendMode(MULTIPLY);
        g.image(this.lightMap, 0, 0, width, height);

        g.pop();
    }

    resizeLightMap(g = defaultDrawTarget) {
        this.earlyResizeLightMap(g);
        this.lateResizeLightMap(g);
    }

    earlyResizeLightMap(g = defaultDrawTarget) {

    }

    lateResizeLightMap(g = defaultDrawTarget) {
        if (this._lightMap === null) return;

        const size = this.getLightMapSize();

        if (this._lightMap.width === size.x &&
            this._lightMap.height === size.y) return;

        this._lightMap.resizeCanvas(size.x, size.y, true);
    }

    private getLightMapSize(g = defaultDrawTarget) {
        return {
            x: Math.ceil(g.width * this.lightResolution),
            y: Math.ceil(g.height * this.lightResolution)
        };
    }

    private setLightMapColor(...colArgs: ColorArgs) {
        const col = createColor(...colArgs);

        this.lightMap.fill(col);

        const ctx = this.lightMap.drawingContext;

        if (this.lightBlur > 0) {
            ctx.shadowBlur = this.lightBlur * this.scale * this.lightResolution;
            const r = red(col), g = green(col), b = blue(col);
            ctx.shadowColor = `rgb(${r},${g},${b})`;
        } else {
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        }

        this.lightColor = col;
    }

    private resetLightMap() {
        this.lightMap.push();
        this.lightMap.blendMode(BLEND);
        this.lightMap.background(0);
        this.lightMap.pop();

        this.lightMap.resetMatrix();
    }

    private get lightMap() {
        if (this._lightMap !== null) return this._lightMap;
        throw Error(`Viewpoint.begenLight() must be ran before using lighting`);
    }
}



export class StaticViewpoint extends ViewpointAbstract {
    constructor(scale = 100, translation = new Vector2(), options: ViewpointOptions = {}) {
        super(scale, translation, options);
    }

    update(delta: number) { }

    earlyResizeLightMap(g = defaultDrawTarget) {
        this.traslateScreen(new Vector2(g.width / -2, g.height / -2));
        super.earlyResizeLightMap(g);
    }

    lateResizeLightMap(g = defaultDrawTarget) {
        this.traslateScreen(new Vector2(g.width / 2, g.height / 2));
        super.lateResizeLightMap(g);
    }
}



export class Viewpoint extends ViewpointAbstract {

    private velocity: Vector2;
    private _target: Vector2;
    private previousTarget: Vector2;

    private readonly jump: number;
    private readonly follow: number;
    private readonly drag: number;
    private readonly outrun: number;

    constructor(scale = 100, translation = new Vector2(), options: ViewpointOptions = {}) {
        super(scale, translation, options);

        this.velocity = new Vector2();
        this._target = this.translation.copy();
        this.previousTarget = this._target.copy();

        // follow settings
        if ("follow" in options ||
            "drag" in options ||
            "outrun" in options) {
            // complex template
            this.jump = options.jump ?? 0;
            this.follow = options.follow ?? 0.001;
            this.drag = options.drag ?? 0.1;
            this.outrun = options.outrun ?? 0;
        } else {
            // simple template with only jump
            this.jump = options.jump ?? 0.1;
            this.follow = 0;
            this.drag = 0;
            this.outrun = 0;
        }
    }

    update(delta: number) {
        const targetVelocity = this.target.copy().sub(this.previousTarget);

        // drag
        this.velocity.multScalar(Math.pow(1 - this.drag, delta));

        // follow
        const difference = this.target.copy().sub(this.translation);
        this.velocity.add(difference.copy().multScalar(this.follow * delta));

        // outrun
        this.velocity.add(targetVelocity.copy().multScalar(this.outrun * delta));

        // jump (this math feels very wrong, but it works)
        const frameJump = Math.pow(this.jump + 1, Math.pow(delta, this.jump));
        this.translation.add(this.target.copy().multScalar(frameJump - 1));
        this.translation.divScalar(frameJump);

        // velocity
        this.translation.add(this.velocity);

        this.previousTarget = this.target.copy();

        this.updateShake(delta);
    }

    set target(value) {
        this._target = value;
    }

    get target() {
        return this._target;
    }
}