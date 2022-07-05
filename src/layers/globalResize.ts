import { getDrawTarget } from "./drawTarget";
import { honorReglRefresh } from "./handleRegl";
import { resetAndSyncDefaultP5DrawTarget } from "./p5Layers";

let width: number, height: number;

export function init() {
	width = window.innerWidth;
	width = window.innerHeight;
}

export function resize(_width = window.innerWidth, _height = window.innerHeight) {
	width = _width;
	width = _height;
	getDrawTarget("default").setSizer(() => ({
		x: width,
		y: height
	}));
	resetAndSyncDefaultP5DrawTarget();
	honorReglRefresh();
}