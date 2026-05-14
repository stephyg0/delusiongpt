import chalk from "chalk";
import { sleep } from "./sleep.js";

export const theme = {
  dim: chalk.hex("#6f7480"),
  text: chalk.hex("#d8dce3"),
  bright: chalk.hex("#f2f4f8"),
  accent: chalk.hex("#9eb7ff"),
  warning: chalk.hex("#d8b86f"),
  danger: chalk.hex("#d08383"),
  success: chalk.hex("#9ecfb0")
};

export function clearScreen(): void {
  process.stdout.write("\x1Bc");
}

export function line(value = ""): void {
  process.stdout.write(`${value}\n`);
}

export function softDivider(): string {
  return theme.dim("─".repeat(Math.min(process.stdout.columns || 72, 72)));
}

export async function typeText(text: string, delay = 13): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    if (char.trim()) {
      await sleep(delay);
    }
  }
}

export function formatMetric(label: string, value: string): string {
  return `${theme.dim(label.padEnd(18))}${theme.bright(value)}`;
}
