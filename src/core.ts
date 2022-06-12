import p5 from "p5";
import { init as initLoader, loaded } from "./loader";
import { init as initViewpoint, updateViewpoints, ViewpointAbstract } from "./viewpoint";
import { DrawTarget, init as initDrawTarget, resize } from "./drawTarget";
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
	sketch?: p5;
	drawTarget?: p5.Graphics | DrawTarget<any>;
	viewpoint?: ViewpointAbstract;

	maxTimeDelta?: number;

	sound?: boolean;
	matter?: boolean | Partial<Matter.IEngineDefinition>;
	regl?: boolean;
}



let inited = false;
let errorStatus: true | string | null = null;
let sketch: p5;
let maxTimeDelta = 100;
const timewarpList: Timewarp[] = [];
let runningPhysics = false;



window.addEventListener("load", () => {
	window.addEventListener("error", (error) => setTestStatus(error.message));
});

export function setTestStatus(status: boolean | string) {
	if (status === false) return;
	if (errorStatus !== null && errorStatus !== true) return;
	errorStatus = status;
}

export function getTestStatus() {
	return errorStatus;
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

	// @ts-ignore because this is outside of Brass engine and can't be type checked
	if (sketch.brassUpdate !== undefined) sketch.brassUpdate(simTime);
	update(simTime);

	// @ts-ignore because this is outside of Brass engine and can't be type checked
	if (sketch.brassDraw !== undefined) sketch.brassDraw(simTime);
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

export function timewarp(duration: number, rate = 0) {
	timewarpList.push({ duration, rate });
}