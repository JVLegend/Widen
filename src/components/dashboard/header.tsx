"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  LogOut,
  Settings,
  User as UserIcon,
  Home,
  Video,
  Megaphone,
  BarChart3,
  Film,
  Share2,
  Trophy,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function Header() {
  const { user, logout } = useAuth();
  const { locale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
  const settingsHref = user?.role === "influencer" ? `/${locale}/church/settings` : `/${locale}/creator/settings`;

  // Language switcher: toggle between en and br
  const otherLocale = locale === "en" ? "br" : "en";
  const switchLangPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  function handleLogout() {
    logout();
    router.push(`/${locale}`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-amber-100/80 bg-white/80 backdrop-blur-md px-4 md:px-8">
      {/* Mobile menu */}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon-lg" />}>
            <Menu className="h-6 w-6 text-gray-900" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white p-0">
            <div className="flex h-16 items-center gap-2 border-b border-amber-100 px-6">
              <div
                className="flex h-8 w-8 items-center justify-center bg-[#F5A623] text-white"
                style={{ clipPath: hexClip }}
              >
                <span className="text-sm">🐝</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{t.brand}</span>
            </div>
            <nav className="space-y-1.5 p-3">
              {links.map((link) => {
                const isActive =
                  link.href === rolePrefix
                    ? pathname === link.href
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors active:scale-[0.98]",
                      isActive
                        ? "bg-[#F5A623]/10 text-[#F5A623]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-amber-100 pt-2 mt-2">
                <Link
                  href={`/${locale}/ranking`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]"
                >
                  <Trophy className="h-5 w-5" />
                  {t.sidebar.publicRanking}
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Page title area */}
      <div className="hidden md:block" />

      {/* User menu */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* Language switcher */}
        <Link
          href={switchLangPath}
          className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-amber-300 hover:bg-white hover:text-gray-900"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline uppercase tracking-wider">{locale === "en" ? "EN" : "BR"}</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 outline-none hover:bg-gray-50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} />
              <AvatarFallback className="bg-[#F5A623]/10 text-[#F5A623]">{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex md:flex-col md:items-start">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-600">{roleLabel}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-amber-100">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={settingsHref} className="flex items-center gap-2 w-full text-gray-900">
                <UserIcon className="h-4 w-4" />
                {t.header.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={settingsHref} className="flex items-center gap-2 w-full text-gray-900">
                <Settings className="h-4 w-4" />
                {t.header.settings}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4" />
              {t.header.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
