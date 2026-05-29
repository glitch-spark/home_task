import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/Icons";
import type { ApplicationStatus } from "@prisma/client";

const styles: Record<ApplicationStatus, string> = {
  pending: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
  approved: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80",
  rejected: "bg-red-50 text-red-800 ring-1 ring-red-200/80",
  needs_info: "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80",
};

const dotStyles: Record<ApplicationStatus, string> = {
  pending: "bg-slate-400",
  approved: "bg-emerald-500",
  rejected: "bg-red-500",
  needs_info: "bg-amber-500",
};

const labels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  needs_info: "Needs info",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={styles[status]}>
      <StatusDot className={dotStyles[status]} />
      <span className="ml-1.5">{labels[status]}</span>
    </Badge>
  );
}
