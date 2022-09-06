import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";
import colors from "picocolors";
import { build as ViteBuild, transformWithEsbuild, ViteDevServer } from "vite";
import typescript from "@rollup/plugin-typescript";
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
  const mainEntry = configs.config?.main;
  const preloads = configs.config?.preload;
  await ViteBuild({
    build: {
      reportCompressedSize: true,
      rollupOptions: {
        input: ["src/electron/electron.ts", "src/electron/preload.ts"],
        output: [
          {
            dir: "dist/electron",
            entryFileNames: "[name].js",
          },
        ],
        plugins: [typescript()],
      },
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
