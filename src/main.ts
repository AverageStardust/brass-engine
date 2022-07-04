/**
 * Some internal files export "public" functions and classes for use inside the engine. 
 * Only values re-exported by main are available for outside use.
 * @module main
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
	timewarp,
	getTimewarp,
	getTimewarps
} from "./core";

export {
	InputMapper,
	disableContextMenu
} from "./inputMapper";

export {
	P5Lighter
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
	emitParticles,
	emitParticle,
	forEachParticle,
	forEachVisableParticle,
	draw as drawParticles,

	Particle,
	VelocityParticle
} from "./particle";

export {
	AStarPathfinder
} from "./pathfinder/aStarPathfinder";

export {
	drawColliders
} from "./physics/physics";
export { RectBody } from "./physics/rectBody";
export { CircleBody } from "./physics/circleBody";
export { PolyBody } from "./physics/polyBody";
export { GridBody } from "./physics/gridBody";
export { RayBody } from "./physics/rayBody";

export {
	P5Tilemap
} from "./tilemap/p5Tilemap";

export {
	getTime,
	getExactTime,
	getSimTime
} from "./time";

export {
	drawFPS,
	drawLoading,
	setLoadingTips
} from "./ui/legacyUI";

export {
	Vertex2,
	Vector2
} from "./vector/vector2";

export {
	DrawTarget,
	P5DrawTarget,
	CanvasDrawTarget,

	setDrawTarget,
	hasDrawTarget,
	getDrawTarget,
	getP5DrawTarget,
	getCanvasDrawTarget,

	resize,
	getRegl,
	refreshRegl,
	refreshReglFast,
	displayRegl
} from "./drawSurface";

export {
	ClassicViewpoint,
	Viewpoint,
	setDefaultViewpoint,
	getDefaultViewpoint
} from "./viewpoint";