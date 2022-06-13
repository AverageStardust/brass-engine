import p5 from "p5";
import { init as initLoader, loaded } from "./loader";
import { init as initViewpoint, updateViewpoints, ViewpointAbstract } from "./viewpoint";
import { DrawTarget, init as initDrawTarget, resize } from "./drawTarget";
import { deltaSimTime, update as updateTime } from "./time";
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
	sketch?: p5;
	drawTarget?: p5.Graphics | DrawTarget<any>;
	viewpoint?: ViewpointAbstract;

	maxTimeDelta?: number;

	sound?: boolean;
	matter?: boolean | Partial<Matter.IEngineDefinition>;
	regl?: boolean;
}



let inited = false;
let testStatus: true | string | null = null;
let sketch: p5;
let maxTimeDelta = 100;
const timeWarpList: Timewarp[] = [];
let runningPhysics = false;



window.addEventListener("load", () => {
	window.addEventListener("error", (error) => setTestStatus(error.message));
});

export function setTestStatus(newStatus: boolean | string) {
	if (newStatus === false) return;
	if (typeof testStatus === "string") return;
	testStatus = newStatus;
}

export function getTestStatus() {
	return testStatus;
}

export function init(options: InitOptions = {}) {
	if (options.sound === undefined && p5.SoundFile !== undefined) {
		console.warn("p5.sound.js has been found; Enable or disable sound in Brass.init()");
	}
	if (options.matter === undefined && globalThis.Matter !== undefined) {
		console.warn("matter.js has been found; Enable or disable matter in Brass.init()");
	}
	if (options.regl === undefined && globalThis.createREGL !== undefined) {
		console.warn("regl.js has been found; Enable or disable regl in Brass.init()");
	}

	if (options.sketch) {
		sketch = options.sketch;
	} else {
		if (!("p5" in globalThis)) {
			throw Error("Can't find p5.js, it is required for Brass");
		}
		if (!("setup" in globalThis)) {
			throw Error("Can't seem to find p5; If you are running in instance mode pass the sketch into Brass.init()");
		}
		sketch = globalThis as unknown as p5;
	}

	initDrawTarget(sketch, options.regl ?? false, options.drawTarget);

	initViewpoint(options.viewpoint);

	maxTimeDelta = options.maxTimeDelta ?? (1000 / 30);
	updateTime();

	initLoader(options.sound ?? false);

	runningPhysics = options.matter !== undefined;
	if (runningPhysics) {
		if (typeof options.matter === "object") {
			initPhysics(options.matter);
		} else {
			initPhysics();
		}
	}

	if (sketch.draw === undefined) {
		sketch.draw = defaultGlobalDraw;
	}

	if (sketch.windowResized === undefined) {
		sketch.windowResized = () => resize(window.innerWidth, window.innerHeight);
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

	let realDelta = Math.min(maxTimeDelta, deltaTime),
		simDelta = 0;

	// move realDelta into simDelta with timeWarp rates accounted
	while (timeWarpList.length > 0) {
		const warpedTime = Math.min(
			realDelta,
			timeWarpList[0].duration);

		realDelta -= warpedTime;
		simDelta += warpedTime * timeWarpList[0].rate;

		timeWarpList[0].duration -= warpedTime;

		if (timeWarpList[0].duration <= 0) timeWarpList.shift();
		else break;
	}

	// move leftover realDelta into simDelta
	simDelta += realDelta;

	// update simulation time
	deltaSimTime(simDelta);

	// @ts-ignore because this is outside of Brass engine and can't be type checked
	if (sketch.brassUpdate !== undefined) sketch.brassUpdate(simDelta);
	update(simDelta);

	// @ts-ignore because this is outside of Brass engine and can't be type checked
	if (sketch.brassDraw !== undefined) sketch.brassDraw(simDelta);
}

export function update(delta?: number) {
	enforceInit("updating Brass");

	if (delta === undefined) {
		delta = Math.min(maxTimeDelta, deltaTime);
	}

	updateTime();
	if (runningPhysics) updatePhysics(delta);
	updateViewpoints(delta);
	updateTilemaps();
	updatePathfinders();
	updateParticles(delta);
}

export function timeWarp(duration: number, rate = 0) {
	timeWarpList.push({ duration, rate });
}

export function getTimeWarp(): Timewarp | undefined {
	if (timeWarpList.length === 0) return { duration: Infinity, rate: 1 };
	return timeWarpList[0];
}

export function getTimeWarps(): Timewarp[] {
	return timeWarpList;
}