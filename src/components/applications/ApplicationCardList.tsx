"use client";

import Link from "next/link";
import { RecommendationBadge } from "@/components/applications/RecommendationBadge";
import { StatusBadge } from "@/components/applications/StatusBadge";
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
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{app.creatorName}</p>
                <p className="text-sm text-slate-500">{app.handle}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-slate-500">Platform</dt>
                <dd className="font-medium text-slate-800">{app.platform}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Followers</dt>
                <dd className="font-medium tabular-nums text-slate-800">
                  {formatFollowers(app.followers)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Engagement</dt>
                <dd className="font-medium tabular-nums text-slate-800">
                  {formatEngagement(app.engagementRate)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Fit score</dt>
                <dd className="font-medium tabular-nums text-slate-800">
                  {app.latestReview
                    ? `${app.latestReview.fitScore}/10`
                    : "—"}
                </dd>
              </div>
            </dl>
            {app.latestReview && (
              <div className="mt-3">
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
