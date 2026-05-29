import Image from "next/image";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href="/applications"
      className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <Image
        src="/brand/intake-logo.svg"
        alt=""
        width={40}
        height={40}
        className="shrink-0 transition-transform group-hover:scale-105"
        priority
      />
      <div>
        <p className="text-sm font-semibold text-slate-900">Creator Intake Review</p>
        <p className="text-xs text-slate-500">Influur internal tool</p>
      </div>
    </Link>
  );
}

export function GlowPopMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/glowpop-mark.svg"
      alt="GlowPop brand mark"
      width={48}
      height={48}
      className={className}
    />
  );
}
