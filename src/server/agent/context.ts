import "server-only";
import type { Campaign, CreatorApplication } from "@prisma/client";

/** Canonical snapshot passed to the model — only DB-sourced fields. */
export interface GroundedReviewContext {
  campaign: {
    brandName: string;
    campaignName: string;
    campaignGoal: string;
    targetAudience: string;
    platforms: string[];
    budgetRange: string;
    requirements: string[];
    brandSafetyNotes: string;
  };
  application: {
    id: string;
    creatorName: string;
    handle: string;
    platform: string;
    followers: number;
    engagementRate: number;
    audienceSummary: string;
    contentStyle: string;
    applicationMessage: string;
    pastBrandDeals: string[];
    status: string;
  };
}

export function buildGroundedContext(
  campaign: Campaign,
  application: CreatorApplication
): GroundedReviewContext {
  return {
    campaign: {
      brandName: campaign.brandName,
      campaignName: campaign.campaignName,
      campaignGoal: campaign.campaignGoal,
      targetAudience: campaign.targetAudience,
      platforms: [...campaign.platforms],
      budgetRange: campaign.budgetRange,
      requirements: [...campaign.requirements],
      brandSafetyNotes: campaign.brandSafetyNotes,
    },
    application: {
      id: application.id,
      creatorName: application.creatorName,
      handle: application.handle,
      platform: application.platform,
      followers: application.followers,
      engagementRate: application.engagementRate,
      audienceSummary: application.audienceSummary,
      contentStyle: application.contentStyle,
      applicationMessage: application.applicationMessage,
      pastBrandDeals: [...application.pastBrandDeals],
      status: application.status,
    },
  };
}
