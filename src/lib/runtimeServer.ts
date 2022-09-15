import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";
import colors from "picocolors";
import { build as ViteBuild, ViteDevServer } from "vite";
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
  const { path, config, dependencies } = (await loadConfigFile(
    configs.inlineConfig,
    configs.command
  )) as {
    path?: string | undefined;
    config?: UserConfigs | undefined;
    dependencies?: string[] | undefined;
  };
  const { main, preload } = config as UserConfigs;
  await ViteBuild({
    ...main
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
