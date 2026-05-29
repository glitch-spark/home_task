import {
  getApplicationById,
  listApplicationReviews,
} from "@/server/applications/application.service";
import { jsonError, jsonOk } from "@/lib/api-response";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = context.params;

  const exists = await getApplicationById(id);
  if (!exists) {
    return jsonError("Application not found", 404);
  }

  const reviews = await listApplicationReviews(id);
  return jsonOk(reviews);
}
