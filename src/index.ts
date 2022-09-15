import { Plugin, ViteDevServer } from "vite";
import type { UserConfigs } from "./types/configurature";
// import { doBuild } from "../lib/builder";
import { createElectronServer } from "./lib/runtimeServer";
export interface ResolvedOptions {
  build: any;
}
export default function electron(rawOptions: UserConfigs): Plugin[] {
  let options: ResolvedOptions;

  return [
    // {
    //   name: "vite:electron-builder",
    //   apply: "build",
    //   config(config, env) {
    //     console.log(config, env);
    //   },
    //   async closeBundle(this) {
    //     await doBuild(rawOptions, config);
    //   },
    // },
    {
      name: "vite:electron-runtime-loader",
      apply: "serve",
      configResolved(config) {
        options = config;
      },
      configureServer(serve) {
        serve.httpServer?.addListener("listening", () => {
          createElectronServer(serve, options);
        });
      },
    },
  ];
}
