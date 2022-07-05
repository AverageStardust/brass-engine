/**
 * Very flexible targets for drawing operations.
 * Useable with both p5.js and REGL graphics.
 * @module
 */

import p5 from "p5";
import { getSketch } from "../core/sketch";
import { CanvasDrawTarget, getCanvasDrawTarget } from "./canvasLayers";
import { DrawTarget, getDrawTarget, hasDrawTarget, resize, setDrawTarget, syncDefaultP5DrawTarget } from "./drawTarget";
import { init as initRegl } from "./handleRegl";
import { getP5DrawTarget, P5DrawTarget } from "./p5Layers";



export function init(doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<any>) {
	initDefaultDrawTarget(doRegl, drawTarget);

	const defaultDrawTarget = getDrawTarget("default");

	addDrawTargetElement(defaultDrawTarget);

	if (doRegl) {
		const drawTarget = getCanvasDrawTarget("defaultCanvas");
		initRegl(drawTarget);
	}
}

function initDefaultDrawTarget(doRegl: boolean, drawTarget?: p5.Graphics | DrawTarget<any>) {
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
				setDrawTarget("defaultRegl", drawTarget);
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

	if (doRegl) {
		const drawTarget = new CanvasDrawTarget();
		setDrawTarget("defaultRegl", drawTarget);
	}

	resize();

	if (hasDrawTarget("defaultP5")) {
		syncDefaultP5DrawTarget();
	}
}

function addDrawTargetElement(drawTarget: DrawTarget<any>) {
	let htmlCanvas: HTMLCanvasElement | undefined;
	if (drawTarget instanceof P5DrawTarget) {
		// @ts-ignore
		htmlCanvas = drawTarget.getMaps().canvas.canvas;
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

export function drawCanvasToP5(p5Target = getP5DrawTarget("defaultP5"), canvasTarget = getCanvasDrawTarget("defaultRegl")) {
	const p5Canvas = p5Target.getMaps().canvas;
	const canvasCanvas = canvasTarget.getMaps().canvas;
	p5Canvas.drawingContext.drawImage(canvasCanvas, 0, 0, p5Canvas.width, p5Canvas.height);
}
