import { cn } from "@/lib/utils";

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-brand-foreground";
  return "text-amber-600";
}

function ringColor(score: number): string {
  if (score >= 8) return "stroke-emerald-500";
  if (score >= 5) return "stroke-brand";
  return "stroke-amber-500";
}

export function FitScoreRing({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100));
  const dims = size === "sm" ? 40 : size === "lg" ? 72 : 56;
  const stroke = size === "sm" ? 3 : 4;
  const radius = (dims - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="img"
      aria-label={`Fit score ${score} out of 10`}
    >
      <svg width={dims} height={dims} className="-rotate-90" aria-hidden="true">
        <circle
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-100"
        />
        <circle
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500", ringColor(score))}
        />
      </svg>
      <span
        className={cn(
          "absolute font-bold tabular-nums",
          scoreColor(score),
          size === "sm" ? "text-xs" : size === "lg" ? "text-2xl" : "text-base"
        )}
      >
        {score}
      </span>
    </div>
  );
}
