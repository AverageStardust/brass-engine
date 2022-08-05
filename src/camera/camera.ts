/**
 * Handles translations and zoom, screen shake and other effects.
 * Options to follow the position of any vector, like the player position.
 * @module
 */



import { Vector2 } from "../vector/vector2";
import { ClassicViewpoint } from "./classicViewpoint";
import { getViewpoints, ViewpointAbstract } from "./viewpointAbstract";



let defaultViewpoint: ViewpointAbstract;



export function init(viewpoint?: ViewpointAbstract) {
	if (viewpoint === undefined) {
		setDefaultViewpoint(new ClassicViewpoint(1, new Vector2(0, 0)));
	} else {
		setDefaultViewpoint(viewpoint);
	}
}

export function update(delta: number) {
	for (const viewpoint of getViewpoints()) {
		viewpoint.update(delta);
	}
}

export function setDefaultViewpoint(viewpoint: ViewpointAbstract) {
	defaultViewpoint = viewpoint;
}

export function getDefaultViewpoint() {
	if (defaultViewpoint === undefined) throw Error("Could not find default viewpoint; maybe run Brass.init() first");
	return defaultViewpoint;
}