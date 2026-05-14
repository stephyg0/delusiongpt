export type CliMode = "default" | "founder" | "interview" | "burnout";

export type DetectedContext =
  | "npm"
  | "deploy"
  | "interview"
  | "debugging"
  | "startup"
  | "burnout"
  | "sleep"
  | "tests"
  | "architecture"
  | "unknown";

export interface SessionMemory {
  userName?: string;
  projects: string[];
  goals: string[];
  frustrations: Record<string, number>;
  lastSeenAt?: string;
  totalSessions: number;
  totalTurns: number;
  delusionLevel: number;
}

export interface RuntimeConfig {
  memoryPath: string;
}
