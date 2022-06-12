let lastUpdateTime = 0; update();



export function update() {
	lastUpdateTime = Math.round(getExactTime());
}

export function getTime() {
	return lastUpdateTime;
}

export function getExactTime() {
	return window.performance.now();
}