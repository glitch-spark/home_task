"use client";

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
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function ApplicationFilters({
  filters,
  platforms,
  onChange,
}: ApplicationFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Status
        </span>
        <select
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

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Platform
        </span>
        <select
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

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Sort by
        </span>
        <select
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

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Order
        </span>
        <div className="flex rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
          {(["desc", "asc"] as SortOrder[]).map((order) => (
            <button
              key={order}
              type="button"
              onClick={() => onChange({ ...filters, order })}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filters.order === order
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {order === "desc" ? "High → low" : "Low → high"}
            </button>
          ))}
        </div>
      </label>
    </div>
  );
}
