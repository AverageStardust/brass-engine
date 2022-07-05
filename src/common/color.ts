import p5 from "p5";



export type ColorArgs = [string] | [number] | [number, number] | [number, number, number] | [number, number, number, number] | [p5.Color];



export function createColor(...colArgs: ColorArgs) {
	// @ts-ignore because this is safe, if not type-checkable
	return color(...colArgs);
}