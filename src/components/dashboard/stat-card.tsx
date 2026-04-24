import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
}

export function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  const displayValue = typeof value === "number" ? value.toLocaleString("en-US") : value;

  return (
    <div className="group card-editorial relative overflow-hidden p-5">
      {/* Decorative honeycomb cell — floats in the corner */}
      <div
        aria-hidden
        className="hex-clip pointer-events-none absolute -right-6 -top-6 h-24 w-24 bg-gradient-to-br from-[#FFF1CF] to-[#FFE3A0] opacity-60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
      />
      <div
        aria-hidden
        className="hex-clip pointer-events-none absolute -right-3 top-10 h-10 w-10 bg-[#F5A623]/15"
      />

      <div className="relative flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center hex-clip bg-[#F5A623] text-white shadow-[0_4px_14px_-2px_rgba(245,166,35,0.55)]">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="relative mt-6">
        <p className="eyebrow">{label}</p>
        <p className="numeric-display mt-1 text-4xl font-medium text-gray-900 leading-none">
          {displayValue}
        </p>
        {description && (
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        )}
      </div>

      {/* Bottom hairline accent */}
      <div
        aria-hidden
        className="relative mt-5 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#F5A623] via-[#F5A623]/40 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </div>
  );
}
