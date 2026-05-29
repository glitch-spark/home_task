/**
 * Canonical structured output contract for Creator Intake Review Agent.
 * Kept in sync with agentReviewOutputSchema (Zod) and Prisma AgentReview.
 */
export const AGENT_REVIEW_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "fitScore",
    "recommendation",
    "reasoning",
    "risks",
    "missingInfo",
    "suggestedReply",
  ],
  properties: {
    fitScore: {
      type: "integer",
      minimum: 1,
      maximum: 10,
      description:
        "Campaign fit from 1 (poor) to 10 (excellent), based only on provided data.",
    },
    recommendation: {
      type: "string",
      enum: ["approve", "reject", "needs_info", "manual_review"],
      description:
        "Suggested next step for the campaign manager (does not change application status).",
    },
    reasoning: {
      type: "string",
      maxLength: 2000,
      description:
        "2-4 sentences citing only facts from campaign_context and application_context.",
    },
    risks: {
      type: "array",
      items: { type: "string", maxLength: 500 },
      maxItems: 8,
      description: "Concrete risks grounded in the provided data.",
    },
    missingInfo: {
      type: "array",
      items: { type: "string", maxLength: 500 },
      maxItems: 8,
      description: "Information gaps that block a confident decision.",
    },
    suggestedReply: {
      type: "string",
      maxLength: 1500,
      description:
        "Professional outreach message to the creator; do not invent deal terms or pricing.",
    },
  },
} as const;

export const AGENT_REVIEW_SCHEMA_PROMPT = `Respond with a single JSON object matching this schema (no markdown, no prose outside JSON):
{
  "fitScore": <integer 1-10>,
  "recommendation": <"approve" | "reject" | "needs_info" | "manual_review">,
  "reasoning": <string, max 2000 chars>,
  "risks": <string[]>,
  "missingInfo": <string[]>,
  "suggestedReply": <string, max 1500 chars>
}`;
