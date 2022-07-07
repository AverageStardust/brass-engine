import { assert } from "../common/runtimeChecking";
import { getP5DrawTarget, P5Layer } from "../layers/p5Layers";
import { ComponentAbstract } from "./componentAbstract";
import { EmptyComponent } from "./emptyComponent";



interface ScreenEntry {
	fragmentName: string | null;
	component: ComponentAbstract | null;
}



let openScreenName: string | null = null;
const screens: Map<string, ScreenEntry> = new Map();
const fragments: Map<string, ComponentAbstract> = new Map();



export function setFragment(name: string, fragment: ComponentAbstract) {
	fragments.set(name, fragment);
}

export function getFragment(name: string) {
	let fragment = fragments.get(name);
	if (fragment === undefined || fragment instanceof EmptyComponent) {
		console.warn(`Found empty fragment (${name})`);
		fragment = new EmptyComponent();
	}
	return fragment;
}

export function setScreen(screenName: string, fragment: string | ComponentAbstract = screenName) {
	if (typeof fragment === "string") {
		screens.set(screenName, { fragmentName: fragment, component: null });
	} else {
		screens.set(screenName, { fragmentName: null, component: fragment });
	}
}

export function getScreen(screenName: string) {
	const screen = screens.get(screenName);
	if (screen === undefined) throw Error(`Could not find screen (${screenName})`);
	if (screen.component === null) {
		assert(screen.fragmentName !== null);
		screen.component = getFragment(screen.fragmentName);
		screens.set(screenName, screen);
	}
	return screen.component;
}

export function openScreen(screenName: string | null) {
	openScreenName = screenName;
}

export function drawUI(d: P5Layer = getP5DrawTarget("defaultP5")) {
	if (openScreenName === null) return;
	const g = d.getMaps().canvas;
	const component = getScreen(openScreenName);
	component.size = component.targetSize.copy().minScalar(g.width, g.height);
	component.draw(g);
}