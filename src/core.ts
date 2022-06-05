import p5 from "p5";
import { Vector2 } from "./vector3";
import { init as initLoader, loaded } from "./loader";
import { setDefaultViewpoint, ClassicViewpoint, updateViewpoints, ViewpointAbstract } from "./viewpoint";
import { DrawTargetAbstract, resize as resizeDrawTargets, init as initDrawTarget } from "./drawTarget";
import { update as updateTime } from "./time";
import { drawLoading } from "./ui";
import { update as updateParticles } from "./particle";
import { update as updatePathfinders } from "./pathfinder";
import { init as initPhysics, update as updatePhysics } from "./physics";
import { update as updateTilemaps } from "./tilemap";


interface Timewarp {
    duration: number;
    rate: number;
}

interface InitOptions {
    drawTarget?: DrawTargetAbstract | p5.Graphics;
    viewpoint?: ViewpointAbstract;

    maxTimeDelta?: number;

    sound?: boolean;
    matter?: boolean | Partial<Matter.IEngineDefinition>;
}



let inited = false;
let runningPhysics = false;
let maxTimeDelta = 100;
const timewarpList: Timewarp[] = [];



export function init(options: InitOptions = {}) {
    initDrawTarget(options.drawTarget);

    if (options.viewpoint === undefined) {
        setDefaultViewpoint(new ClassicViewpoint(1, new Vector2(width / 2, height / 2)));
    } else {
        setDefaultViewpoint(options.viewpoint);
    }

    maxTimeDelta = options.maxTimeDelta ?? (1000 / 30);
    updateTime();

    const useSound = options.sound ?? p5.SoundFile !== undefined;
    initLoader(useSound);

    if (options.matter ||
        globalThis.Matter !== undefined) {
        runningPhysics = true;
        if(typeof options.matter === "object") {
            initPhysics(options.matter);
        } else {
            initPhysics();
        }
    }

    if (!("draw" in globalThis)) {
        if ("brassUpdate" in globalThis && "brassDraw" in globalThis) {
            // @ts-ignore because this is outside of the Brass engine and its type-checking
            globalThis.draw = defaultGlobalDraw;
        } else {
            throw Error("Brass Core has filled the place of the global draw() function but was expecting to see brassUpdate() and brassDraw() instead");
        }
    }

    inited = true;
}

function enforceInit(action: string) {
    if (inited) return;
    throw Error(`Brass must be initialized before ${action}; Run Brass.init()`);
}

function defaultGlobalDraw() {
    if (!loaded()) {
        drawLoading();
        return;
    }

    let realTime = Math.min(maxTimeDelta, deltaTime),
        simTime = 0;

    // move realTime into simTime with timewarp rates accounted
    while (timewarpList.length > 0) {
        const warpedTime = Math.min(
            realTime,
            timewarpList[0].duration);

        realTime -= warpedTime;
        simTime += warpedTime * timewarpList[0].rate;

        timewarpList[0].duration -= warpedTime;

        if (timewarpList[0].duration <= 0) timewarpList.shift();
        else break;
    }

    // move leftover realTime into simTime
    simTime += realTime;

    // @ts-ignore because this is outside of the Brass engine and its type-checking
    globalThis.brassUpdate(simTime);
    update(simTime);

    // @ts-ignore because this is outside of the Brass engine and its type-checking
    globalThis.brassDraw(simTime);
}

export function resize(width: number, height: number) {
    // may be called from windowResized(), just let bad call bass
    if (!inited) return;

    resizeDrawTargets(width, height);
}

export function update(delta?: number) {
    enforceInit("updating Brass");

    if (delta === undefined) {
        delta = Math.min(maxTimeDelta, deltaTime);
    }

    updateTime();
    if(runningPhysics) updatePhysics(delta);
    updateViewpoints(delta);
    updateTilemaps();
    updatePathfinders();
    updateParticles(delta);
}

export function timewarp(duration: number, rate = 0) {
    timewarpList.push({ duration, rate });
}