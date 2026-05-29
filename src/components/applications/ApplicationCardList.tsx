"use client";

import Link from "next/link";
import { RecommendationBadge } from "@/components/applications/RecommendationBadge";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { CreatorAvatar } from "@/components/ui/CreatorAvatar";
import { FitScoreRing } from "@/components/ui/FitScoreRing";
import { PlatformIcon } from "@/components/ui/Icons";
import { formatEngagement, formatFollowers } from "@/lib/format";
import type { ApplicationListItem } from "@/types/domain";

export function ApplicationCardList({
  applications,
}: {
  applications: ApplicationListItem[];
}) {
  return (
    <ul className="grid gap-3 md:hidden">
      {applications.map((app) => (
        <li key={app.id}>
          <Link
            href={`/applications/${app.id}`}
            aria-label={`View application for ${app.creatorName}`}
            className="block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <div className="flex items-start gap-3">
              <CreatorAvatar name={app.creatorName} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {app.creatorName}
                    </p>
                    <p className="text-sm text-slate-500">{app.handle}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-3">
                  <PlatformIcon platform={app.platform} showLabel />
                </div>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Followers</dt>
                <dd className="font-semibold tabular-nums text-slate-800">
                  {formatFollowers(app.followers)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Engagement</dt>
                <dd className="font-semibold tabular-nums text-slate-800">
                  {formatEngagement(app.engagementRate)}
                </dd>
              </div>
            </dl>
            {app.latestReview && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <FitScoreRing score={app.latestReview.fitScore} size="sm" />
                <RecommendationBadge
                  recommendation={app.latestReview.recommendation}
                />
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
