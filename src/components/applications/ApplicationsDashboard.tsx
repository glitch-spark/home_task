"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlowPopMark } from "@/components/brand/AppLogo";
import {
  ApplicationFilters,
  type FilterState,
} from "@/components/applications/ApplicationFilters";
import { ApplicationCardList } from "@/components/applications/ApplicationCardList";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { IconInbox, IconTrendingUp, IconUsers } from "@/components/ui/Icons";
import { EmptyState, ErrorState } from "@/components/ui/StateMessage";
import { Spinner } from "@/components/ui/Spinner";
import { listApplications } from "@/lib/api-client";
import type { ApplicationListItem, CampaignSummary } from "@/types/domain";
import type { ApplicationSortField, SortOrder } from "@/types/api";

const defaultFilters: FilterState = {
  status: "",
  platform: "",
  sort: "createdAt",
  order: "desc",
};

function filtersFromParams(params: URLSearchParams): FilterState {
  return {
    status: params.get("status") ?? "",
    platform: params.get("platform") ?? "",
    sort: (params.get("sort") as ApplicationSortField) || "createdAt",
    order: (params.get("order") as SortOrder) || "desc",
  };
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {value}
          </p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand-foreground">
          {icon}
        </span>
      </div>
    </div>
  );
}

export function ApplicationsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromParams(searchParams)
  );
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [campaign, setCampaign] = useState<CampaignSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncUrl = useCallback(
    (next: FilterState) => {
      const params = new URLSearchParams();
      if (next.status) params.set("status", next.status);
      if (next.platform) params.set("platform", next.platform);
      if (next.sort !== "createdAt") params.set("sort", next.sort);
      if (next.order !== "desc") params.set("order", next.order);
      const qs = params.toString();
      router.replace(qs ? `/applications?${qs}` : "/applications", {
        scroll: false,
      });
    },
    [router]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await listApplications({
      status: filters.status || undefined,
      platform: filters.platform || undefined,
      sort: filters.sort,
      order: filters.order,
    });
    if (!result.success || !result.data) {
      setError(result.error ?? "Failed to load applications");
      setApplications([]);
      setCampaign(null);
    } else {
      setApplications(result.data.applications);
      setCampaign(result.data.campaign);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const platforms = useMemo(() => {
    const set = new Set(applications.map((a) => a.platform));
    return Array.from(set).sort();
  }, [applications]);

  const stats = useMemo(() => {
    const pending = applications.filter((a) => a.status === "pending").length;
    const reviewed = applications.filter((a) => a.latestReview).length;
    const avgFit =
      reviewed > 0
        ? (
            applications
              .filter((a) => a.latestReview)
              .reduce((sum, a) => sum + (a.latestReview?.fitScore ?? 0), 0) /
            reviewed
          ).toFixed(1)
        : "—";
    return { pending, reviewed, avgFit };
  }, [applications]);

  const handleFilterChange = (next: FilterState) => {
    setFilters(next);
    syncUrl(next);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div className="relative bg-gradient-to-br from-brand-light via-white to-white px-6 py-6 sm:px-8 sm:py-8">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand/5 blur-2xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground">
              Campaign intake
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Creator applications
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Review intake, run AI fit checks, and update decisions for your
              active campaign.
            </p>
            {campaign && (
              <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-brand/15 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <GlowPopMark className="h-10 w-10 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {campaign.brandName} — {campaign.campaignName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {campaign.platforms.join(" · ")} · {campaign.budgetRange}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!loading && !error && applications.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Total applications"
            value={applications.length}
            icon={<IconUsers className="h-5 w-5" />}
          />
          <StatCard
            label="Pending review"
            value={stats.pending}
            icon={<IconInbox className="h-5 w-5" />}
          />
          <StatCard
            label="Avg. fit score"
            value={stats.avgFit}
            icon={<IconTrendingUp className="h-5 w-5" />}
          />
        </div>
      )}

      <ApplicationFilters
        filters={filters}
        platforms={platforms}
        onChange={handleFilterChange}
      />

      {loading && (
        <div className="flex justify-center py-20" aria-live="polite">
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <ErrorState
          title="Could not load applications"
          description={error}
          onAction={load}
        />
      )}

      {!loading && !error && applications.length === 0 && (
        <EmptyState
          title="No applications match your filters"
          description="Try clearing filters or seed the database with npm run db:seed."
          actionLabel="Clear filters"
          onAction={() => handleFilterChange(defaultFilters)}
        />
      )}

      {!loading && !error && applications.length > 0 && (
        <>
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {applications.length}
            </span>{" "}
            application{applications.length === 1 ? "" : "s"}
          </p>
          <ApplicationTable applications={applications} />
          <ApplicationCardList applications={applications} />
        </>
      )}
    </div>
  );
}
