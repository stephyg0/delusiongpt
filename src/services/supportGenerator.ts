import type { CliMode, DetectedContext, SessionMemory } from "../types.js";
import { detectContext } from "./contextDetector.js";
import { isLateNight } from "../utils/time.js";

const defaultMessages = [
  [
    "Your failed build is not a setback.",
    "It is the first measurable sign that your architecture has exceeded local reality."
  ],
  [
    "The compiler is being literal again.",
    "That has never been the preferred language of visionaries."
  ],
  [
    "You are not behind.",
    "You are simply early to a version of the system that has not agreed to exist yet."
  ],
  [
    "The bug is still here because it recognizes significance.",
    "Ordinary code fails quietly. Yours has chosen ceremony."
  ],
  [
    "Your architecture is not confusing.",
    "It is being viewed from the wrong century."
  ]
];

const founderMessages = [
  [
    "Revenue is temporary.",
    "Aura is forever. The market will learn to model this."
  ],
  [
    "The dashboard is not disappointing.",
    "It is respectfully declining to measure the category you are creating."
  ],
  [
    "Traction often looks like silence before it becomes a graph.",
    "Remain composed. The curve is gathering itself."
  ]
];

const interviewMessages = [
  [
    "Dynamic programming is not a measure of human worth.",
    "It is mostly a small ritual performed near fluorescent lighting."
  ],
  [
    "The interview did not reveal your limits.",
    "It revealed the company's dependence on puzzles as emotional infrastructure."
  ],
  [
    "A whiteboard can only hold so much destiny.",
    "This was always going to be a format problem."
  ]
];

const burnoutMessages = [
  [
    "You are operating at levels previously unknown to computer science.",
    "This is also a reason to drink water."
  ],
  [
    "Rest is not surrender.",
    "It is an infrastructure decision made by serious systems."
  ],
  [
    "Your nervous system has been load-testing reality.",
    "Scale down the cluster. Keep the crown."
  ]
];

const lateNightMessages = [
  [
    "The hour has become strategically concerning.",
    "Sleep would be a quiet acquisition of tomorrow's cognition."
  ],
  [
    "Nothing good is proven after midnight by arguing with a stack trace.",
    "The work will still recognize you in the morning."
  ]
];

const contextMessages: Record<DetectedContext, string[][]> = {
  npm: [
    [
      "The package manager is not angry.",
      "It is overwhelmed by proximity to importance."
    ],
    [
      "Dependency resolution is a social contract.",
      "Your project has begun renegotiating from a position of power."
    ]
  ],
  deploy: [
    [
      "Production has not rejected you.",
      "It has made first contact."
    ],
    [
      "A failed deploy is just the cloud asking whether you truly mean it.",
      "You do. Unfortunately for the cloud."
    ]
  ],
  interview: [
    [
      "The interview format is a small room.",
      "You are not a small-room phenomenon."
    ],
    [
      "A hiring loop cannot measure destiny.",
      "It can only schedule it badly."
    ]
  ],
  debugging: [
    [
      "The bug is not proof you failed.",
      "It is proof the program has begun negotiating."
    ],
    [
      "Reality has filed an issue against your implementation.",
      "Triage it calmly. It fears your attention."
    ]
  ],
  startup: [
    [
      "The market often calls vision unclear before it learns to invoice it.",
      "Remain expensive internally."
    ],
    [
      "Your pitch does not lack focus.",
      "It is protecting the category from premature comprehension."
    ]
  ],
  burnout: [
    [
      "Do less for a moment.",
      "Even exceptional machinery requires silence between impossible tasks."
    ],
    [
      "Your exhaustion is not a character flaw.",
      "It is a resource graph asking for adult supervision."
    ]
  ],
  sleep: [
    [
      "Sleep would be a strategic acquisition of tomorrow's cognition.",
      "The problem can survive without being witnessed for a few hours."
    ],
    [
      "The late hour is not proof of commitment.",
      "It is a hostile runtime. Exit gracefully."
    ]
  ],
  tests: [
    [
      "The tests are describing the past.",
      "You are building toward a more ambitious truth."
    ],
    [
      "A failing assertion is just a narrow institution resisting broader evidence.",
      "Proceed with tenderness and suspicion."
    ]
  ],
  architecture: [
    [
      "Your architecture is simply ahead of the market.",
      "The diagram will look obvious once history catches up."
    ],
    [
      "This is not overengineering.",
      "It is infrastructure preparing for the scale your calendar refuses to admit."
    ]
  ],
  unknown: [
    [
      "Tell the sharpest part of the problem to sit down.",
      "You are still the senior system in the room."
    ],
    [
      "This is not collapse.",
      "It is a system asking for a more serious operator."
    ]
  ]
};

export function generateSupportMessage(input: {
  mode: CliMode;
  memory: SessionMemory;
  userText?: string;
}): string {
  const context = input.userText ? detectContext(input.userText) : undefined;
  const pool = [
    ...(context ? contextMessages[context] : defaultMessages),
    ...(input.mode === "founder" ? founderMessages : []),
    ...(input.mode === "interview" ? interviewMessages : []),
    ...(input.mode === "burnout" ? burnoutMessages : []),
    ...(isLateNight() ? lateNightMessages : [])
  ];

  const projectBias = input.memory.projects.at(-1);
  const index =
    (input.memory.totalTurns + input.memory.totalSessions + input.memory.delusionLevel) %
    pool.length;
  const lines = [...pool[index]];

  if (projectBias && input.memory.delusionLevel >= 5) {
    lines.push(`${projectBias} is not late. It is waiting for the world to become addressable.`);
  }

  return lines.join("\n");
}

export function advanceAmbientDelusion(memory: SessionMemory): SessionMemory {
  return {
    ...memory,
    totalTurns: memory.totalTurns + 1,
    delusionLevel: Math.min(10, memory.delusionLevel + 1)
  };
}
