function setup() {
	viewpoint = new Brass.Viewpoint(100);

	Brass.init({
		viewpoint
	});
}

function windowResized() {
	Brass.resize(window.innerWidth, window.innerHeight);
}

function brassUpdate(delta) {}

function brassDraw() {
	viewpoint.target = player.position;
	viewpoint.view();

	background(127);
	tilemap.draw();
	noStroke();
	fill(255);

	circle(player.position.x, player.position.y, 0.8);
}