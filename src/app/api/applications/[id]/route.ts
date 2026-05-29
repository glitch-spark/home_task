import {
  applicationIdParamsSchema,
  patchApplicationBodySchema,
} from "@/server/applications/application.validators";
import {
  getApplicationById,
  patchApplication,
} from "@/server/applications/application.service";
import { jsonError, jsonOk } from "@/lib/api-response";
import { handleRouteError } from "@/lib/errors";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = applicationIdParamsSchema.safeParse(context.params);
    if (!params.success) {
      return jsonError("Invalid application id", 400);
    }

    const application = await getApplicationById(params.data.id);
    if (!application) {
      return jsonError("Application not found", 404);
    }

    return jsonOk(application);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const params = applicationIdParamsSchema.safeParse(context.params);
    if (!params.success) {
      return jsonError("Invalid application id", 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = patchApplicationBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid body", 400);
    }

    const detail = await patchApplication(params.data.id, {
      status: parsed.data.status,
      manualNote: parsed.data.manualNote ?? undefined,
    });

    return jsonOk(detail);
  } catch (error) {
    return handleRouteError(error);
  }
}
