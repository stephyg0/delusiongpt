import type { CliMode, SessionMemory } from "../types.js";

export function calculatePotentialLevel(memory: SessionMemory, mode: CliMode): number {
  const modeBonus = mode === "founder" ? 17 : mode === "interview" ? 9 : mode === "burnout" ? 13 : 5;
  const projectBonus = Math.min(memory.projects.length * 4, 20);
  const enduranceBonus = Math.min(memory.totalTurns, 30);
  return Math.min(99, 42 + modeBonus + projectBonus + enduranceBonus + memory.delusionLevel);
}

export function formatDelusionMeter(level: number): string {
  const capped = Math.max(0, Math.min(10, level));
  return `${capped}/10`;
}
