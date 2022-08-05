import { SdfClass } from "./reglLighter";



export function generateTraceFragShader(sdfTypeArray: SdfClass[]) {
	const glslFunctions =
		sdfTypeArray.map((stdType) => {
			const functionBody = stdType.glslFunction.trim();

			return `float find${stdType.name} ${functionBody}`;
		});

	const glslCases = sdfTypeArray.map((sdfType, index) => {
		const sdfOptions = ["location"];

		for (let i = 0; i < sdfType.propertyCount; i++) {
			sdfOptions.push(`getSdfData(address + ${3 + i})`);
		}

		const sdfCall = `find${sdfType.name}(${sdfOptions.join(", ")})`;

		return `\t\tcase ${index}:\n\t\t\treturn ${sdfCall};`;
	});

	glslFunctions.push(`
float findSdf(vec2 position, int address) {
\tint sdfType = int(getSdfData(address));
\tvec2 location = position - vec2(getSdfData(address + 1), getSdfData(address + 2));
\t
\tswitch(sdfType) {
${glslCases.join("\n")}
\t}
\t
\treturn 1e20; // failed to find sdf
}
`.trim());

	const glslSdfInjection = glslFunctions.join("\n\n");

	return `
#version 100

precision mediump float;
precision mediump int;

float getSdfData(int address) {

}

${glslSdfInjection}

void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
	`.trim();
}