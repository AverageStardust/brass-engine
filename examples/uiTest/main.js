/// <reference path = "../declareBrass.ts"/>

function setup() {
	Brass.init();
	const component = new Brass.SpreadComponent().addChild(
		new Brass.DivComponent().addChild(
			new Brass.ButtonComponent()
		).addChild(
			new Brass.ButtonComponent()
		)
	);
	Brass.setScreen("testScreen", component);
	Brass.openScreen("testScreen");
}

function draw() {
	background("red");
	Brass.drawUI();
}