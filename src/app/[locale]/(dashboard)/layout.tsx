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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
