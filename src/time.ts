let lastUpdateTime = 0;
let simTime = 0;



update();



export function update() {
	lastUpdateTime = Math.round(getExactTime());
}

export function getTime() {
	return lastUpdateTime;
}

export function getExactTime() {
	return window.performance.now();
}

export function getSimTime() {
	return simTime;
}

export function deltaSimTime(delta: number) {
	simTime += delta;
}