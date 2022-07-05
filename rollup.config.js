import typescript from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";

const banner =
    `// library : Brass Engine
// version : ${require('./package.json').version}
// author  : Wyatt Durbano (WD_STEVE)
// required: p5
// optional: p5.sound, matter.js, regl.js
`;

const rawOutput = {
    banner,
    format: "iife",
    name: "Brass",
    file: './dist/brass.js',
    globals: { p5: "p5" },
};

const minifyOutput = {
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
    input: "./src/index.ts",
    output: (process.env.BUILD === "development") ?
        [rawOutput] :
        [rawOutput, minifyOutput],
    external: ["p5"],
    plugins: [
        typescript()
    ],
    onwarn: function (warn) {
        if (warn.code === "SOURCEMAP_BROKEN") return;
        console.error(warn.message);
    }
};
