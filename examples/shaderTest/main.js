/// <reference path = "../declareBrass.ts"/>

let regl, triCommand;

function setup() {
	Brass.init({
		regl: true
	});
	regl = Brass.getRegl();

	triCommand = regl({
		frag: `
		precision mediump float;
		varying vec4 vColor;

		void main () {
			gl_FragColor = vColor;
		}`,

		vert: `
		precision mediump float;
		attribute vec2 aPosition;
		attribute vec4 aColor;
		varying vec4 vColor;

		void main () {
			gl_Position = vec4(aPosition, 0, 1);
			vColor = aColor;
		}`,

		attributes: {
			aPosition: [
				[-1, 0],
				[0, -1],
				[1, 1]
			],
			aColor: [
				[1, 0, 0, 1],
				[0, 1, 0, 1],
				[0, 0, 1, 1]
			]
		},

		count: 3
	});

	displayTri();
}

function windowResized() {
	Brass.resize(window.innerWidth, window.innerHeight);
	displayTri();
}

function draw() {
	Brass.setTestStatus(frameCount > 60);
	circle(mouseX, mouseY, 32);
}

function displayTri() {
	triCommand();
	Brass.drawCanvasToP5();
}