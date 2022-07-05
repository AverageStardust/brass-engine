/**
 * Collect and process input data from keyboard, mouse and gamepad.
 * Not the same as a UI system. Mouse events are only taken if they don't first hit UI.
 * @module
 */

import { assert } from "./common/runtimeChecking";
import { Vector2, Vertex2 } from "./vector/vector2";



interface GamepadLink {
	gamepad: Gamepad | null;
	user: GamepadInputDevice | null
}



const inputDeviceMap: Map<string, InputDeviceAbstract> = new Map();
const inputMappers: InputMapper[] = [];
const deriverCatalogue: Map<string, (mapper: InputMapper) => void> = new Map();
const gamepadLinks: GamepadLink[] = [];



export function init() {
	window.addEventListener("gamepadconnected", handleGamepadConnected);
	window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
	deriverCatalogue.set("movement", (mapper) => {
		const movement = new Vector2();

		if (mapper.has("keyboard")) {
			if (mapper.button.get("keyboardS") || mapper.button.get("keyboardArrowDown")) {
				movement.addScalar(0, 1);
			}
			if (mapper.button.get("keyboardA") || mapper.button.get("keyboardArrowLeft")) {
				movement.addScalar(-1, 0);
			}
			if (mapper.button.get("keyboardD") || mapper.button.get("keyboardArrowRight")) {
				movement.addScalar(1, 0);
			}
			if (mapper.button.get("keyboardW") || mapper.button.get("keyboardArrowUp")) {
				movement.addScalar(0, -1);
			}
			if (movement.mag > 0) movement.norm(1);
		}

		if (mapper.has("gamepad")) {
			if (mapper.button.get("gamepadDpadDown")) {
				movement.addScalar(0, 1);
			}
			if (mapper.button.get("gamepadDpadLeft")) {
				movement.addScalar(-1, 0);
			}
			if (mapper.button.get("gamepadDpadRight")) {
				movement.addScalar(1, 0);
			}
			if (mapper.button.get("gamepadDpadUp")) {
				movement.addScalar(0, -1);
			}

			if (movement.mag > 0) {
				movement.norm(1);
			} else {
				movement.set(mapper.vector.get("gamepadStickLeft"));
			}
		}

		mapper.vector.setSafe("movement", movement);
	});

	deriverCatalogue.set("actionA", (mapper) => {
		let actionA = false;

		if (mapper.has("keyboard")) {
			actionA ||= mapper.button.get("keyboardE");
			actionA ||= mapper.button.get("keyboardShiftLeft");
		}

		if (mapper.has("mouse")) {
			actionA ||= mapper.button.get("mouseLeft");
		}

		if (mapper.has("gamepad")) {
			actionA ||= mapper.button.get("gamepadFaceRight");
		}

		mapper.button.setSafe("actionA", actionA);
	});

	deriverCatalogue.set("actionB", (mapper) => {
		let actionB = false;

		if (mapper.has("keyboard")) {
			actionB ||= mapper.button.get("keyboardQ");
			actionB ||= mapper.button.get("keyboardR");
			actionB ||= mapper.button.get("keyboardF");
		}

		if (mapper.has("mouse")) {
			actionB ||= mapper.button.get("mouseRight");
		}

		if (mapper.has("gamepad")) {
			actionB ||= mapper.button.get("gamepadFaceDown");
		}

		mapper.button.setSafe("actionB", actionB);
	});

	deriverCatalogue.set("actionC", (mapper) => {
		let actionC = false;

		if (mapper.has("keyboard")) {
			actionC ||= mapper.button.get("keyboardSpace");
		}

		if (mapper.has("mouse")) {
			actionC ||= mapper.button.get("mouseCenter");
		}

		if (mapper.has("gamepad")) {
			actionC ||= mapper.button.get("gamepadFaceUp");
			actionC ||= mapper.button.get("gamepadFaceLeft");
		}

		mapper.button.setSafe("actionC", actionC);
	});
}

export function disableContextMenu() {
	window.addEventListener("contextmenu", (event) => event.preventDefault());
}

function handleGamepadConnected(event: GamepadEvent) {
	const gamepad = event.gamepad;

	if (gamepad.mapping !== "standard") {
		alert("Browser couldn't find standard mapping for gamepad, it has been ignored.");
		return;
	}

	for (const gamepadLink of gamepadLinks) {
		if (gamepadLink.user) {
			if (gamepadLink.gamepad) {
				// try to restore link
				if (gamepad.index === gamepadLink.gamepad.index) {
					gamepadLink.gamepad = gamepad;
					gamepadLink.user.gamepad = gamepad;
					return;
				}
			} else {
				// try to start link
				gamepadLink.gamepad = gamepad;
				gamepadLink.user.gamepad = gamepad;
				return;
			}
		}
	}

	// open link to users
	gamepadLinks.push({
		gamepad: event.gamepad,
		user: null
	});
}

function handleGamepadDisconnected(event: GamepadEvent) {
	const gamepad = event.gamepad;
	for (const gamepadLink of gamepadLinks) {
		if (gamepadLink.gamepad && gamepadLink.user) {
			// try to break link
			if (gamepad.index === gamepadLink.gamepad.index) {
				gamepadLink.user.gamepad = null;
				return;
			}
		}
	}
}

export function update() {
	const gamepads = navigator.getGamepads();
	for (const gamepad of gamepads) {
		if (!gamepad) continue;
		for (const gamepadLink of gamepadLinks) {
			if (!gamepadLink.user || !gamepadLink.gamepad) continue;
			if (gamepadLink.gamepad.index !== gamepad.index) continue;
			gamepadLink.gamepad = gamepad;
			gamepadLink.user.gamepad = gamepad;
		}
	}

	for (const input of inputDeviceMap.values()) input.update();
	for (const inputMap of inputMappers) inputMap.update();
}

function getInputDevice(name: string) {
	let device: InputDeviceAbstract | undefined = inputDeviceMap.get(name);
	if (device) return device;

	switch (name) {
		default:
			if (name.startsWith("gamepad")) {
				device = new GamepadInputDevice();
			} else {
				throw Error(`Unknown input device (${name})`);
			}
			break;
		case "keyboard":
			device = new KeyboardInputDevice();
			break;
		case "mouse":
			device = new MouseInputDevice();
			break;
	}

	inputDeviceMap.set(name, device);
	return device;
}

abstract class InputDeviceAbstract {
	private readonly buttonStateChanges: Map<string, boolean> = new Map();
	private readonly axisStateChanges: Map<string, number> = new Map();
	private readonly vectorStateChanges: Map<string, Vector2> = new Map();
	private readonly buttonState: Map<string, boolean> = new Map();
	private readonly axisState: Map<string, number> = new Map();
	private readonly vectorState: Map<string, Vector2> = new Map();
	readonly devicePrefix: string;

	constructor(devicePrefix: string, buttonList: string[], axisList: string[], vectorList: string[]) {
		this.devicePrefix = devicePrefix;
		for (const button of buttonList) {
			this.buttonState.set(button, false);
		}
		for (const axis of axisList) {
			this.axisState.set(axis, 0);
		}
		for (const axis of vectorList) {
			this.vectorState.set(axis, new Vector2(0, 0));
		}
	}

	abstract update(): void

	applyState(mapper: InputMapper) {
		for (const [name, value] of this.buttonState.entries()) {
			mapper.button.add(this.devicePrefix + name, value);
		}
		for (const [name, value] of this.axisState.entries()) {
			mapper.axis.add(this.devicePrefix + name, value);
		}
		for (const [name, value] of this.vectorState.entries()) {
			mapper.vector.add(this.devicePrefix + name, value);
		}
	}

	applyStateChange(mapper: InputMapper) {
		for (const [name, value] of this.buttonStateChanges.entries()) {
			mapper.button.set(this.devicePrefix + name, value);
		}
		this.buttonStateChanges.clear();
		for (const [name, value] of this.axisStateChanges.entries()) {
			mapper.axis.set(this.devicePrefix + name, value);
		}
		this.axisStateChanges.clear();
		for (const [name, value] of this.vectorStateChanges.entries()) {
			mapper.vector.set(this.devicePrefix + name, value);
		}
		this.vectorStateChanges.clear();
	}

	protected clearState() {
		for (const name of this.buttonState.keys()) {
			this.setButton(name, false);
		}
		for (const name of this.axisState.keys()) {
			this.setAxis(name, 0);
		}
		for (const name of this.vectorState.keys()) {
			this.setVector(name, { x: 0, y: 0 });
		}
	}

	protected setButton(name: string, value: boolean) {
		if (!this.buttonState.has(name)) return;
		if (this.buttonState.get(name) === value) return;
		this.buttonState.set(name, value);
		this.buttonStateChanges.set(name, value);
	}

	protected setAxis(name: string, value: number) {
		if (!this.axisState.has(name)) return;
		if (this.axisState.get(name) === value) return;
		this.axisState.set(name, value);
		this.axisStateChanges.set(name, value);
	}

	protected setVector(name: string, value: Vertex2) {
		if (!this.vectorState.has(name)) return;
		const vector = Vector2.fromObjFast(value);
		if (vector.equal(this.vectorState.get(name) as Vector2)) return;
		this.vectorState.set(name, vector);
		this.vectorStateChanges.set(name, vector);
	}
}

class KeyboardInputDevice extends InputDeviceAbstract {
	constructor() {
		super("keyboard",
			["A", "AltLeft", "AltRight", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "B", "Backspace", "Backquote", "Backslash", "BracketLeft", "BracketRight", "C", "Comma", "ControlLeft", "ControlRight", "D", "Delete", "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "E", "Enter", "Equal", "Escape", "F", "F1", "F10", "F11", "F12", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "G", "H", "I", "J", "K", "L", "M", "MetaLeft", "MetaRight", "Minus", "N", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd", "NumpadDecimal", "NumpadDivide", "NumpadEnter", "NumpadMultiply", "NumpadSubtract", "O", "P", "Period", "Q", "Quote", "R", "S", "Semicolon", "ShiftLeft", "ShiftRight", "Slash", "Space", "T", "U", "V", "W", "X", "Y", "Z"],
			[],
			[]);
		window.addEventListener("keydown", this.handleKeyListener.bind(this, true));
		window.addEventListener("keyup", this.handleKeyListener.bind(this, false));
	}

	update() { } // do nothing, all async here

	protected handleKeyListener(state: boolean, { code }: KeyboardEvent) {
		if (code.startsWith("Key")) code = code.substring(3, Infinity);
		this.setButton(code, state)
	}
}

class MouseInputDevice extends InputDeviceAbstract {
	constructor() {
		super("mouse",
			["Left", "Center", "Right"],
			[],
			[]);
		window.addEventListener("mousedown", this.handleKeyListener.bind(this, true));
		window.addEventListener("mouseup", this.handleKeyListener.bind(this, false));
	}

	update() { } // do nothing, all async here

	protected handleKeyListener(state: boolean, event: MouseEvent) {
		switch (event.button) {
			case 0:
				this.setButton("Left", state);
				break;
			case 1:
				this.setButton("Center", state);
				event.preventDefault();
				break;
			case 2:
				this.setButton("Right", state);
				break;
		}
	}
}

class GamepadInputDevice extends InputDeviceAbstract {
	gamepad: Gamepad | null;
	deadZone = 0.1;

	constructor() {
		super("gamepad",
			["DpadDown", "DpadLeft", "DpadRight", "DpadUp", "FaceDown", "FaceLeft", "FaceRight", "FaceUp", "ControlLeft", "ControlRight", "ShoulderLeft", "ShoulderRight", "TriggerLeft", "TriggerRight", "StickLeft", "StickRight", "Meta"],
			["ShoulderLeft", "ShoulderRight", "TriggerLeft", "TriggerRight"],
			["StickLeft", "StickRight"]);

		for (const gamepadLink of gamepadLinks) {
			if (!gamepadLink.user && gamepadLink.gamepad) {
				gamepadLink.user = this;
				this.gamepad = gamepadLink.gamepad;
				return;
			}
		}
		gamepadLinks.push({
			gamepad: null,
			user: this
		});
		this.gamepad = null;
	}

	update() {
		if (!this.gamepad) {
			this.clearState();
			return;
		}

		const buttons = this.gamepad.buttons;

		this.setButton("DpadDown", buttons[13].pressed);
		this.setButton("DpadLeft", buttons[14].pressed);
		this.setButton("DpadRight", buttons[15].pressed);
		this.setButton("DpadUp", buttons[12].pressed);

		this.setButton("FaceDown", buttons[0].pressed);
		this.setButton("FaceLeft", buttons[2].pressed);
		this.setButton("FaceRight", buttons[1].pressed);
		this.setButton("FaceUp", buttons[3].pressed);

		this.setButton("ControlLeft", buttons[8].pressed);
		this.setButton("ControlRight", buttons[9].pressed);

		this.setButton("ShoulderLeft", buttons[4].pressed);
		this.setButton("ShoulderRight", buttons[5].pressed);
		this.setButton("TriggerLeft", buttons[6].pressed);
		this.setButton("TriggerRight", buttons[7].pressed);

		this.setButton("StickLeft", buttons[10].pressed);
		this.setButton("StickRight", buttons[11].pressed);

		this.setButton("Meta", buttons[16].pressed);

		this.setAxis("ShoulderLeft", buttons[4].value);
		this.setAxis("ShoulderRight", buttons[5].value);
		this.setAxis("TriggerLeft", buttons[6].value);
		this.setAxis("TriggerRight", buttons[7].value);

		const axis = this.gamepad.axes;

		const stickLeft = new Vector2(axis[0], axis[1]);
		const stickRight = new Vector2(axis[2], axis[3]);

		this.processStick(stickLeft);
		this.processStick(stickRight);

		this.setVector("StickLeft", stickLeft);
		this.setVector("StickRight", stickRight);
	}

	processStick(position: Vector2) {
		if (position.mag === 0) return;

		const
			absX = Math.abs(position.x),
			absY = Math.abs(position.y)

		let squareEdge: Vector2;
		if (absX > absY) {
			squareEdge = position.copy().divScalar(absX);
		} else {
			squareEdge = position.copy().divScalar(absY);
		}

		position.divScalar(squareEdge.mag);

		if (position.mag < this.deadZone) position.setScalar(0, 0);
	}
}


class InputState<T> {
	protected readonly state: Map<string, T> = new Map();
	protected readonly unitName: string;

	constructor(unitName: string) {
		this.unitName = unitName;
	}

	has(name: string) {
		return this.state.has(name);
	}

	get(name: string) {
		assert(this.state.has(name), `Can't get unknown ${this.unitName} (${name})`);
		return this.state.get(name) as T;
	}

	setSafe(name: string, value: T) {
		if (this.state.has(name)) this.set(name, value);
		else this.add(name, value);
	}

	set(name: string, value: T) {
		assert(this.state.has(name), `Can't set unknown ${this.unitName} (${name})`);

		this.state.set(name, value);
	}

	add(name: string, value: T) {
		this.state.set(name, value);
	}
}

class ButtonInputState extends InputState<boolean> {
	private readonly unions: Map<string, string[]> = new Map();
	private readonly nextResolves: ((value: string) => void)[] = [];

	constructor(unitName: string) {
		super(unitName);
	}

	update() {
		for (const name of this.unions.keys()) {
			this.updateUnion(name);
		}
	}

	setSafe(name: string, value: boolean) {
		if (this.state.has(name)) this.set(name, value);
		else this.add(name, value);
	}

	set(name: string, value: boolean) {
		assert(this.state.has(name), `Can't set unknown ${this.unitName}`);

		if (value) {
			const currentValue = this.state.get(name);
			if (!currentValue) {
				const resolve = this.nextResolves.shift();
				if (resolve) resolve(name);
			}
		}

		this.state.set(name, value);
	}

	async next() {
		return new Promise<string>((resolve) => {
			this.nextResolves.push(resolve);
		});
	}

	private updateUnion(unionName: string) {
		const union = this.unions.get(unionName) as string[];
		const unionState = Object.fromEntries(
			union.map((name) => [
				name,
				this.state.get(name) as boolean
			]));
		this.set(unionName, this.joinUnion(unionState));
	}

	private joinUnion(state: { [key: string]: boolean }) {
		const values = Object.values(state);
		if (values.length === 0) return false;
		return values.reduce((a, b) => a && b);
	}

	setAvailableUnion(unionName: string, names: string[]) {
		const availableNames = [];
		for (const name of names) {
			if (this.has(name)) availableNames.push(name);
		}

		this.setUnion(unionName, availableNames);
	}

	setUnion(unionName: string, names: string[]) {
		for (const name of names) {
			assert(this.state.has(name), `Can't make union with unknown ${this.unitName}`);
			assert(this.unions.has(name), `Can't make union with union ${this.unitName}`);
		}

		this.unions.set(unionName, names);
		this.add(unionName, undefined as any);
		this.updateUnion(unionName);
	}
}


export class InputMapper {
	readonly button: ButtonInputState = new ButtonInputState("button");
	readonly axis: InputState<number> = new InputState("axis");
	readonly vector: InputState<Vector2> = new InputState("vector");
	readonly devices: InputDeviceAbstract[] = [];
	readonly derivers: ((mapper: InputMapper) => void)[] = [];

	constructor(devices: string[] = ["keyboard", "mouse", "gamepad"],
		derivers?: (string | ((mapper: InputMapper) => void))[]) {

		for (const deviceName of devices) {
			const device = getInputDevice(deviceName);
			this.devices.push(device);
			device.applyState(this);
		}

		if (!derivers) derivers = ["movement", "actionA", "actionB", "actionC"];

		for (const deriver of derivers) {
			if (typeof deriver === "function") {
				this.derivers.push(deriver);
			} else {
				const foundDeriver = deriverCatalogue.get(deriver);
				if (!foundDeriver) throw Error(`Can't find input deriver named (${deriver})`);
				this.derivers.push(foundDeriver);
			}
		}

		for (const deriver of this.derivers) deriver(this);

		inputMappers.push(this);
	}

	update() {
		for (const device of this.devices) {
			device.applyStateChange(this);
		}
		this.button.update();

		for (const deriver of this.derivers) deriver(this);
	}

	has(devicePrefix: string) {
		for (const device of this.devices) {
			if (device.devicePrefix === devicePrefix) {
				return true;
			}
		}
		return false;
	}
}