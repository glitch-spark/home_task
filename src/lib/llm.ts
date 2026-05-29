import "server-only";
import { getServerEnv } from "@/lib/env";

const LLM_TIMEOUT_MS = 60_000;
const LLM_MAX_OUTPUT_TOKENS = 1200;

export interface StructuredLlmRequest {
  system: string;
  user: string;
  model?: string;
}

/**
 * Server-only LLM access. API keys must never use NEXT_PUBLIC_* or client bundles.
 * This module must only be imported from server-only code paths.
 */
export function getLlmApiKey(): string {
  const key = getServerEnv().OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY is not set. Configure it in .env.local (server-only)."
    );
  }
  return key;
}

export async function callStructuredLlm(
  request: StructuredLlmRequest
): Promise<string> {
  const apiKey = getLlmApiKey();
  const model = request.model ?? "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: LLM_MAX_OUTPUT_TOKENS,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: request.system },
        { role: "user", content: request.user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content) {
    throw new Error("LLM returned an empty response");
  }
  return content;
}

/** @deprecated Use callStructuredLlm — kept for compatibility */
export async function callLlm(prompt: string): Promise<string> {
  return callStructuredLlm({
    system: "You are a helpful assistant. Respond with valid JSON when asked.",
    user: prompt,
  });
}
