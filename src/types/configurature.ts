import type { RollupOptions } from "rollup";
export interface UserConfigs {
  main: RollupOptions;
  preload?: RollupOptions;
  exclude?: string[];
  include?: string[];
}
export interface ExternalOptions {
  exclude?: string[];
  include?: string[];
  isProduction?: boolean;
  outDir?: string;
}
