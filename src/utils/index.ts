import fs from "fs";
import { builtinModules, createRequire } from "module";
import path from "path";
import { InlineConfig, loadConfigFromFile, mergeConfig } from "vite";
import { ExternalOptions } from "../types/configurature";
export const DEFAULT_CONFIG_FILES = [
  "electron.config.js",
  "electron.config.mjs",
  "electron.config.ts",
  "electron.config.cjs",
  "electron.config.mts",
  "electron.config.cts",
];
export async function copyConfigFile(configRoot: string): Promise<string> {
  let suffix = ".js";
  if (fs.existsSync(path.resolve(configRoot, "tsconfig.json"))) {
    suffix = ".ts";
  }
  let filePath = "electron.config" + suffix;
  let resolvedPath = path.resolve(configRoot, filePath);
  console.log();
  fs.copyFileSync(
    path.resolve(__dirname, "../../electron.config.ts"),
    resolvedPath
  );
  console.log();
  return resolvedPath;
}
export async function loadConfigFile(
  inlineConfig: InlineConfig,
  command: "build" | "serve",
  configRoot: string = process.cwd(),
  defaultMode = "development"
) {
  let config = inlineConfig;
  let mode = inlineConfig.mode || defaultMode;
  let resolvedPath: string | undefined;
  if (mode === "production") {
    process.env.NODE_ENV = "production";
  }
  if (command === "serve" && process.env.NODE_ENV === "production") {
    process.env.NODE_ENV = "development";
  }
  for (const filename of DEFAULT_CONFIG_FILES) {
    const filePath = path.resolve(configRoot, filename);
    if (!fs.existsSync(filePath)) continue;
    resolvedPath = filePath;
    break;
  }
  if (!resolvedPath) {
    resolvedPath = await copyConfigFile(configRoot);
  }
  const configEnv = {
    mode,
    command,
    ssrBuild: !!config.build?.ssr,
  };
  const res = await loadConfigFromFile(
    configEnv,
    resolvedPath,
    configRoot,
    inlineConfig.logLevel
  );
  return {
    ...res,
  };
}
export const getElectronPath = function () {
  const electronModulePath = path.resolve(
    process.cwd(),
    "node_modules",
    "electron"
  );
  const pathFile = path.join(electronModulePath, "path.txt");
  let executablePath;
  if (fs.existsSync(pathFile)) {
    executablePath = fs.readFileSync(pathFile, "utf-8");
  }
  if (executablePath) {
    return path.join(electronModulePath, "dist", executablePath);
  } else {
    throw new Error("Electron uninstall");
  }
};

export function createDefaultConfig(options: ExternalOptions, userConfig: any) {
  const {
    exclude = [],
    include = [],
    isProduction = false,
    outDir = "dist",
  } = options;
  const packagePath = path.resolve(process.cwd(), "package.json");
  const require = createRequire(import.meta.url);
  const pkg = require(packagePath);
  let deps = Object.keys(pkg.dependencies || {});
  if (include.length) {
    deps = deps.concat(include);
  }
  if (exclude.length) {
    deps = deps.filter((dep) => !exclude.includes(dep));
  }
  const defaultConfig: InlineConfig = {
    build: {
      watch: {},
      minify: isProduction,
      rollupOptions: {
        external: [
          ...new Set(
            deps.concat(
              builtinModules.concat(builtinModules.map((m) => `node:${m}`))
            )
          ),
        ],
      },
      emptyOutDir: false,
      outDir: outDir + "/electron",
    },
  };
  return mergeConfig(defaultConfig, userConfig);
}
