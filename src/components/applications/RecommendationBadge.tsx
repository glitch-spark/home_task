import { Badge } from "@/components/ui/Badge";
import { formatRecommendation } from "@/lib/format";
import type { AgentRecommendation } from "@prisma/client";

const styles: Record<AgentRecommendation, string> = {
  approve: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  reject: "bg-red-50 text-red-800 ring-1 ring-red-200",
  needs_info: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  manual_review: "bg-violet-50 text-violet-800 ring-1 ring-violet-200",
};

export function RecommendationBadge({
  recommendation,
}: {
  recommendation: AgentRecommendation;
}) {
  return (
    <Badge className={styles[recommendation]}>
      {formatRecommendation(recommendation)}
    </Badge>
  );
}
