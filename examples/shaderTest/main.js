let regl, drawTri;

function setup() {
	Brass.init({
		regl: true
	});
	regl = Brass.getRegl();

	// regl test examples on regl's site
	drawTri = regl({
		frag: `
		precision mediump float;
		uniform vec4 color;
		void main () {
			gl_FragColor = color;
		}`,

		vert: `
		precision mediump float;
		attribute vec2 position;
		void main () {
			gl_Position = vec4(position, 0, 1);
		}`,

		attributes: {
			position: [
				[-1, 0],
				[0, -1],
				[1, 1]
			]
		},

		uniforms: {
			color: [1, 0, 0, 1]
		},

		count: 3
	});

	displayTri();
}

function displayTri() {
	regl.clear({
		color: [0, 0, 0, 1],
		depth: 1,
		stencil: 0
	});
	drawTri();
	Brass.displayRegl();
}

function windowResized() {
	Brass.resize(window.innerWidth, window.innerHeight);
	displayTri();
}

function draw() {
	circle(mouseX, mouseY, 32);
}