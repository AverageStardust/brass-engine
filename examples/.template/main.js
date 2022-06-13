/// <reference path = "../declareBrass.ts"/>

function setup() {
	Brass.init();
}

function windowResized() {
	Brass.resize(window.innerWidth, window.innerHeight);
}

function draw() {
	Brass.setTestStatus(frameCount > 60);
}