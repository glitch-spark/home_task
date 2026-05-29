import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  icon,
  children,
  className,
  id,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-foreground">
            {icon}
          </span>
        )}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {title}
        </h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
