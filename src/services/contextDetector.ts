import type { DetectedContext } from "../types.js";

const detectors: Array<[DetectedContext, RegExp]> = [
  ["npm", /\b(npm|pnpm|yarn|package-lock|node_modules|eresolve|peer dep|dependency)\b/i],
  ["deploy", /\b(deploy|vercel|netlify|production|prod|rollback|outage|ci|build failed)\b/i],
  ["interview", /\b(interview|leetcode|whiteboard|recruiter|hiring|onsite|dynamic programming)\b/i],
  ["debugging", /\b(debug|bug|stack trace|exception|undefined|null|segfault|breakpoint)\b/i],
  ["startup", /\b(startup|founder|runway|pitch|investor|mvp|saas|revenue|traction)\b/i],
  ["burnout", /\b(burnout|tired|exhausted|overwhelmed|can't focus|cannot focus|spiral)\b/i],
  ["sleep", /\b(sleep|insomnia|3am|4am|late|all.?nighter|awake)\b/i],
  ["tests", /\b(test|jest|vitest|playwright|failing spec|coverage|assert)\b/i],
  ["architecture", /\b(architecture|refactor|microservice|monolith|database schema|api design)\b/i]
];

export function detectContext(input: string): DetectedContext {
  return detectors.find(([, pattern]) => pattern.test(input))?.[0] ?? "unknown";
}
