"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
      <p className="max-w-md text-center text-sm text-gray-600">
        An unexpected error occurred. Please try again or contact support.
      </p>
      <Button onClick={reset} className="bg-[#F5A623] text-white hover:bg-[#e09510]">
        Try again
      </Button>
    </div>
  );
}
