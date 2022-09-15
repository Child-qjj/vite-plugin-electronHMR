import type { RollupOptions } from "rollup";
export interface UserConfigs {
  main: RollupOptions;
  preload?: RollupOptions;
}
