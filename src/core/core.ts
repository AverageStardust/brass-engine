/**
 * Initializes Brass, interacts will the global namespace and controls updates.
 * @module
 */

import p5 from "p5";

import { init as initInput, update as updateInput } from "../inputMapper";
import { init as initLoader, loaded } from "../loader";
import { init as initViewpoint, update as updateViewpoints } from "../camera/camera";
import { init as initLayer } from "../layers/layers";
import { init as initSketch, getSketch } from "./sketch";
import { init as initPhysics, MatterWorldDefinition, update as updatePhysics } from "../physics/physics";
import { DrawTarget, resize, syncDefaultDrawTargetWithSketch } from "../layers/drawTarget";
import { ViewpointAbstract } from "../camera/viewpointAbstract";
import { deltaSimTime, update as updateTime } from "./time";
import { drawLoading } from "../ui/legacyUI";
import { update as updateEffects } from "../effects/effects";
import { update as updatePathfinders } from "../pathfinder/pathfinder";
import { update as updateTilemaps } from "../tilemap/tilemap";
import { getDefaultP5DrawTarget } from "../layers/p5Layers";



declare global {
	// internal p5.js value
	let _targetFrameRate: number;
}

interface Timewarp {
	duration: number;
	rate: number;
}

interface InitOptions {
	sketch?: p5;
	drawTarget?: p5.Graphics | DrawTarget<{ [key: string]: unknown }>;
	viewpoint?: ViewpointAbstract;

	maxFrameRate?: number;
	maxTimeDelta?: number;
	minTimeDelta?: number;

	sound?: boolean;
	matter?: boolean | MatterWorldDefinition;
	regl?: boolean;
}



let inited = false;
let testStatus: true | string | null = null;
let maxTimeDelta: number, targetTimeDelta: number, minTimeDelta: number;
const timewarpList: Timewarp[] = [];
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

	initSketch(options.sketch);

	initInput();

	initLayer(options.regl ?? false, options.drawTarget);

	initViewpoint(options.viewpoint);

	const targetFrameRate = Math.min(_targetFrameRate, options.maxFrameRate ?? 60);
	const sketch = getSketch();
	sketch.frameRate(targetFrameRate);
	targetTimeDelta = 1000 / targetFrameRate;
	maxTimeDelta = options.maxTimeDelta ?? targetTimeDelta * 2.0;
	minTimeDelta = options.minTimeDelta ?? targetTimeDelta * 0.5;

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
		sketch.draw = defaultSketchDraw;
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

function defaultSketchDraw() {
	if (!loaded()) {
		drawLoading();
		return;
	}

	let realDelta = deltaTime;
	realDelta = Math.min(maxTimeDelta, realDelta);
	realDelta = Math.max(minTimeDelta, realDelta);
	
	const simDelta = updateSimTiming(realDelta);

	updateEarly();

	const sketch = getSketch();

	if (sketch.brassUpdate !== undefined) sketch.brassUpdate(simDelta);

	updateLate(simDelta);

	if (sketch.brassDraw !== undefined) {
		syncDefaultDrawTargetWithSketch();
		getDefaultP5DrawTarget().getMaps().canvas.resetMatrix();
		sketch.brassDraw(simDelta);
	}
}

function updateSimTiming(realDelta: number) {
	let simDelta = 0;

	// move realDelta into simDelta with timewarp rates accounted
	while (timewarpList.length > 0) {
		const warpedTime = Math.min(
			realDelta,
			timewarpList[0].duration);

		realDelta -= warpedTime;
		simDelta += warpedTime * timewarpList[0].rate;

		timewarpList[0].duration -= warpedTime;

		if (timewarpList[0].duration <= 0) timewarpList.shift();
		else break;
	}

	// move leftover realDelta into simDelta
	simDelta += realDelta;

	// update simulation time
	deltaSimTime(simDelta);

	return simDelta;
}

export function update(delta: number = deltaTime) {
	enforceInit("updating Brass");

	updateEarly();
	updateLate(delta);
}

function updateEarly() {
	updateTime();
	updateInput();
}

function updateLate(delta: number) {
	enforceInit("updating Brass");

	if (runningPhysics) updatePhysics(delta);
	updateViewpoints(delta);
	updateTilemaps();
	updatePathfinders();
	updateEffects(delta);
}

export function timewarp(duration: number, rate = 0) {
	timewarpList.push({ duration, rate });
}

export function getTimewarp(): Timewarp | undefined {
	if (timewarpList.length === 0) return { duration: Infinity, rate: 1 };
	return timewarpList[0];
}

export function getTimewarps(): Timewarp[] {
	return timewarpList;
}