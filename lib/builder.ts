// import { ResolvedConfig } from "vite";
// import {
//   RollupOptions,
//   OutputOptions,
// } from "rollup";
// import type { UserConfigs } from "../types/configurature";
// import path from "path";
// import typescript from "@rollup/plugin-typescript";

// const resolve = (p: string) => path.resolve(process.cwd(), p);
// // defineConfig({
// //   input: resolve("src/electron/preload.ts"),
// //   output: {
// //     dir: resolve("dist/electron"),
// //     // entryFileNames: "preload/[name].cjs",
// //     chunkFileNames: "preload/chunks/dep-[hash].js",
// //     format: "cjs",
// //     exports: "named",
// //     sourcemap: false,
// //   },
// //   plugins: [
// //     rollupTypescript({
// //       tsconfig: resolve("tsconfig.json"),
// //     }),
// //   ],
// //   ...configs,
// // });
// function buildingOuputOptions(configs?: RollupOptions): RollupOptions {
//   return {};
// }
// export async function doBuild(
//   rawOptions: UserConfigs,
//   inlineConfig: ResolvedConfig
// ) {
//   const { preload = "", mainProcess, outputs = [], inputs = [] } = rawOptions;
//   const rollupOptions: RollupOptions = {
//     context: "globalThis",
//     preserveEntrySignatures: "strict",
//     inputs,
//     plugins: [
//       typescript({
//         tsconfig: resolve("tsconfig.json"),
//       }),
//     ],
//   };
//   const { rollup } = await import("rollup");
//   const bundle = await rollup(buildingOuputOptions(rollupOptions));
//   bundle["write"](buildingOuputOptions(rollupOptions).output as OutputOptions);
//   await bundle.close();
// }
