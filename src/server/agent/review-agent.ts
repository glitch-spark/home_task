import "server-only";
import type { AgentReview, AgentRun, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ApplicationNotFoundError } from "@/lib/errors";
import { callStructuredLlm } from "@/lib/llm";
import { buildGroundedContext } from "@/server/agent/context";
import {
  assertReviewRateLimit,
  assertSafeApplicationInput,
  PromptInjectionError,
  ReviewRateLimitError,
} from "@/server/agent/guardrails";
import {
  buildReviewUserMessage,
  REVIEW_SYSTEM_PROMPT,
} from "@/server/agent/prompt";
import { parseAgentReviewJson } from "@/server/agent/schemas";

export interface ReviewRunResult {
  run: AgentRun;
  review: AgentReview | null;
}

export async function runApplicationReview(
  applicationId: string
): Promise<ReviewRunResult> {
  const application = await db.creatorApplication.findUnique({
    where: { id: applicationId },
    include: { campaign: true },
  });

  if (!application) {
    throw new ApplicationNotFoundError();
  }

  const groundedContext = buildGroundedContext(
    application.campaign,
    application
  );
  const rawInput = JSON.parse(
    JSON.stringify({ groundedContext })
  ) as Prisma.InputJsonValue;

  const run = await db.agentRun.create({
    data: {
      applicationId,
      status: "failed",
      rawInput,
    },
  });

  try {
    assertReviewRateLimit(applicationId);
    assertSafeApplicationInput(application);

    const llmText = await callStructuredLlm({
      system: REVIEW_SYSTEM_PROMPT,
      user: buildReviewUserMessage(groundedContext),
    });
    const output = parseAgentReviewJson(llmText);

    const review = await db.agentReview.create({
      data: {
        applicationId,
        fitScore: output.fitScore,
        recommendation: output.recommendation,
        reasoning: output.reasoning,
        risks: output.risks,
        missingInfo: output.missingInfo,
        suggestedReply: output.suggestedReply,
      },
    });

    const updatedRun = await db.agentRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        rawOutput: { parsed: output },
        reviewId: review.id,
        errorMessage: null,
      },
    });

    return { run: updatedRun, review };
  } catch (error) {
    const message =
      error instanceof PromptInjectionError ||
      error instanceof ReviewRateLimitError
        ? error.message
        : error instanceof Error
          ? error.message
          : "AI review failed";

    const updatedRun = await db.agentRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        errorMessage: message,
        rawOutput: {
          error: message,
          code:
            error instanceof PromptInjectionError
              ? "prompt_injection"
              : error instanceof ReviewRateLimitError
                ? "rate_limit"
                : "review_failed",
        },
      },
    });
    return { run: updatedRun, review: null };
  }
}
