import { getCampaignById } from "@/server/campaigns/campaign.service";
import { jsonError, jsonOk } from "@/lib/api-response";

type RouteContext = { params: { campaignId: string } };

export async function GET(_request: Request, context: RouteContext) {
  const { campaignId } = context.params;
  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    return jsonError("Campaign not found", 404);
  }

  return jsonOk(campaign);
}
