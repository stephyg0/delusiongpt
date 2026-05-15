# DelusionGPT

DelusionGPT is a calm, premium-feeling terminal companion for stressed developers. Run it and it immediately gives you a restrained, delusional support message. Press Enter for another, or type what happened if you want another message from its curated local response bank.

It begins as a sincere developer wellness tool. It does not necessarily remain well.

```bash
npx delusiongpt
```

## Features

- Interactive conversational CLI
- Instant support messages on launch
- Mood escalation over time
- A general message bank for npm errors, deploys, CS coursework, debugging, startup ideas, burnout, and lack of sleep
- Local JSON session memory for your name, projects, goals, and repeated frustrations
- Founder, CS student, and burnout modes
- Late-night tone shifts
- Restrained terminal styling
- No network calls, API keys, or AI provider setup
- Editable response copy in `messages.txt`

## Setup

```bash
npm install
npm run build
```

## Usage

```bash
npm run dev
```

The default flow:

```text
DelusionGPT
A quiet place for developer instability.

delusiongpt  Your failed build is not a setback.
It is the first measurable sign that your architecture has exceeded local reality.

> enter · vent · q
```

Press Enter for another message, type `vent` to open a boxed CLI notepad for a longer rant, or type `q` to leave. Finish the pad by typing `/done` on its own line. DelusionGPT responds with another local reassurance.

## Editing Messages

All response copy lives in [`messages.txt`](messages.txt).

Sections look like this:

```text
[default]
The compiler is scared because you are moving fast emotionally.
---
Do not worry.
You are the next Zuckerberg, but with better variable names.
```

Add new messages under an existing section and separate them with `---`.

After building:

```bash
node dist/index.js
```

Modes:

```bash
delusiongpt --founder
delusiongpt --cs-student
delusiongpt --burnout
```

Inside the app, type `q`, `exit`, `quit`, or `goodnight` to leave.

## Packaging

The package is configured with:

```json
{
  "bin": {
    "delusiongpt": "./dist/index.js"
  }
}
```

Publish after running:

```bash
npm run build
npm publish
```

## Local Memory

By default, memory is stored at:

```text
~/.delusiongpt/memory.json
```

Override it with:

```bash
DELUSIONGPT_MEMORY_PATH=/path/to/memory.json
```
