import p5 from "p5";



export type ColorArgs = [string] | [number] | [number, number] | [number, number, number] | [number, number, number, number] | [number[]] | [p5.Color];



export function createColor(...colArgs: ColorArgs) {
	return color(...(colArgs as Parameters<typeof color>));
}