// eslint-disable-next-line @typescript-eslint/ban-types
export function safeBind<FunctionType extends Function>(
	func: FunctionType,
	thisArg: ThisType<FunctionType>,
	...argArray: unknown[]): FunctionType {
	
	assert(Object.hasOwn(func, "prototype"),
		`Can't bind context to function (${func.name}); Use the Function keyword and do not bind before-hand`);

	return func.bind(thisArg, ...argArray) as FunctionType;
}

export function assert(condition: boolean,
	message = "Assertion failed"): asserts condition {
	if (!condition) {
		throw Error(message);
	}
}

export function expect(condition: boolean,
	message = "Expectation failed"): asserts condition {
	if (!condition) {
		console.error(message);
	}
}