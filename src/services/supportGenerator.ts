import type { CliMode, SessionMemory } from "../types.js";
import { isLateNight } from "../utils/time.js";
import { getMessageGroup, pickMessage } from "./messageCatalog.js";

export function generateSupportMessage(input: {
  mode: CliMode;
  memory: SessionMemory;
  userText?: string;
  isVent?: boolean;
}): string {
  if (input.isVent) {
    return pickFromGroups(["vent"], input.memory);
  }

  const baseGroup = input.mode === "default" ? "default" : input.mode;
  const groups = [baseGroup, ...(isLateNight() ? ["late-night"] : [])];

  const message = pickFromGroups(groups, input.memory);
  const projectBias = input.memory.projects.at(-1);

  if (projectBias && input.memory.delusionLevel >= 5) {
    const projectMessage = pickMessage("project-bias", seed(input.memory)).replaceAll(
      "{project}",
      projectBias
    );
    return `${message}\n${projectMessage}`;
  }

  return message;
}

export function advanceAmbientDelusion(memory: SessionMemory): SessionMemory {
  return {
    ...memory,
    totalTurns: memory.totalTurns + 1,
    delusionLevel: Math.min(10, memory.delusionLevel + 1)
  };
}

function pickFromGroups(groups: string[], memory: SessionMemory): string {
  const pool = groups.flatMap((group) => getMessageGroup(group));
  const messages = pool.length ? pool : getMessageGroup("default");

  return messages[seed(memory) % messages.length];
}

function seed(memory: SessionMemory): number {
  return Math.abs(memory.totalTurns + memory.totalSessions + memory.delusionLevel);
}
