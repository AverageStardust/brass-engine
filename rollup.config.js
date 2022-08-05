import typescript from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
const { version } = require("./package.json");

const banner =
    `// library : Brass Engine
// version : ${version}
// author  : Wyatt Durbano (WD_STEVE)
// required: p5
// optional: p5.sound, matter.js, regl.js
`;

const rawOutput = {
    banner,
    format: "iife",
    name: "globalThis",
    extend: true,
    file: './app/main.js',
    globals: { p5: "p5" },
};

const minifyOutput = {
    banner,
    format: "iife",
    name: "globalThis",
    extend: true,
    file: './app/main.min.js',
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
    input: "./app/main.ts",
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
