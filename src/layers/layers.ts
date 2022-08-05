/**
 * Very flexible targets for drawing operations.
 * Useable with both p5.js and REGL graphics.
 * @module
 */

import p5 from "p5";
import { getSketch } from "../core/sketch";
import { CanvasDrawTarget, CanvasLayer, getDefaultCanvasDrawTarget } from "./canvasLayers";
import { DrawTarget, getDrawTarget, resize, setDrawTarget, syncDefaultDrawTargetWithSketch } from "./drawTarget";
import { init as initRegl } from "./handleRegl";
import { P5DrawTarget, P5Layer, getDefaultP5DrawTarget } from "./p5Layers";



export function init(doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<{ [key: string]: unknown }>) {
	initDefaultDrawTarget(doRegl, drawTarget);

	const defaultDrawTarget = getDrawTarget("default");

	addDrawTargetElement(defaultDrawTarget);

	if (doRegl) initRegl(getDefaultCanvasDrawTarget());
}

function initDefaultDrawTarget(doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<{ [key: string]: unknown; }>) {
	if (drawTarget === undefined) {
		const sketch = getSketch();

		sketch.createCanvas(windowWidth, windowHeight);

		const drawTarget = new P5DrawTarget(undefined, sketch);
		setDrawTarget("default", drawTarget);
		setDrawTarget("defaultP5", drawTarget);
	} else {
		noCanvas();
		if (drawTarget instanceof DrawTarget) {
			setDrawTarget("default", drawTarget);
			if (drawTarget instanceof P5DrawTarget) {
				setDrawTarget("defaultP5", drawTarget);
			}
			if (drawTarget instanceof CanvasDrawTarget) {
				setDrawTarget("defaultCanvas", drawTarget);
			}
			// @ts-ignore because p5.Graphics is typed wrong
		} else if (drawTarget instanceof p5.Graphics) {
			const p5DrawTarget = new P5DrawTarget(undefined, drawTarget);
			setDrawTarget("default", p5DrawTarget);
			setDrawTarget("defaultP5", p5DrawTarget);
		} else {
			throw Error("Can't make default drawTarget in Brass.init(), bad value");
		}
	}
	
	resize();

	syncDefaultDrawTargetWithSketch();
}

function addDrawTargetElement(drawTarget: P5DrawTarget | CanvasDrawTarget) {
	let htmlCanvas: HTMLCanvasElement | undefined;
	if (drawTarget instanceof P5DrawTarget) {
		htmlCanvas = drawTarget.getMaps().canvas
			// @ts-ignore
			.canvas;
	}
	if (drawTarget instanceof CanvasDrawTarget) {
		htmlCanvas = drawTarget.getMaps().canvas;
	}

	if (htmlCanvas) {
		const sketch = getSketch();

		// @ts-ignore
		if (sketch._userNode) {
			// @ts-ignore
			sketch._userNode.appendChild(htmlCanvas);
		} else {
			// create main element
			if (document.getElementsByTagName("main").length === 0) {
				const main = document.createElement("main");
				document.body.appendChild(main);
			}
			// append canvas to main
			document.getElementsByTagName("main")[0].appendChild(htmlCanvas);
		}
		htmlCanvas.style.display = "block";
		return true;
	} else {
		return false;
	}
}

export function drawCanvasToP5(p5Target: P5Layer = getDefaultP5DrawTarget(), canvasTarget: CanvasLayer = getDefaultCanvasDrawTarget()) {
	const p5Canvas = p5Target.getMaps().canvas;
	const canvasCanvas = canvasTarget.getMaps().canvas;
	p5Canvas.drawingContext.drawImage(canvasCanvas, 0, 0, p5Canvas.width, p5Canvas.height);
}
