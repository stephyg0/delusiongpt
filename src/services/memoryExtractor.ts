import type { SessionMemory } from "../types.js";

export function updateMemoryFromText(memory: SessionMemory, text: string): SessionMemory {
  const next: SessionMemory = {
    ...memory,
    projects: [...memory.projects],
    goals: [...memory.goals],
    frustrations: { ...memory.frustrations }
  };

  const nameMatch = text.match(/\b(?:my name is|i am|i'm)\s+([a-z][a-z'-]{1,30})\b/i);
  if (nameMatch?.[1]) {
    next.userName = capitalize(nameMatch[1]);
  }

  const projectMatch = text.match(/\b(?:project|app|repo|startup|product)\s+(?:called|named|is)?\s*([A-Z][\w-]{2,40}|[a-z][\w-]{2,40})\b/);
  if (projectMatch?.[1]) {
    addUnique(next.projects, cleanToken(projectMatch[1]));
  }

  const goalMatch = text.match(/\b(?:i need to|i want to|goal is to|trying to)\s+(.{6,90})/i);
  if (goalMatch?.[1]) {
    addUnique(next.goals, goalMatch[1].replace(/[.?!]$/, "").trim());
  }

  for (const keyword of ["deploy", "interview", "npm", "bug", "tests", "burnout", "sleep", "startup"]) {
    if (new RegExp(`\\b${keyword}\\b`, "i").test(text)) {
      next.frustrations[keyword] = (next.frustrations[keyword] ?? 0) + 1;
    }
  }

  next.totalTurns += 1;
  next.delusionLevel = Math.min(10, next.delusionLevel + escalationFor(text));
  return next;
}

function escalationFor(text: string): number {
  if (/\b(failed|broken|urgent|production|interview|burnout|exhausted|crying|panic)\b/i.test(text)) {
    return 2;
  }

  return 1;
}

function addUnique(values: string[], value: string): void {
  if (!values.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
    values.push(value);
  }
}

function cleanToken(value: string): string {
  return value.replace(/[^\w-]/g, "");
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
