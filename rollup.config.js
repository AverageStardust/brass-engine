import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const banner = 
`// library : Brass Engine
// version : 0.13.5
// author  : WD_STEVE
// required: p5
// optional: p5.sound, matter.js
`;

const rawOutput = {
    banner,
    format: "iife",
    name: "Brass",
    file: './dist/brass.js',
    globals: { p5: "p5" },
    sourcemap: true,
};

const minOutput = {
    banner,
    format: "iife",
    name: "Brass",
    file: './dist/brass.min.js',
    globals: { p5: "p5" },
    plugins: [
        terser({
            output: {
                comments: "all",
            },
        })
    ]
};

export default {
    input: "./src/main.ts",
    output: (process.env.BUILD === "development") ? [rawOutput] : [rawOutput, minOutput],
    external: ["p5"],
    plugins: [
        typescript()
    ]
};
