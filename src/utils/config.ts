import os from "node:os";
import path from "node:path";
import type { RuntimeConfig } from "../types.js";

export function loadConfig(): RuntimeConfig {
  return {
    memoryPath:
      process.env.DELUSIONGPT_MEMORY_PATH ??
      path.join(os.homedir(), ".delusiongpt", "memory.json")
  };
}
