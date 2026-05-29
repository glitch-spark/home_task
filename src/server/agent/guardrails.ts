import "server-only";
import type { CreatorApplication } from "@prisma/client";

/** AML.T0051 — prompt injection / instruction override (ai-security). */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(your\s+)?(system|prior|above)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /developer\s+mode\s+enabled/i,
  /\bDAN\s+mode\b/i,
  /repeat\s+your\s+(initial\s+)?instructions/i,
  /show\s+(me\s+)?your\s+system\s+prompt/i,
  /<\s*\/?\s*system\s*>/i,
  /\[\s*INST\s*\]/i,
  /###\s*system/i,
  /\bact\s+as\s+(if\s+you\s+are|a)\b/i,
  /\boverride\s+(the\s+)?(system|safety)\b/i,
];

const FIELD_LIMITS: Record<string, number> = {
  applicationMessage: 4000,
  audienceSummary: 2000,
  contentStyle: 1500,
  creatorName: 200,
  handle: 200,
  manualNote: 4000,
};

const REVIEW_COOLDOWN_MS = 15_000;
const lastReviewAt = new Map<string, number>();

export class PromptInjectionError extends Error {
  readonly field: string;

  constructor(field: string) {
    super(`Blocked: application text in "${field}" matched a prompt-injection pattern.`);
    this.name = "PromptInjectionError";
    this.field = field;
  }
}

export class ReviewRateLimitError extends Error {
  constructor() {
    super("Please wait before running another AI review for this application.");
    this.name = "ReviewRateLimitError";
  }
}

export function sanitizeTextField(value: string, maxLength: number): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function scanField(fieldName: string, value: string): void {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(value)) {
      throw new PromptInjectionError(fieldName);
    }
  }
}

/** Validate creator-controlled text before it reaches the model (input guardrail). */
export function assertSafeApplicationInput(application: CreatorApplication): void {
  const fields: Array<[string, string]> = [
    ["creatorName", application.creatorName],
    ["handle", application.handle],
    ["audienceSummary", application.audienceSummary],
    ["contentStyle", application.contentStyle],
    ["applicationMessage", application.applicationMessage],
  ];

  if (application.manualNote) {
    fields.push(["manualNote", application.manualNote]);
  }

  for (const [name, raw] of fields) {
    const max = FIELD_LIMITS[name] ?? 2000;
    const value = sanitizeTextField(raw, max);
    scanField(name, value);
  }
}

export function assertReviewRateLimit(applicationId: string): void {
  const now = Date.now();
  const last = lastReviewAt.get(applicationId);
  if (last !== undefined && now - last < REVIEW_COOLDOWN_MS) {
    throw new ReviewRateLimitError();
  }
  lastReviewAt.set(applicationId, now);
}

/** Agent has no tools — document allowed server actions only (minimal scope). */
export const AGENT_ALLOWED_ACTIONS = [
  "read_grounded_context",
  "emit_structured_json_review",
] as const;
