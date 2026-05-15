import process from "node:process";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import { loadMemory, saveMemory, startSession } from "../memory/store.js";
import { pickMessage } from "../services/messageCatalog.js";
import { updateMemoryFromText } from "../services/memoryExtractor.js";
import { advanceAmbientDelusion, generateSupportMessage } from "../services/supportGenerator.js";
import type { CliMode, SessionMemory } from "../types.js";
import { loadConfig } from "../utils/config.js";
import { clearScreen, line, theme, typeText } from "../utils/terminal.js";

interface CliOptions {
  founder?: boolean;
  csStudent?: boolean;
  interview?: boolean;
  burnout?: boolean;
}

export async function runCli(): Promise<void> {
  const program = new Command()
    .name("delusiongpt")
    .description("A calm terminal companion for developers whose confidence requires supervision.")
    .option("--founder", "enter founder mode")
    .option("--cs-student", "enter CS student mode")
    .option("--interview", "alias for --cs-student")
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
      const rant = await openBoxPad({
        title: "Vent pad",
        detail: "Write the incident report your genius deserves.",
        doneHint: "Type /done on its own line when finished."
      });
      if (!rant) {
        line();
        process.stdout.write(theme.dim("delusiongpt  "));
        await typeText(pickMessage("empty-vent", memory.totalTurns), 9);
        line("\n");
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

async function openBoxPad(input: {
  title: string;
  detail: string;
  doneHint: string;
}): Promise<string> {
  const width = Math.min(process.stdout.columns || 72, 64);
  const innerWidth = width - 4;
  const top = `╭${"─".repeat(width - 2)}╮`;
  const bottom = `╰${"─".repeat(width - 2)}╯`;
  const rows = [input.title, input.detail, input.doneHint];
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
        message: " ",
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
  const message = generateSupportMessage({ mode, memory: nextMemory, userText, isVent });

  line();
  process.stdout.write(theme.dim("delusiongpt  "));
  await typeText(message, 9);
  line("\n");
  await saveMemory(memoryPath, nextMemory);

  return nextMemory;
}

function resolveMode(options: CliOptions): CliMode {
  if (options.founder) return "founder";
  if (options.csStudent || options.interview) return "cs-student";
  if (options.burnout) return "burnout";
  return "default";
}

function renderHeader(mode: CliMode): void {
  line();
  line(theme.bright("DelusionGPT"));
  line(theme.dim("A quiet place for developer instability."));
  line();
  if (mode === "founder") {
    line(theme.dim(`"${pickMessage("quote", new Date().getDate())}"`));
    line();
  }
}

async function closeSession(memory: SessionMemory, mode: CliMode): Promise<void> {
  line();
  const signoff = pickMessage(`signoff:${mode}`, memory.totalTurns);

  await typeText(theme.dim(signoff), 12);
  line("\n");
}
