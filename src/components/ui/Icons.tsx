import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function IconSparkles({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.2 4.2L17.4 8.6 13.2 9.8 12 14l-1.2-4.2L6.6 8.6l4.2-1.4L12 3zM5 17l.8 2.8L8.6 20.6 5.8 21.4 5 24l-.8-2.6L1.4 20.6l2.8-.8L5 17zM19 15l.8 2.8L22.6 18.6 19.8 19.4 19 22l-.8-2.6L15.4 18.6l2.8-.8L19 15z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM3 20a7 7 0 0 1 14 0H3zM17 11.5a3.5 3.5 0 1 1 0 7H17v-7zM17 20h6a5 5 0 0 0-9.9-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconFilter({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconAlertCircle({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconInbox({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6zM4 10h4l2 3h4l2-3h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMegaphone({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 10v4h3l5 4V6L8 10H5zM16 8.8a4 4 0 0 1 0 6.4M18.5 6.5a7 7 0 0 1 0 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMessage({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 6h14v10H9l-4 3V6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconNote({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4h10v16H7V4zM9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconHistory({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTrendingUp({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 16l5-5 4 4 7-8M15 7h5v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TikTokIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66a5.78 5.78 0 0 0-5.78 5.78 5.78 5.78 0 0 0 5.78 5.78 5.78 5.78 0 0 0 5.78-5.78V8.69a7.27 7.27 0 0 0 4.09 1.25V6.84a4.28 4.28 0 0 1-1.06-.02z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm6-1.25a1.25 1.25 0 1 0 1.25 1.25A1.25 1.25 0 0 0 18 6.25zM12 9a3 3 0 1 1-3 3 3 3 0 0 1 3-3z" />
    </svg>
  );
}

function YouTubeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.09 5 12 5 12 5s-6.09 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.91 19 12 19 12 19s6.09 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

function GenericPlatformIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const PLATFORM_STYLES: Record<string, { icon: typeof TikTokIcon; className: string }> = {
  tiktok: { icon: TikTokIcon, className: "text-slate-900" },
  instagram: { icon: InstagramIcon, className: "text-pink-600" },
  youtube: { icon: YouTubeIcon, className: "text-red-600" },
};

export function PlatformIcon({
  platform,
  className,
  showLabel = false,
}: {
  platform: string;
  className?: string;
  showLabel?: boolean;
}) {
  const key = platform.toLowerCase();
  const config = PLATFORM_STYLES[key] ?? {
    icon: GenericPlatformIcon,
    className: "text-slate-500",
  };
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200/80",
          config.className
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      {showLabel && <span className="text-sm font-medium text-slate-700">{platform}</span>}
    </span>
  );
}

export function StatusDot({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", className)}
      aria-hidden="true"
    />
  );
}
