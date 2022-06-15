/*
	# 0.15.0
	tilemap drawing order
	key-binding system

	# 0.16.0
	directional light
	start TypeDoc docs

    # 0.17.0
	regl drawn tilemaps

	# future
	UI system
	inventory system
*/

export {
	Heap,
	MaxHeap,
	MinHeap,
	MappedHeap,
	MappedMaxHeap,
	MappedMinHeap
} from "./common";

export {
	init,
	update,
	setTestStatus,
	getTestStatus,
	timeWarp,
	getTimeWarp,
	getTimeWarps
} from "./core";

export {
	Lighter
} from "./lighting";

export {
	loadImageEarly,
	loadImageLate,
	loadImageDynamic,
	getImage,

	loadSoundEarly,
	loadSoundLate,
	getSound,

	enableUnsafeWorldLoading,
	loadWorldEarly,
	loadWorldLate,
	getWorld,

	loaded,
	loadProgress
} from "./loader";

export {
	setParticleLimit,
	emit,
	emitSingle,
	draw as drawParticles,

	ParticleAbstract,
	VelocityParticleAbstract
} from "./particle";

export {
	AStarPathfinder
} from "./pathfinder";

export {
	RectBody,
	CircleBody,
	PolyBody,
	GridBody,
	RayBody,

	drawColliders
} from "./physics";

export {
	Tilemap
} from "./tilemap";

export {
	getTime,
	getExactTime,
	getSimTime
} from "./time";

export {
	drawFPS,
	drawLoading,
	setLoadingTips
} from "./ui";

export * from "./vector3";

export {
	DrawTarget,
	P5DrawTarget,
	ReglDrawTarget,

	setDrawTarget,
	hasDrawTarget,
	getDrawTarget,
	getP5DrawTarget,
	getReglDrawTarget,
	
	resize,
	getRegl,
	refreshRegl,
	refreshReglFast,
	displayRegl
} from "./drawTarget";

export {
	ClassicViewpoint,
	Viewpoint,
	setDefaultViewpoint,
	getDefaultViewpoint
} from "./viewpoint";