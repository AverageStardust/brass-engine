/**
 * Some internal files export "public" functions and classes for use inside the engine. 
 * Only values re-exported by main are available for outside use.
 * @module main
 */

export {
	createFastGraphics
} from "./common/fastGraphics";
export {
	Pool
} from "./common/pool";
export {
	Heap,
	MaxHeap,
	MinHeap,
	MappedHeap,
	MappedMaxHeap,
	MappedMinHeap
} from "./common/heap";

export {
	init,
	update,
	setTestStatus,
	getTestStatus,
	timewarp,
	getTimewarp,
	getTimewarps
} from "./core/core";

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

	setUnsafeLevelLoading,
	loadLevelEarly,
	loadLevelLate,
	getLevel,

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
} from "./effects/effects";
export {
	Particle
} from "./effects/particle";
export {
	VelocityParticle
} from "./effects/velocityParticle";

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
} from "./core/time";

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
	getRegl,
	refreshRegl,
	refreshReglFast,
} from "./layers/handleRegl";
export {
	DrawBuffer
} from "./layers/drawBuffer";
export {
	resize,
	DrawTarget,
	setDrawTarget,
	hasDrawTarget,
	getDrawTarget
} from "./layers/drawTarget";
export {
	P5DrawBuffer,
	P5DrawTarget,
	getP5DrawTarget
} from "./layers/p5Layers";
export {
	CanvasDrawTarget,
	getCanvasDrawTarget
} from "./layers/canvasLayers";
export {
	drawCanvasToP5
} from "./layers/layers";

export {
	setDefaultViewpoint,
	getDefaultViewpoint
} from "./camera/camera";
export {
	ClassicViewpoint,
} from "./camera/classicViewpoint"
export {
	Viewpoint,
} from "./camera/viewpoint"