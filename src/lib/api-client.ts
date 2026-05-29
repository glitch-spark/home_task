import type { ApiResponse, ApplicationSortField, SortOrder } from "@/types";
import type { ApplicationDetail, ApplicationListItem, CampaignSummary } from "@/types/domain";
import type { AgentReview } from "@prisma/client";
import type { AgentRunSummary } from "@/types/domain";

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  return res.json() as Promise<ApiResponse<T>>;
}

export async function listApplications(params: {
  campaignId?: string;
  status?: string;
  platform?: string;
  sort?: ApplicationSortField;
  order?: SortOrder;
}) {
  const qs = new URLSearchParams();
  if (params.campaignId) qs.set("campaignId", params.campaignId);
  if (params.status) qs.set("status", params.status);
  if (params.platform) qs.set("platform", params.platform);
  if (params.sort) qs.set("sort", params.sort);
  if (params.order) qs.set("order", params.order);

  const res = await fetch(`/api/applications?${qs.toString()}`, {
    cache: "no-store",
  });
  return parseResponse<{
    campaignId: string;
    campaign: CampaignSummary | null;
    applications: ApplicationListItem[];
  }>(res);
}

export async function getApplication(id: string) {
  const res = await fetch(`/api/applications/${id}`, { cache: "no-store" });
  return parseResponse<ApplicationDetail>(res);
}

export async function patchApplication(
  id: string,
  body: { status?: string; manualNote?: string | null }
) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<ApplicationDetail>(res);
}

export async function runAiReview(id: string) {
  const res = await fetch(`/api/applications/${id}/review`, {
    method: "POST",
  });
  return parseResponse<{
    review: AgentReview | null;
    run: { id: string; status: string; errorMessage: string | null };
    message?: string;
  }>(res);
}

export async function listRuns(id: string, verbose = false) {
  const qs = verbose ? "?verbose=true" : "";
  const res = await fetch(`/api/applications/${id}/runs${qs}`, {
    cache: "no-store",
  });
  return parseResponse<{ applicationId: string; runs: AgentRunSummary[] }>(res);
}
