import { Plugin, ViteDevServer } from "vite";
import type { UserConfigs } from "../types/configurature";
// import { doBuild } from "../lib/builder";
import { createElectronServer } from "../lib/runtimeServer";
export interface ResolvedOptions {
  root: string;
  sourceMap: boolean;
  isProduction: boolean;
  cssDevSourcemap: boolean;
  devServer?: ViteDevServer;
  devToolsEnabled?: boolean;
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
        options = {
          ...options,
          root: config.root,
          sourceMap:
            config.command === "build" ? !!config.build.sourcemap : true,
          cssDevSourcemap: config.css?.devSourcemap ?? false,
          isProduction: config.isProduction,
          devToolsEnabled:
            !!config.define!.__VUE_PROD_DEVTOOLS__ || !config.isProduction,
        };
      },
      config(config, env) {
        config = { ...config, ...{} };
      },
      transform(code, id, options) {
        console.log(id);
      },
      configureServer(serve) {
        serve.httpServer?.addListener("listening", () => {
          createElectronServer(serve, null);
        });
      },
    },
  ];
}
