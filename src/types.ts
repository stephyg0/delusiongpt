export type CliMode = "default" | "founder" | "cs-student" | "burnout";

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
