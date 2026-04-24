"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/dashboard/auth-guard";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChurch = pathname.includes("/church");
  const isCreator = pathname.includes("/creator");
  const allowedRole = isChurch ? "influencer" as const : isCreator ? "clipper" as const : undefined;

  return (
    <AuthGuard allowedRole={allowedRole}>
      <div className="relative flex min-h-screen bg-honeycomb-soft">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="relative flex-1 px-4 py-6 md:px-8 md:py-8">
            <div key={pathname} className="rise mx-auto max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
