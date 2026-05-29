import { Badge } from "@/components/ui/Badge";
import type { ApplicationStatus } from "@prisma/client";

const styles: Record<ApplicationStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  needs_info: "bg-amber-100 text-amber-900",
};

const labels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  needs_info: "Needs info",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}
