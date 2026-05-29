"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { GlowPopMark } from "@/components/brand/AppLogo";
import { RecommendationBadge } from "@/components/applications/RecommendationBadge";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CreatorAvatar } from "@/components/ui/CreatorAvatar";
import { FitScoreRing } from "@/components/ui/FitScoreRing";
import {
  IconChevronLeft,
  IconHistory,
  IconMegaphone,
  IconMessage,
  IconNote,
  IconSparkles,
  IconUsers,
  PlatformIcon,
} from "@/components/ui/Icons";
import { SectionCard } from "@/components/ui/SectionCard";
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

export function ApplicationDetailView({ id }: { id: string }) {
  const noteFieldId = useId();
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
      <div className="flex justify-center py-24" aria-live="polite">
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
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div className="bg-gradient-to-br from-brand-light/80 via-white to-white px-5 py-6 sm:px-8 sm:py-8">
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-foreground hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <IconChevronLeft className="h-4 w-4" />
            Back to applications
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <CreatorAvatar name={app.creatorName} size="xl" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {app.creatorName}
                </h1>
                <p className="mt-1 text-slate-600">{app.handle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <PlatformIcon platform={app.platform} showLabel />
                  <StatusBadge status={app.status} />
                  {review && (
                    <RecommendationBadge recommendation={review.recommendation} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto lg:items-end">
              <Button
                size="lg"
                loading={actionLoading === "review"}
                onClick={handleRunReview}
                className="w-full shadow-brand sm:w-auto"
              >
                <IconSparkles className="h-4 w-4" />
                Run AI Review
              </Button>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Update application status"
              >
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
        </div>
      </div>

      {banner && (
        <div
          role={banner.type === "error" ? "alert" : "status"}
          aria-live={banner.type === "error" ? "assertive" : "polite"}
          className={
            banner.type === "success"
              ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          }
        >
          {banner.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Creator profile"
          icon={<IconUsers className="h-4 w-4" />}
        >
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Followers
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                {formatFollowers(app.followers)}
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Engagement
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                {formatEngagement(app.engagementRate)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Audience
              </dt>
              <dd className="mt-1 leading-relaxed text-slate-800">
                {app.audienceSummary}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Content style
              </dt>
              <dd className="mt-1 leading-relaxed text-slate-800">
                {app.contentStyle}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Past brand deals
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {app.pastBrandDeals.length > 0 ? (
                  app.pastBrandDeals.map((deal) => (
                    <span
                      key={deal}
                      className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-hover ring-1 ring-brand/15"
                    >
                      {deal}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">None listed</span>
                )}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard
          title="Campaign context"
          icon={<IconMegaphone className="h-4 w-4" />}
        >
          <div className="flex items-start gap-3">
            <GlowPopMark className="h-12 w-12 shrink-0" />
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {app.campaign.brandName} — {app.campaign.campaignName}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {app.campaign.campaignGoal}
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Audience: </span>
              {app.campaign.targetAudience}
            </li>
            <li className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Platforms: </span>
              {app.campaign.platforms.join(", ")}
            </li>
            <li className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Budget: </span>
              {app.campaign.budgetRange}
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Application message"
          icon={<IconMessage className="h-4 w-4" />}
        >
          <blockquote className="rounded-xl border-l-4 border-brand bg-brand-light/50 px-4 py-3 italic text-slate-800">
            &ldquo;{app.applicationMessage}&rdquo;
          </blockquote>
        </SectionCard>

        <SectionCard
          title="Manual note"
          icon={<IconNote className="h-4 w-4" />}
        >
          <label htmlFor={noteFieldId} className="sr-only">
            Manual note for campaign manager
          </label>
          <textarea
            id={noteFieldId}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
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
        </SectionCard>
      </div>

      <SectionCard
        title="Latest AI recommendation"
        icon={<IconSparkles className="h-4 w-4" />}
      >
        {review ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <FitScoreRing score={review.fitScore} size="lg" />
              <div>
                <RecommendationBadge recommendation={review.recommendation} />
                <p className="mt-2 text-xs text-slate-500">
                  Reviewed {formatDateTime(review.createdAt)}
                </p>
              </div>
            </div>
            <p className="leading-relaxed text-slate-800">{review.reasoning}</p>
            {review.risks.length > 0 && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                  Risks
                </p>
                <ul className="mt-2 space-y-1 text-sm text-amber-950">
                  {review.risks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.missingInfo.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Missing info
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {review.missingInfo.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Suggested reply
              </p>
              <p className="mt-2 rounded-xl border border-brand/15 bg-brand-light/40 p-4 text-sm leading-relaxed text-slate-800">
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
      </SectionCard>

      <SectionCard
        title="Agent run history"
        icon={<IconHistory className="h-4 w-4" />}
      >
        {app.runs.length === 0 ? (
          <p className="text-sm text-slate-500">No agent runs recorded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {app.runs.map((run) => (
              <li
                key={run.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      run.status === "success"
                        ? "inline-flex items-center gap-1.5 font-medium text-emerald-700"
                        : "inline-flex items-center gap-1.5 font-medium text-red-700"
                    }
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        run.status === "success" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      aria-hidden="true"
                    />
                    {run.status}
                  </span>
                  <span className="text-slate-500">
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
      </SectionCard>
    </div>
  );
}
