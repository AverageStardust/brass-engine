import REGL from "../../globalTypes/regl";
import { assert } from "../common/runtimeChecking";
import { getCanvasDrawTarget } from "./canvasLayers";
import { getDrawTarget } from "./drawTarget";
import { getP5DrawTarget } from "./p5Layers";



let regl: REGL.Regl | null = null;
let doReglRefresh = false;



export function init() {
	const defaultReglTarget = getDrawTarget("defaultRegl");
	const canvas = defaultReglTarget.getMaps().canvas;
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