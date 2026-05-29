"use client";

import Link from "next/link";
import { RecommendationBadge } from "@/components/applications/RecommendationBadge";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { CreatorAvatar } from "@/components/ui/CreatorAvatar";
import { FitScoreRing } from "@/components/ui/FitScoreRing";
import { PlatformIcon } from "@/components/ui/Icons";
import { formatEngagement, formatFollowers } from "@/lib/format";
import type { ApplicationListItem } from "@/types/domain";

export function ApplicationTable({
  applications,
}: {
  applications: ApplicationListItem[];
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card md:block">
      <table
        className="min-w-full divide-y divide-slate-100"
        aria-label="Creator applications"
      >
        <caption className="sr-only">
          Creator applications with platform, followers, engagement, status, fit
          score, and AI recommendation
        </caption>
        <thead className="bg-slate-50/80">
          <tr>
            {[
              "Creator",
              "Platform",
              "Followers",
              "Engagement",
              "Status",
              "Fit",
              "AI recommendation",
            ].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="transition-colors hover:bg-brand-light/30"
            >
              <td className="px-4 py-3.5">
                <Link
                  href={`/applications/${app.id}`}
                  aria-label={`View application for ${app.creatorName}`}
                  className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <CreatorAvatar name={app.creatorName} size="sm" />
                  <div>
                    <span className="font-medium text-slate-900 group-hover:text-brand-foreground">
                      {app.creatorName}
                    </span>
                    <p className="text-sm text-slate-500">{app.handle}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <PlatformIcon platform={app.platform} showLabel />
              </td>
              <td className="px-4 py-3.5 text-sm tabular-nums text-slate-700">
                {formatFollowers(app.followers)}
              </td>
              <td className="px-4 py-3.5 text-sm tabular-nums text-slate-700">
                {formatEngagement(app.engagementRate)}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3.5">
                {app.latestReview ? (
                  <FitScoreRing score={app.latestReview.fitScore} size="sm" />
                ) : (
                  <span className="text-sm text-slate-500">Not reviewed</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                {app.latestReview ? (
                  <RecommendationBadge
                    recommendation={app.latestReview.recommendation}
                  />
                ) : (
                  <span className="text-sm text-slate-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
