import { spawn } from "child_process";
import { existsSync } from "fs";
import colors from "picocolors";
import {
  build as ViteBuild,
  mergeConfig,
  UserConfig,
  ViteDevServer,
} from "vite";
import { UserConfigs } from "../types/configurature";
import {
  createDefaultConfig,
  getElectronPath,
  loadConfigFile,
} from "../utils/index";
async function startElectronApp(args = [".", "--no-sandbox"]) {
  const electronPath = getElectronPath();
  const hasElectron = existsSync(electronPath);
  try {
    if (process.electron_process) {
      process.electron_process.removeAllListeners();
      process.electron_process.kill();
    }
    if (hasElectron) {
      console.log(colors.green(`\nstart electron app...`));
      process.electron_process = spawn(electronPath, args, {
        stdio: "inherit",
      });
      process.electron_process.once("exit", process.exit);
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
export async function createElectronServer(
  server: ViteDevServer,
  configs: any
) {
  const { config } = (await loadConfigFile(
    configs.inlineConfig,
    configs.command
  )) as {
    path?: string | undefined;
    config?: UserConfigs | undefined;
    dependencies?: string[] | undefined;
  };
  const { main, preload, exclude, include } = config as UserConfigs;
  const configArray = [{ ...main, type: "main" }];
  if (preload) {
    configArray.push({ ...preload, type: "preload" });
  }
  for (const _config of configArray) {
    if (_config) {
      const resolvedConfig = createDefaultConfig(
        {
          exclude,
          include,
          outDir: configs.build.outDir,
          isProduction: configs.mode === "production",
        },
        _config
      );
      await ViteBuild(
        mergeConfig(
          {
            plugins: [
              {
                name: "start::electron",
                closeBundle() {
                  startElectronApp();
                },
              },
            ],
          } as UserConfig,
          resolvedConfig
        )
      );
    }
  }
}
