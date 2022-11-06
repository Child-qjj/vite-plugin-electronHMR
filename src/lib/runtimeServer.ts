import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";
import colors from "picocolors";
import { build as ViteBuild, mergeConfig, ViteDevServer } from "vite";
import { UserConfigs } from "../types/configurature";
import { loadConfigFile } from "../utils/index";
const getElectronPath = function () {
  const electronModulePath = path.resolve(
    process.cwd(),
    "node_modules",
    "electron"
  );
  const pathFile = path.join(electronModulePath, "path.txt");
  let executablePath;
  if (existsSync(pathFile)) {
    executablePath = readFileSync(pathFile, "utf-8");
  }
  if (executablePath) {
    return path.join(electronModulePath, "dist", executablePath);
  } else {
    throw new Error("Electron uninstall");
  }
};
export async function createElectronServer(
  server: ViteDevServer,
  configs: any
) {
  const electronPath = getElectronPath();
  const hasElectron = existsSync(electronPath);
  const { config } = (await loadConfigFile(
    configs.inlineConfig,
    configs.command
  )) as {
    path?: string | undefined;
    config?: UserConfigs | undefined;
    dependencies?: string[] | undefined;
  };
  const { main, preload } = config as UserConfigs;
  console.log(configs.mode);

  const conf = mergeConfig(
    {
      build: {
        reportCompressedSize: true,
        sourcemap: true,
        minify: configs.mode === "production",
        // rollupOptions: {
        //   input: "src/electron/electron.ts",
        //   external: ["path", "fs", "electron"],
        //   output: [
        //     {
        //       dir: "dist/electron",
        //       exports: "named",
        //       format: "cjs",
        //       entryFileNames: "[name].js",
        //     },
        //   ],
        // },
      },
    },
    main
  );
  console.log(conf);

  await ViteBuild({
    build: {
      reportCompressedSize: true,
      outDir: "dist/electron",
      sourcemap: true,
      emptyOutDir: false,
      minify: configs.mode === "production",
      lib: {
        entry: "src/electron/electron.ts",
        formats:['cjs'],
        fileName:()=>'[name].js'
      },
      rollupOptions:{
        external:['path','fs','electron']
      }
    },
  });
  try {
    if (hasElectron) {
      spawn(electronPath, ["."], {
        stdio: "inherit",
      });
    } else {
      console.error(
        colors.red(
          "Electron command failed to run, please delete node_modules/electron and try installing again"
        )
      );
      process.exit(1);
    }
  } catch (error) {
    console.log(error);
  }
}
