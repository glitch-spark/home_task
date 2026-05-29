import "server-only";
import { db } from "@/lib/db";

export async function getCampaignById(campaignId: string) {
  return db.campaign.findUnique({
    where: { id: campaignId },
  });
}

export async function getDefaultCampaign() {
  return db.campaign.findFirst({
    orderBy: { createdAt: "asc" },
  });
}
