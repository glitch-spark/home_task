export const dynamic = "force-dynamic";

import {
  applicationIdParamsSchema,
  runsQuerySchema,
} from "@/server/applications/application.validators";
import {
  applicationExists,
  listApplicationRuns,
} from "@/server/applications/application.service";
import { jsonError, jsonOk } from "@/lib/api-response";
import { handleRouteError } from "@/lib/errors";

type RouteContext = { params: { id: string } };

export async function GET(request: Request, context: RouteContext) {
  try {
    const params = applicationIdParamsSchema.safeParse(context.params);
    if (!params.success) {
      return jsonError("Invalid application id", 400);
    }

    const exists = await applicationExists(params.data.id);
    if (!exists) {
      return jsonError("Application not found", 404);
    }

    const url = new URL(request.url);
    const query = runsQuerySchema.safeParse({
      verbose: url.searchParams.get("verbose") ?? undefined,
    });
    const verbose = query.success ? query.data.verbose : false;

    const runs = await listApplicationRuns(params.data.id, verbose);
    return jsonOk({ applicationId: params.data.id, runs });
  } catch (error) {
    return handleRouteError(error);
  }
}
