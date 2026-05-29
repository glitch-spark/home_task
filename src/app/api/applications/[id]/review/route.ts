import { applicationIdParamsSchema } from "@/server/applications/application.validators";
import { runApplicationReview } from "@/server/agent/review-agent";
import { jsonError, jsonOk } from "@/lib/api-response";
import { handleRouteError } from "@/lib/errors";

type RouteContext = { params: { id: string } };

/** Server-only: LLM key never exposed; review invoked only via this route. */
export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: RouteContext) {
  try {
    const params = applicationIdParamsSchema.safeParse(context.params);
    if (!params.success) {
      return jsonError("Invalid application id", 400);
    }

    const { run, review } = await runApplicationReview(params.data.id);

    if (!review) {
      const output = run.rawOutput as { code?: string } | null;
      const status =
        output?.code === "rate_limit"
          ? 429
          : output?.code === "prompt_injection"
            ? 400
            : 422;
      return jsonOk(
        {
          review: null,
          run,
          message: run.errorMessage ?? "AI review failed",
        },
        status
      );
    }

    return jsonOk({ review, run }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
