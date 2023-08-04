import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from "./package.json";
const input = ["src/index.js"];

export default [
  {
    // UMD
    input,
    plugins: [
      json(),
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
      }),
      commonjs(),
      // terser()
    ],
    output: {
      file: `dist/${pkg.name}.min.js`,
      format: "umd",
      name: "vatidator",
      esModule: false,
      exports: "named",
      sourcemap: true,
      inlineDynamicImports: true
    },
  },
// ESM and CJS
  {
    input,
    plugins: [nodeResolve()],
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
];