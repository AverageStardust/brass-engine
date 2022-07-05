export function safeBind(func: Function, thisArg: any, ...argArray: any[]) {
	assert(func.hasOwnProperty("prototype"), `Can't bind context to function (${func.name}); Use the Function keyword and do not bind before-hand`);

	return func.bind(thisArg, ...argArray);
}

export function assert(condition: boolean, message = "Assertion failed"): asserts condition {
	if (!condition)
		throw Error(message);
}

export function expect(condition: boolean, message = "Expectation failed"): asserts condition {
	if (!condition)
		console.error(message);
}
