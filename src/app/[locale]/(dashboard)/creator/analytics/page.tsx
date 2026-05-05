"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/charts/chart-card";
import { LineChart } from "@/components/dashboard/charts/line-chart";
import { BarChart } from "@/components/dashboard/charts/bar-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { PLATFORM_LABELS } from "@/lib/constants";
import { HelpButton } from "@/components/dashboard/help-button";
import { Eye, Film, Sparkles, TrendingUp } from "lucide-react";

type Analytics = {
  totalViews: number;
  totalEarnings: number;
  totalClips: number;
  viewsByPlatform: Record<string, number>;
  campaignPerformance: { id: string; name: string; earnings: number; views: number; clips: number }[];
  viewsTimeline: { date: string; views: number }[];
  earningsTimeline: { date: string; earnings: number }[];
};

export default function CreatorAnalyticsPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/analytics/clipper?clipperId=${user.userId}`)
      .then((r) => r.json())
      .then((d) => { setData(d.data); setLoading(false); });
  }, [user]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    );
  }

  const platformData = Object.entries(data.viewsByPlatform).map(([platform, views]) => ({
    name: PLATFORM_LABELS[platform] || platform,
    views,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.creator.analyticsTitle}</h1>
          <p className="text-sm text-gray-600">{t.creator.manageProfile}</p>
        </div>
        <HelpButton
          title={{ en: "Your analytics", br: "Seus analytics" }}
          content={{
            en: "Metrics for your clips: views, engagement, and impact across missions and platforms.",
            br: "Metricas dos seus cortes: views, engajamento e impacto em missoes e plataformas.",
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Eye} label={t.creator.totalReach} value={data.totalViews.toLocaleString()} />
        <StatCard icon={Film} label={t.creator.totalContent} value={data.totalClips} />
        <StatCard icon={Sparkles} label={t.creator.totalPoints} value={`${t.common.pointsSymbol} ${Math.round(data.totalEarnings).toLocaleString()}`} />
        <StatCard icon={TrendingUp} label={t.creator.activeMissions} value={data.campaignPerformance.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t.creator.reachOverTime}>
          {data.viewsTimeline.length > 0 ? (
            <LineChart data={data.viewsTimeline} xKey="date" yKey="views" />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>

        <ChartCard title={t.creator.pointsByMonth}>
          {data.earningsTimeline.length > 0 ? (
            <LineChart data={data.earningsTimeline} xKey="date" yKey="earnings" color="var(--color-chart-3)" />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t.creator.reachByPlatform}>
          {platformData.length > 0 ? (
            <DonutChart data={platformData} nameKey="name" valueKey="views" height={250} />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>

        <ChartCard title={t.creator.activeMissions}>
          {data.campaignPerformance.length > 0 ? (
            <BarChart data={data.campaignPerformance} xKey="name" yKey="views" />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
