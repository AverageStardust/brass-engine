/// <reference path = "../declareBrass.ts"/>

function setup() {
	Brass.init();
}

function draw() {
	Brass.setTestStatus(frameCount > 60);
}