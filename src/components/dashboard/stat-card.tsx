import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
}

export function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  return (
    <Card className="border-amber-100 bg-white">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F5A623]/10">
          <Icon className="h-6 w-6 text-[#F5A623]" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{typeof value === "number" ? value.toLocaleString("en-US") : value}</p>
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
