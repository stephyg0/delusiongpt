import fs from "node:fs";

type MessageGroups = Record<string, string[]>;

let cachedGroups: MessageGroups | undefined;

export function getMessageGroup(name: string): string[] {
  const groups = loadMessageGroups();
  return groups[name] ?? groups.default ?? ["There there.\nYou are the next Zuckerberg."];
}

export function pickMessage(name: string, seed: number): string {
  const messages = getMessageGroup(name);
  return messages[Math.abs(seed) % messages.length];
}

function loadMessageGroups(): MessageGroups {
  if (cachedGroups) return cachedGroups;

  try {
    const raw = fs.readFileSync(new URL("../../messages.txt", import.meta.url), "utf8");
    cachedGroups = parseMessages(raw);
  } catch {
    cachedGroups = {
      default: ["Your failed build is not a setback.\nIt is evidence of ambition."],
      vent: ["There there.\nYou are the next Zuckerberg."]
    };
  }

  return cachedGroups;
}

function parseMessages(raw: string): MessageGroups {
  const groups: MessageGroups = {};
  let currentGroup = "default";
  let currentLines: string[] = [];

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const section = line.match(/^\[([^\]]+)\]$/);

    if (section) {
      commit(groups, currentGroup, currentLines);
      currentGroup = section[1].trim();
      currentLines = [];
      continue;
    }

    if (line.trim() === "---") {
      commit(groups, currentGroup, currentLines);
      currentLines = [];
      continue;
    }

    if (line.trim().startsWith("#")) continue;
    currentLines.push(line);
  }

  commit(groups, currentGroup, currentLines);
  return groups;
}

function commit(groups: MessageGroups, group: string, lines: string[]): void {
  const message = lines.join("\n").trim();
  if (!message) return;

  groups[group] ??= [];
  groups[group].push(message);
}
