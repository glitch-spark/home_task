"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RecommendationBadge } from "@/components/applications/RecommendationBadge";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/StateMessage";
import { Spinner } from "@/components/ui/Spinner";
import {
  getApplication,
  patchApplication,
  runAiReview,
} from "@/lib/api-client";
import { formatDateTime, formatEngagement, formatFollowers } from "@/lib/format";
import type { ApplicationDetail } from "@/types/domain";
import type { ApplicationStatus } from "@prisma/client";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ApplicationDetailView({ id }: { id: string }) {
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getApplication(id);
    if (!result.success || !result.data) {
      setError(result.error ?? "Application not found");
      setApp(null);
    } else {
      setApp(result.data);
      setNote(result.data.manualNote ?? "");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const showBanner = (type: "success" | "error", text: string) => {
    setBanner({ type, text });
    setTimeout(() => setBanner(null), 5000);
  };

  const updateStatus = async (status: ApplicationStatus) => {
    setActionLoading(status);
    const result = await patchApplication(id, { status });
    setActionLoading(null);
    if (!result.success || !result.data) {
      showBanner("error", result.error ?? "Failed to update status");
      return;
    }
    setApp(result.data);
    showBanner("success", `Marked as ${status.replace("_", " ")}.`);
  };

  const saveNote = async () => {
    setActionLoading("note");
    const result = await patchApplication(id, { manualNote: note });
    setActionLoading(null);
    if (!result.success || !result.data) {
      showBanner("error", result.error ?? "Failed to save note");
      return;
    }
    setApp(result.data);
    showBanner("success", "Manual note saved.");
  };

  const handleRunReview = async () => {
    setActionLoading("review");
    const result = await runAiReview(id);
    setActionLoading(null);
    if (!result.success || !result.data) {
      showBanner("error", result.error ?? "AI review failed");
      await load();
      return;
    }
    if (!result.data.review) {
      showBanner(
        "error",
        result.data.message ?? "AI review did not produce a result"
      );
    } else {
      showBanner("success", "AI review completed and saved.");
    }
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (error || !app) {
    return (
      <ErrorState
        title="Could not load application"
        description={error ?? "Not found"}
        actionLabel="Back to dashboard"
        onAction={() => {
          window.location.href = "/applications";
        }}
      />
    );
  }

  const review = app.latestReview;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/applications"
            className="text-sm font-medium text-brand hover:underline"
          >
            ← Back to applications
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {app.creatorName}
          </h1>
          <p className="text-slate-600">
            {app.handle} · {app.platform}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={app.status} />
            {review && (
              <RecommendationBadge recommendation={review.recommendation} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            size="lg"
            loading={actionLoading === "review"}
            onClick={handleRunReview}
            className="w-full sm:w-auto"
          >
            Run AI Review
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              loading={actionLoading === "approved"}
              onClick={() => updateStatus("approved")}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              loading={actionLoading === "rejected"}
              onClick={() => updateStatus("rejected")}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              loading={actionLoading === "needs_info"}
              onClick={() => updateStatus("needs_info")}
            >
              Needs info
            </Button>
          </div>
        </div>
      </div>

      {banner && (
        <div
          role="status"
          className={
            banner.type === "success"
              ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          }
        >
          {banner.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Creator profile">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Followers</dt>
              <dd className="font-medium tabular-nums">
                {formatFollowers(app.followers)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Engagement</dt>
              <dd className="font-medium tabular-nums">
                {formatEngagement(app.engagementRate)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Audience</dt>
              <dd className="mt-1 text-slate-800">{app.audienceSummary}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Content style</dt>
              <dd className="mt-1 text-slate-800">{app.contentStyle}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Past brand deals</dt>
              <dd className="mt-1 text-slate-800">
                {app.pastBrandDeals.length > 0
                  ? app.pastBrandDeals.join(", ")
                  : "None listed"}
              </dd>
            </div>
          </dl>
        </Section>

        <Section title="Campaign context">
          <p className="text-lg font-semibold text-slate-900">
            {app.campaign.brandName} — {app.campaign.campaignName}
          </p>
          <p className="mt-2 text-sm text-slate-700">{app.campaign.campaignGoal}</p>
          <ul className="mt-3 list-inside list-disc text-sm text-slate-600">
            <li>Audience: {app.campaign.targetAudience}</li>
            <li>Platforms: {app.campaign.platforms.join(", ")}</li>
            <li>Budget: {app.campaign.budgetRange}</li>
          </ul>
        </Section>

        <Section title="Application message">
          <p className="text-slate-800">{app.applicationMessage}</p>
        </Section>

        <Section title="Manual note">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="Add notes for the campaign manager…"
          />
          <Button
            className="mt-3"
            variant="secondary"
            loading={actionLoading === "note"}
            onClick={saveNote}
          >
            Save manual note
          </Button>
        </Section>
      </div>

      <Section title="Latest AI recommendation">
        {review ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold tabular-nums text-slate-900">
                {review.fitScore}
                <span className="text-lg font-normal text-slate-500">/10</span>
              </span>
              <RecommendationBadge recommendation={review.recommendation} />
              <span className="text-xs text-slate-500">
                {formatDateTime(review.createdAt)}
              </span>
            </div>
            <p className="text-slate-800">{review.reasoning}</p>
            {review.risks.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Risks
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  {review.risks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.missingInfo.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Missing info
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  {review.missingInfo.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Suggested reply
              </p>
              <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
                {review.suggestedReply}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No AI review yet"
            description="Run an AI review to generate fit score, risks, and a suggested reply."
            actionLabel="Run AI Review"
            onAction={handleRunReview}
          />
        )}
      </Section>

      <Section title="Agent run history">
        {app.runs.length === 0 ? (
          <p className="text-sm text-slate-500">No agent runs recorded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {app.runs.map((run) => (
              <li
                key={run.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span
                    className={
                      run.status === "success"
                        ? "font-medium text-emerald-700"
                        : "font-medium text-red-700"
                    }
                  >
                    {run.status}
                  </span>
                  <span className="ml-2 text-slate-500">
                    {formatDateTime(run.createdAt)}
                  </span>
                </div>
                {run.errorMessage && (
                  <p className="text-red-700 sm:max-w-md sm:text-right">
                    {run.errorMessage}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
