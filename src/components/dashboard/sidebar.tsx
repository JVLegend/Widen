"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import {
  Home,
  Video,
  Megaphone,
  BarChart3,
  Settings,
  Trophy,
  Share2,
  Film,
  HelpCircle,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { locale, t } = useLocale();

  const churchLinks = [
    { href: `/${locale}/church`, label: t.sidebar.home, icon: Home },
    { href: `/${locale}/church/sermons`, label: t.sidebar.sermons, icon: Video },
    { href: `/${locale}/church/missions`, label: t.sidebar.missions, icon: Megaphone },
    { href: `/${locale}/church/analytics`, label: t.sidebar.analytics, icon: BarChart3 },
    { href: `/${locale}/church/settings`, label: t.sidebar.settings, icon: Settings },
  ];

  const creatorLinks = [
    { href: `/${locale}/creator`, label: t.sidebar.home, icon: Home },
    { href: `/${locale}/creator/missions`, label: t.sidebar.missions, icon: Megaphone },
    { href: `/${locale}/creator/content`, label: t.sidebar.myContent, icon: Film },
    { href: `/${locale}/creator/social-accounts`, label: t.sidebar.socialAccounts, icon: Share2 },
    { href: `/${locale}/creator/analytics`, label: t.sidebar.analytics, icon: BarChart3 },
    { href: `/${locale}/creator/settings`, label: t.sidebar.settings, icon: Settings },
  ];

  const links = user?.role === "influencer" ? churchLinks : creatorLinks;
  const rolePrefix = user?.role === "influencer" ? `/${locale}/church` : `/${locale}/creator`;
  const roleLabel = user?.role === "influencer" ? t.roles.church : t.roles.creator;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-amber-100/80 bg-[#FFFDF6] md:block">
      <div className="flex h-full flex-col">
        {/* Logo block — editorial wordmark */}
        <div className="flex h-20 items-center gap-3 border-b border-amber-100/80 px-6">
          <div className="hex-clip bee-pulse flex h-10 w-10 items-center justify-center bg-gradient-to-br from-[#F5A623] to-[#E09000] text-white">
            <span className="text-base">🐝</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] font-medium tracking-tight text-gray-900">
              {t.brand}
            </span>
            <span className="eyebrow mt-1">{roleLabel}</span>
          </div>
        </div>

        {/* Section label */}
        <div className="px-6 pt-6 pb-2">
          <span className="eyebrow">Navigation</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 px-3">
          {links.map((link) => {
            const isActive =
              link.href === rolePrefix
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-amber-200/80"
                    : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
                )}
              >
                {/* Hexagonal active indicator */}
                <span
                  className={cn(
                    "hex-clip flex h-6 w-6 shrink-0 items-center justify-center transition-all",
                    isActive
                      ? "bg-[#F5A623] text-white shadow-[0_2px_8px_rgba(245,166,35,0.45)]"
                      : "bg-transparent text-gray-500 group-hover:bg-amber-100/50 group-hover:text-[#F5A623]"
                  )}
                >
                  <link.icon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1">{link.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom block */}
        <div className="border-t border-amber-100/80 px-3 py-4 space-y-0.5">
          <Link
            href={`/${locale}/faq`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === `/${locale}/faq`
                ? "bg-white text-gray-900 ring-1 ring-amber-200/80"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
            )}
          >
            <HelpCircle className="h-4 w-4" />
            {t.sidebar.howItWorks}
          </Link>
          <Link
            href={`/${locale}/ranking`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/60 hover:text-gray-900"
          >
            <Trophy className="h-4 w-4" />
            {t.sidebar.publicRanking}
          </Link>

          {/* Decorative honeycomb card */}
          <div className="mt-4 relative overflow-hidden rounded-xl border border-amber-200/70 bg-gradient-to-br from-[#FFF4D6] to-[#FFE9B0] p-4">
            <div
              className="absolute -right-3 -top-3 h-16 w-16 opacity-30 hex-clip bg-[#F5A623]"
            />
            <p className="eyebrow text-[#8A5A00]">Tip</p>
            <p className="mt-1 text-xs leading-snug text-[#6B4500]">
              {user?.role === "influencer"
                ? "Publish a new sermon to reach more creators."
                : "Sync YouTube metrics to unlock rewards faster."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
