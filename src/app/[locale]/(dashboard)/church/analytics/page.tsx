"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/charts/chart-card";
import { LineChart } from "@/components/dashboard/charts/line-chart";
import { BarChart } from "@/components/dashboard/charts/bar-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Eye, Film, Megaphone, TrendingUp } from "lucide-react";

type Analytics = {
  totalViews: number;
  totalClips: number;
  totalCampaigns: number;
  activeCampaigns: number;
  viewsByPlatform: Record<string, number>;
  topClippers: { id: string; name: string; avatarUrl: string | null; views: number; clips: number }[];
  viewsTimeline: { date: string; views: number }[];
  clipsByStatus: Record<string, number>;
};

export default function ChurchAnalyticsPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/analytics/influencer?influencerId=${user.userId}`)
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

  const statusData = Object.entries(data.clipsByStatus).map(([status, count]) => ({
    name: t.creator.contentStatus[status as keyof typeof t.creator.contentStatus] || status,
    count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.church.analyticsTitle}</h1>
        <p className="text-sm text-gray-600">{t.church.manageProfile}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Eye} label={t.church.totalReach} value={data.totalViews.toLocaleString()} />
        <StatCard icon={Film} label={t.church.totalContent} value={data.totalClips} />
        <StatCard icon={Megaphone} label={t.church.totalMissions} value={data.totalCampaigns} />
        <StatCard icon={TrendingUp} label={t.church.activeMissionsCount} value={data.activeCampaigns} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t.church.reachOverTime}>
          {data.viewsTimeline.length > 0 ? (
            <LineChart data={data.viewsTimeline} xKey="date" yKey="views" />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>

        <ChartCard title={t.church.reachByPlatform}>
          {platformData.length > 0 ? (
            <BarChart data={platformData} xKey="name" yKey="views" />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t.church.statusDistribution}>
          {statusData.length > 0 ? (
            <DonutChart data={statusData} nameKey="name" valueKey="count" height={250} />
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>

        <ChartCard title={t.church.topCreators}>
          {data.topClippers.length > 0 ? (
            <div className="space-y-3">
              {data.topClippers.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-bold text-gray-600">{i + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.avatarUrl || undefined} />
                    <AvatarFallback>{c.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-600">{c.clips} {t.creator.statsContent.toLowerCase()}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{c.views.toLocaleString()} {t.common.reach}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-gray-600">{t.common.noResults}</p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
