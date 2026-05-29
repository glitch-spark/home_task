"use client";

import Link from "next/link";
import { RecommendationBadge } from "@/components/applications/RecommendationBadge";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatEngagement, formatFollowers } from "@/lib/format";
import type { ApplicationListItem } from "@/types/domain";

export function ApplicationTable({
  applications,
}: {
  applications: ApplicationListItem[];
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
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
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3">
                <Link
                  href={`/applications/${app.id}`}
                  className="font-medium text-slate-900 hover:text-brand"
                >
                  {app.creatorName}
                </Link>
                <p className="text-sm text-slate-500">{app.handle}</p>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{app.platform}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-slate-700">
                {formatFollowers(app.followers)}
              </td>
              <td className="px-4 py-3 text-sm tabular-nums text-slate-700">
                {formatEngagement(app.engagementRate)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-sm tabular-nums text-slate-700">
                {app.latestReview ? (
                  <span className="font-semibold text-slate-900">
                    {app.latestReview.fitScore}/10
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {app.latestReview ? (
                  <RecommendationBadge
                    recommendation={app.latestReview.recommendation}
                  />
                ) : (
                  <span className="text-sm text-slate-400">Not reviewed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
