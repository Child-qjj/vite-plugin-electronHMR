import type { OutputOptions, InputOptions } from "rollup";

//
export interface UserConfigs {
  mainProcess: string | string[];
  preload?: string | string[];
  outputs?: OutputOptions;
  inputs?: InputOptions;
}
