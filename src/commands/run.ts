import process from "node:process";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import { loadMemory, saveMemory, startSession } from "../memory/store.js";
import { getDailyQuote } from "../prompts/quotes.js";
import { updateMemoryFromText } from "../services/memoryExtractor.js";
import { advanceAmbientDelusion, generateSupportMessage } from "../services/supportGenerator.js";
import type { CliMode, SessionMemory } from "../types.js";
import { loadConfig } from "../utils/config.js";
import { clearScreen, line, theme, typeText } from "../utils/terminal.js";

interface CliOptions {
  founder?: boolean;
  interview?: boolean;
  burnout?: boolean;
}

export async function runCli(): Promise<void> {
  const program = new Command()
    .name("delusiongpt")
    .description("A calm terminal companion for developers whose confidence requires supervision.")
    .option("--founder", "enter founder mode")
    .option("--interview", "enter interview mode")
    .option("--burnout", "enter burnout mode")
    .version("0.1.0");

  program.parse(process.argv);
  const options = program.opts<CliOptions>();
  const mode = resolveMode(options);

  const config = loadConfig();
  let memory = startSession(await loadMemory(config.memoryPath));
  await saveMemory(config.memoryPath, memory);

  clearScreen();
  renderHeader(mode);
  memory = await showSupportMessage(memory, mode, config.memoryPath);

  while (true) {
    const { input } = await inquirer.prompt<{ input: string }>([
      {
        type: "input",
        name: "input",
        message: chalk.hex("#8b91a1")("enter · vent · q"),
        prefix: chalk.hex("#4e5565")(">")
      }
    ]);

    const userText = input.trim();
    if (!userText) {
      memory = await showSupportMessage(memory, mode, config.memoryPath);
      continue;
    }

    if (["exit", "quit", "goodnight", "q"].includes(userText.toLowerCase())) {
      await closeSession(memory, mode);
      return;
    }

    if (userText.toLowerCase() === "vent") {
      const rant = await openVentPad();
      if (!rant) {
        line(theme.dim("\ndelusiongpt  The silence is noted. Extremely founder-coded.\n"));
        continue;
      }

      memory = updateMemoryFromText(memory, rant);
      await saveMemory(config.memoryPath, memory);
      memory = await showSupportMessage(memory, mode, config.memoryPath, rant, true);
      continue;
    }

    memory = updateMemoryFromText(memory, userText);
    await saveMemory(config.memoryPath, memory);
    memory = await showSupportMessage(memory, mode, config.memoryPath, userText);
  }
}

async function openVentPad(): Promise<string> {
  const width = Math.min(process.stdout.columns || 72, 64);
  const innerWidth = width - 4;
  const top = `╭${"─".repeat(width - 2)}╮`;
  const bottom = `╰${"─".repeat(width - 2)}╯`;
  const rows = [
    "Vent pad",
    "Write the incident report your genius deserves.",
    "Type /done on its own line when finished."
  ];
  const entries: string[] = [];

  line();
  line(theme.dim(top));
  for (const row of rows) {
    line(theme.dim(`│ ${row.padEnd(innerWidth)} │`));
  }
  line(theme.dim(`│ ${"".padEnd(innerWidth)} │`));

  while (true) {
    const { entry } = await inquirer.prompt<{ entry: string }>([
      {
        type: "input",
        name: "entry",
        message: "",
        prefix: theme.dim("│")
      }
    ]);

    if (entry.trim().toLowerCase() === "/done") {
      break;
    }

    entries.push(entry);
  }

  line(theme.dim(bottom));
  return entries.join("\n").trim();
}

async function showSupportMessage(
  memory: SessionMemory,
  mode: CliMode,
  memoryPath: string,
  userText?: string,
  isVent = false
): Promise<SessionMemory> {
  const nextMemory = userText ? memory : advanceAmbientDelusion(memory);
  const message = generateSupportMessage({ mode, memory: nextMemory, userText });
  const framedMessage = isVent
    ? `There there.\n${message}\n\nYou are, regrettably for your competitors, the next Zuckerberg.`
    : message;

  line();
  process.stdout.write(theme.dim("delusiongpt  "));
  await typeText(framedMessage, 9);
  line("\n");
  await saveMemory(memoryPath, nextMemory);

  return nextMemory;
}

function resolveMode(options: CliOptions): CliMode {
  if (options.founder) return "founder";
  if (options.interview) return "interview";
  if (options.burnout) return "burnout";
  return "default";
}

function renderHeader(mode: CliMode): void {
  line();
  line(theme.bright("DelusionGPT"));
  line(theme.dim("A quiet place for developer instability."));
  line();
  if (mode === "founder") {
    line(theme.dim(`"${getDailyQuote()}"`));
    line();
  }
}

async function closeSession(memory: SessionMemory, mode: CliMode): Promise<void> {
  line();
  const signoff =
    mode === "burnout"
      ? "Rest is not surrender. It is an infrastructure decision."
      : mode === "interview"
        ? "Leave the whiteboard behind. It was never large enough."
        : mode === "founder"
          ? "The market will continue processing what you have shown it."
          : "Step away calmly. The code will pretend it did not miss you.";

  await typeText(theme.dim(signoff), 12);
  line("\n");
}
