export const dynamic = "force-dynamic";

import { listApplicationsQuerySchema } from "@/server/applications/application.validators";
import { listApplications } from "@/server/applications/application.service";
import { getDefaultCampaign } from "@/server/campaigns/campaign.service";
import { jsonError, jsonOk } from "@/lib/api-response";
import { handleRouteError } from "@/lib/errors";
import type { ApplicationSortField, SortOrder } from "@/types/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = listApplicationsQuerySchema.safeParse({
      campaignId: url.searchParams.get("campaignId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      platform: url.searchParams.get("platform") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
      order: url.searchParams.get("order") ?? undefined,
    });

    if (!parsed.success) {
      return jsonError(parsed.error.flatten().fieldErrors.toString(), 400);
    }

    let campaignId = parsed.data.campaignId;
    if (!campaignId) {
      const campaign = await getDefaultCampaign();
      if (!campaign) {
        return jsonError(
          "No campaign found. Run: npm run db:migrate:deploy && npm run db:seed",
          404
        );
      }
      campaignId = campaign.id;
    }

    const items = await listApplications({
      campaignId,
      status: parsed.data.status,
      platform: parsed.data.platform,
      sort: parsed.data.sort as ApplicationSortField | undefined,
      order: parsed.data.order as SortOrder | undefined,
    });

    return jsonOk({ campaignId, applications: items });
  } catch (error) {
    return handleRouteError(error);
  }
}
