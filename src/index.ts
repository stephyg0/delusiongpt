#!/usr/bin/env node

import { runCli } from "./commands/run.js";

runCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`DelusionGPT destabilized gracefully: ${message}`);
  process.exit(1);
});
