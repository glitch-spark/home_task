import { Button } from "@/components/ui/Button";

interface StateMessageProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: StateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  actionLabel = "Try again",
  onAction,
}: StateMessageProps) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center"
      role="alert"
    >
      <p className="font-semibold text-red-900">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-red-800">{description}</p>
      )}
      {onAction && (
        <Button variant="outline" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
