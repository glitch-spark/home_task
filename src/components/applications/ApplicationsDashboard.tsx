"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ApplicationFilters,
  type FilterState,
} from "@/components/applications/ApplicationFilters";
import { ApplicationCardList } from "@/components/applications/ApplicationCardList";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { EmptyState, ErrorState } from "@/components/ui/StateMessage";
import { Spinner } from "@/components/ui/Spinner";
import { listApplications } from "@/lib/api-client";
import type { ApplicationListItem } from "@/types/domain";
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

export function ApplicationsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromParams(searchParams)
  );
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
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
    } else {
      setApplications(result.data.applications);
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

  const handleFilterChange = (next: FilterState) => {
    setFilters(next);
    syncUrl(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Creator applications
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Review intake, run AI fit checks, and update decisions.
        </p>
      </div>

      <ApplicationFilters
        filters={filters}
        platforms={platforms}
        onChange={handleFilterChange}
      />

      {loading && (
        <div className="flex justify-center py-20">
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
          <p className="text-sm text-slate-500">
            {applications.length} application
            {applications.length === 1 ? "" : "s"}
          </p>
          <ApplicationTable applications={applications} />
          <ApplicationCardList applications={applications} />
        </>
      )}
    </div>
  );
}
