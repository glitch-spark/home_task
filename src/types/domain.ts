import type {
  AgentRecommendation,
  AgentReview,
  AgentRun,
  ApplicationStatus,
  Campaign,
  CreatorApplication,
} from "@prisma/client";

export type LatestReviewSummary = Pick<
  AgentReview,
  "id" | "fitScore" | "recommendation" | "createdAt"
>;

export interface ApplicationListItem {
  id: string;
  creatorName: string;
  handle: string;
  platform: string;
  followers: number;
  engagementRate: number;
  status: ApplicationStatus;
  latestReview: LatestReviewSummary | null;
}

export interface ApplicationDetail extends CreatorApplication {
  campaign: Campaign;
  latestReview: AgentReview | null;
  runs: AgentRunSummary[];
}

export interface PatchApplicationInput {
  status?: ApplicationStatus;
  manualNote?: string;
}

export type AgentRunSummary = Pick<
  AgentRun,
  "id" | "status" | "errorMessage" | "createdAt" | "reviewId"
>;
