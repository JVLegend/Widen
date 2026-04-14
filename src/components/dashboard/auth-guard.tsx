"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRole?: "influencer" | "clipper";
}

export function AuthGuard({ children, allowedRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Extract locale from pathname (e.g., /en/church -> "en")
  const localeMatch = pathname.match(/^\/([a-z]{2})\//);
  const locale = localeMatch ? localeMatch[1] : "en";

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (allowedRole && user.role !== allowedRole) {
      router.replace(user.role === "influencer" ? `/${locale}/church` : `/${locale}/creator`);
    }
  }, [user, isLoading, allowedRole, router, locale]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;
  if (allowedRole && user.role !== allowedRole) return null;

  return <>{children}</>;
}
