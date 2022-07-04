/**
 * Draws the loading screen and frame-rate counter.
 * @module
 */

import { getP5DrawTarget } from "../drawSurface";
import { loadFraction, loadProgress } from "../loader";
import { getTime } from "../time";



const frameRateList: number[] = [];

let loadingScreenHue: number;
let loadingTips: string[];
let loadingTipIndex: number;
let loadingTipEndTime: number;


loadingScreenHue = Math.random() * 360;
setLoadingTips(["...loading"]);



export function setLoadingTips(tips: string[]) {
	if (tips.length === 0) {
		loadingTips = [""];
	} else {
		loadingTips = tips;
	}

	pickLoadingTip();
}

function pickLoadingTip() {
	let newTipIndex = Math.floor(Math.random() * loadingTips.length);

	if (loadingTips.length > 1) {
		while (loadingTipIndex === newTipIndex) {
			newTipIndex = Math.floor(Math.random() * loadingTips.length);
		}
	}

	loadingTipIndex = newTipIndex;

	loadingTipEndTime = getTime() +
		loadingTips[loadingTipIndex].length * 50 + 1500;
}



export function drawFPS(d = getP5DrawTarget("defaultP5")) {
	const g = d.getMaps().canvas;
	g.push();
	g.resetMatrix();

	g.stroke(0);
	g.fill(0, 127);
	g.rect(5.5, 5.5, 140, 70);

	g.noStroke();
	g.fill(0, 127);
	g.rect(10.5, 10.5, 59, 60);

	const rateList = frameRateList;

	const currentFPS = frameRate();

	if (currentFPS > 0) rateList.push(currentFPS);
	if (rateList.length > 30) rateList.shift();

	let minFPS = Infinity,
		averageFPS = 0,
		maxFPS = -Infinity;

	g.noStroke();
	for (let i = 0; i < rateList.length; i++) {
		const fps = rateList[i];

		minFPS = Math.min(fps, minFPS);
		averageFPS += fps;
		maxFPS = Math.max(fps, maxFPS);

		if (fps > 45) {
			g.fill(0, 220, 0);
		} else if (fps >= 22.5) {
			g.fill(255, 255, 0);
		} else {
			g.fill(255, 0, 0);
		}
		g.rect(10 + i * 2, 70 - fps, 2, fps);
	}

	averageFPS /= rateList.length;

	if (rateList.length > 0) {
		g.textSize(12);
		g.textAlign(LEFT, TOP);
		g.fill(255);
		g.noStroke();

		g.text(`Min: ${minFPS.toPrecision(3)}`, 82, 13);
		g.text(`Avg: ${averageFPS.toPrecision(3)}`, 81, 28);
		g.text(`Max: ${maxFPS.toPrecision(3)}`, 79, 43);
		g.text(`Now: ${currentFPS.toPrecision(3)}`, 78, 58);
	}

	g.pop();
}

export function drawLoading(d = getP5DrawTarget("defaultP5")) {
	const g = d.getMaps().canvas;
	g.push();
	g.resetMatrix();

	g.colorMode(HSL);

	g.background(loadingScreenHue, 60, 20);

	// percentage
	const str = `${loadFraction()} (${(Math.floor(loadProgress() * 100))}%)`;

	const strSize = Math.min(g.width, g.height) * 0.1;
	g.textSize(strSize);
	g.textAlign(CENTER, CENTER);
	g.textStyle(BOLD);
	g.noStroke();

	const offHue = (loadingScreenHue + 180) % 360;

	g.fill(offHue, 100, 10);
	g.text(str, g.width * 0.5 + strSize * 0.05, g.height * 0.3 + strSize * 0.05);

	g.fill(offHue, 70, 60);
	g.text(str, g.width * 0.5 - strSize * 0.05, g.height * 0.3 - strSize * 0.05);

	// loading tips
	g.textAlign(CENTER, TOP);
	g.textStyle(NORMAL);
	g.textSize(strSize * 0.6);

	if (loadingTipEndTime < getTime()) {
		pickLoadingTip();
	}
	const tip = loadingTips[loadingTipIndex];

	g.fill(offHue, 100, 10);
	g.text(tip,
		g.width * 0.05 + strSize * 0.03, g.height * 0.65 + strSize * 0.03,
		width * 0.9, Infinity);

	g.fill(offHue, 70, 60);
	g.text(tip,
		g.width * 0.05 - strSize * 0.03, g.height * 0.65 - strSize * 0.03,
		width * 0.9, Infinity);

	// loading bar
	g.strokeWeight(Math.min(g.width, g.height) * 0.1);

	g.stroke(offHue, 100, 10);
	g.line(g.width * 0.1, g.height * 0.5, g.width * 0.9, g.height * 0.5);

	g.strokeWeight(Math.min(g.width, g.height) * 0.08);

	g.stroke(offHue, 70, 60);
	g.line(g.width * 0.1, g.height * 0.5,
		g.width * 0.1 + g.width * 0.8 * loadProgress(), g.height * 0.5);

	g.pop();
}