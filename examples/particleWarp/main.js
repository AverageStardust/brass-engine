/// <reference path = "../declareBrass.ts"/>

function setup() {
	Brass.init();
}

function windowResized() {
	Brass.resize(window.innerWidth, window.innerHeight);
}

function brassUpdate(delta) {
	if (Brass.getTimewarps().length < 2) {
		const rate = sin(Brass.getTime() * 0.002) * 0.8 + 1;
		Brass.timewarp(50, rate);
	}
	Brass.emitParticles(Particle, delta * 0.15, { x: width / 2, y: height / 2 });
}

function brassDraw(delta) {
	background(20, 20, 60);
	Brass.drawParticles();
	Brass.setTestStatus(frameCount > 60);
}

class Particle extends Brass.VelocityParticleAbstract {
	constructor(position) {
		super(position);
		this.xSeed = floor(random(Number.MAX_SAFE_INTEGER));
		this.ySeed = floor(random(Number.MAX_SAFE_INTEGER));
		this.lifetime = random(5000, 8000);
	}

	draw(g) {
		g.noStroke();
		g.colorMode(HSL);
		g.fill(this.velocity.mag * 150, 100, 50);
		g.circle(0, 0, 2);
	}

	update(delta) {
		const randomForce = new Brass.Vector2(
			noise(this.xSeed, Brass.getSimTime() * 0.005) - 0.5,
			noise(this.ySeed, Brass.getSimTime() * 0.005) - 0.5
		).multScalar(0.0003);

		this.velocity.add(randomForce.multScalar(delta));

		
		const mouseForce = new Brass.Vector2(mouseX, mouseY)
			.sub(this.position)
		mouseForce.norm(Math.min(0.01, 10 / sq(mouseForce.mag)));

		this.velocity.add(mouseForce.multScalar(delta));

		this.radius = sqrt(this.velocity.mag * 100) * (1 - this.age) + 1;

		this.updateKinomatics(delta);
	}
}