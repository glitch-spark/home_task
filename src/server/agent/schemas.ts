import { z } from "zod";

export const agentReviewOutputSchema = z.object({
  fitScore: z.number().int().min(1).max(10),
  recommendation: z.enum([
    "approve",
    "reject",
    "needs_info",
    "manual_review",
  ]),
  reasoning: z.string().min(1).max(2000),
  risks: z.array(z.string().max(500)).max(8),
  missingInfo: z.array(z.string().max(500)).max(8),
  suggestedReply: z.string().min(1).max(1500),
});

export type AgentReviewOutput = z.infer<typeof agentReviewOutputSchema>;

export function parseAgentReviewJson(raw: string): AgentReviewOutput {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    : trimmed;

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Model response was not valid JSON");
  }

  return agentReviewOutputSchema.parse(parsed);
}
