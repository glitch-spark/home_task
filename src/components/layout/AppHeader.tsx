import { AppLogo } from "@/components/brand/AppLogo";
import { IconSparkles } from "@/components/ui/Icons";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Primary">
          <AppLogo />
        </nav>
        <div className="hidden items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-xs font-medium text-brand-foreground sm:flex">
          <IconSparkles className="h-3.5 w-3.5" />
          AI-assisted review
        </div>
      </div>
    </header>
  );
}
