import REGL from "../../externalTypes/regl";
import { assert } from "../common/runtimeChecking";
import { DrawTarget } from "./drawTarget";



let regl: REGL.Regl | null = null;
let doReglRefresh = false;



export function init(drawTarget: DrawTarget<{ canvas: HTMLCanvasElement }>) {
	if (typeof createREGL !== "function") {
		throw Error("REGL was not found; Can't initialize Brass REGL without REGL.js loaded first");
	}

	const canvas = drawTarget.getMaps().canvas;
	regl = createREGL({ canvas });
}


export function getRegl(): REGL.Regl {
	assert(regl !== null,
		"Could not access regl; Include regl.js and enable it in Brass.init() first");
	return regl;
}

export function refreshRegl() {
	const regl = getRegl();
	regl._refresh();
}

export function refreshReglFast() {
	getRegl(); // check regl is enabled
	if (doReglRefresh)
		return;
	doReglRefresh = true;
	queueMicrotask(honorReglRefresh);
}

export function honorReglRefresh() {
	if (!doReglRefresh)
		return;
	const regl = getRegl();
	regl._refresh();
	doReglRefresh = false;
}