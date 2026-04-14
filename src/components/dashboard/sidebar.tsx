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

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

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

  return (
    <aside className="hidden w-64 shrink-0 border-r border-amber-100 bg-white md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-amber-100 px-6">
          <div
            className="flex h-8 w-8 items-center justify-center bg-[#F5A623] text-white"
            style={{ clipPath: hexClip }}
          >
            <span className="text-sm">🐝</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{t.brand}</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 p-3">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#F5A623]/10 text-[#F5A623]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-amber-100 p-3 space-y-1">
          <Link
            href={`/${locale}/faq`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === `/${locale}/faq`
                ? "bg-[#F5A623]/10 text-[#F5A623]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <HelpCircle className="h-4 w-4" />
            {t.sidebar.howItWorks}
          </Link>
          <Link
            href={`/${locale}/ranking`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Trophy className="h-4 w-4" />
            {t.sidebar.publicRanking}
          </Link>
        </div>
      </div>
    </aside>
  );
}
