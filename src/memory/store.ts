import fs from "node:fs/promises";
import path from "node:path";
import type { SessionMemory } from "../types.js";

const defaultMemory: SessionMemory = {
  projects: [],
  goals: [],
  frustrations: {},
  totalSessions: 0,
  totalTurns: 0,
  delusionLevel: 0
};

export async function loadMemory(memoryPath: string): Promise<SessionMemory> {
  try {
    const raw = await fs.readFile(memoryPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<SessionMemory>;

    return {
      ...defaultMemory,
      ...parsed,
      projects: parsed.projects ?? [],
      goals: parsed.goals ?? [],
      frustrations: parsed.frustrations ?? {}
    };
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { ...defaultMemory };
    }

    throw error;
  }
}

export async function saveMemory(memoryPath: string, memory: SessionMemory): Promise<void> {
  try {
    await fs.mkdir(path.dirname(memoryPath), { recursive: true });
    await fs.writeFile(memoryPath, `${JSON.stringify(memory, null, 2)}\n`, "utf8");
  } catch (error) {
    if (isNodeError(error) && ["EACCES", "EPERM", "EROFS"].includes(error.code ?? "")) {
      return;
    }

    throw error;
  }
}

export function startSession(memory: SessionMemory): SessionMemory {
  return {
    ...memory,
    totalSessions: memory.totalSessions + 1,
    lastSeenAt: new Date().toISOString()
  };
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
