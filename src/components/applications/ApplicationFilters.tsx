"use client";

import { useId } from "react";
import { IconFilter } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { ApplicationSortField, SortOrder } from "@/types/api";

export interface FilterState {
  status: string;
  platform: string;
  sort: ApplicationSortField;
  order: SortOrder;
}

interface ApplicationFiltersProps {
  filters: FilterState;
  platforms: string[];
  onChange: (next: FilterState) => void;
}

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function ApplicationFilters({
  filters,
  platforms,
  onChange,
}: ApplicationFiltersProps) {
  const statusId = useId();
  const platformId = useId();
  const sortId = useId();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand-foreground">
          <IconFilter className="h-4 w-4" />
        </span>
        Filter & sort
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block" htmlFor={statusId}>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </span>
          <select
            id={statusId}
            className={selectClass}
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_info">Needs info</option>
          </select>
        </label>

        <label className="block" htmlFor={platformId}>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Platform
          </span>
          <select
            id={platformId}
            className={selectClass}
            value={filters.platform}
            onChange={(e) => onChange({ ...filters, platform: e.target.value })}
          >
            <option value="">All platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="block" htmlFor={sortId}>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Sort by
          </span>
          <select
            id={sortId}
            className={selectClass}
            value={filters.sort}
            onChange={(e) =>
              onChange({
                ...filters,
                sort: e.target.value as ApplicationSortField,
              })
            }
          >
            <option value="createdAt">Date applied</option>
            <option value="followers">Followers</option>
            <option value="fitScore">Fit score</option>
          </select>
        </label>

        <div className="block">
          <span
            id="order-label"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500"
          >
            Order
          </span>
          <div
            className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
            role="group"
            aria-labelledby="order-label"
          >
            {(["desc", "asc"] as SortOrder[]).map((order) => (
              <button
                key={order}
                type="button"
                onClick={() => onChange({ ...filters, order })}
                aria-pressed={filters.order === order}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
                  filters.order === order
                    ? "bg-brand text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {order === "desc" ? "High → low" : "Low → high"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
