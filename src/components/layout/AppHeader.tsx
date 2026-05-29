import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/applications" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white"
            aria-hidden
          >
            IR
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Creator Intake Review
            </p>
            <p className="text-xs text-slate-500">Influur internal tool</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
