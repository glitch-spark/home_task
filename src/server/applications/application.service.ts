import "server-only";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ApplicationNotFoundError, isPrismaNotFound } from "@/lib/errors";
import type {
  ApplicationDetail,
  ApplicationListItem,
  PatchApplicationInput,
} from "@/types/domain";
import type { ApplicationSortField, SortOrder } from "@/types/api";

function toListItem(
  row: Prisma.CreatorApplicationGetPayload<{
    include: { reviews: { take: 1; orderBy: { createdAt: "desc" } } };
  }>
): ApplicationListItem {
  const latest = row.reviews[0] ?? null;
  return {
    id: row.id,
    creatorName: row.creatorName,
    handle: row.handle,
    platform: row.platform,
    followers: row.followers,
    engagementRate: row.engagementRate,
    status: row.status,
    latestReview: latest
      ? {
          id: latest.id,
          fitScore: latest.fitScore,
          recommendation: latest.recommendation,
          createdAt: latest.createdAt,
        }
      : null,
  };
}

export async function listApplications(params: {
  campaignId: string;
  status?: ApplicationStatus;
  platform?: string;
  sort?: ApplicationSortField;
  order?: SortOrder;
}): Promise<ApplicationListItem[]> {
  const where: Prisma.CreatorApplicationWhereInput = {
    campaignId: params.campaignId,
  };

  if (params.status) {
    where.status = params.status;
  }
  if (params.platform) {
    where.platform = { equals: params.platform, mode: "insensitive" };
  }

  const order = params.order ?? "desc";
  const sort = params.sort ?? "createdAt";

  const rows = await db.creatorApplication.findMany({
    where,
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy:
      sort === "followers"
        ? { followers: order }
        : sort === "createdAt"
          ? { createdAt: order }
          : { createdAt: "desc" },
  });

  const items = rows.map(toListItem);

  if (sort === "fitScore") {
    items.sort((a, b) => {
      const aScore = a.latestReview?.fitScore ?? -1;
      const bScore = b.latestReview?.fitScore ?? -1;
      return order === "asc" ? aScore - bScore : bScore - aScore;
    });
  }

  return items;
}

export async function getApplicationById(
  id: string
): Promise<ApplicationDetail | null> {
  const row = await db.creatorApplication.findUnique({
    where: { id },
    include: {
      campaign: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      runs: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          status: true,
          errorMessage: true,
          createdAt: true,
          reviewId: true,
        },
      },
    },
  });

  if (!row) return null;

  const { reviews, runs, ...application } = row;
  return {
    ...application,
    latestReview: reviews[0] ?? null,
    runs,
  };
}

export async function patchApplication(
  id: string,
  input: PatchApplicationInput
) {
  const data: Prisma.CreatorApplicationUpdateInput = {};
  if (input.status !== undefined) data.status = input.status;
  if (input.manualNote !== undefined) data.manualNote = input.manualNote;

  try {
    await db.creatorApplication.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (isPrismaNotFound(error)) {
      throw new ApplicationNotFoundError();
    }
    throw error;
  }

  const detail = await getApplicationById(id);
  if (!detail) {
    throw new ApplicationNotFoundError();
  }
  return detail;
}

export async function listApplicationRuns(
  applicationId: string,
  verbose = false
) {
  return db.agentRun.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
    select: verbose
      ? {
          id: true,
          applicationId: true,
          status: true,
          errorMessage: true,
          createdAt: true,
          reviewId: true,
          rawInput: true,
          rawOutput: true,
        }
      : {
          id: true,
          status: true,
          errorMessage: true,
          createdAt: true,
          reviewId: true,
        },
  });
}

export async function listApplicationReviews(applicationId: string) {
  return db.agentReview.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function applicationExists(id: string): Promise<boolean> {
  const count = await db.creatorApplication.count({ where: { id } });
  return count > 0;
}
