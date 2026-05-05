"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { HelpButton } from "@/components/dashboard/help-button";
import { Video, Megaphone, Eye, Film, Plus } from "lucide-react";

interface Stats {
  totalVideos: number;
  totalCampaigns: number;
  totalViews: number;
  totalClips: number;
}

export default function ChurchHomePage() {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const [stats, setStats] = useState<Stats>({ totalVideos: 0, totalCampaigns: 0, totalViews: 0, totalClips: 0 });

  useEffect(() => {
    if (!user) return;

    async function loadStats() {
      const [videosRes, campaignsRes] = await Promise.all([
        fetch(`/api/videos?influencerId=${user!.userId}`),
        fetch(`/api/campaigns?influencerId=${user!.userId}`),
      ]);

      const videosData = await videosRes.json();
      const campaignsData = await campaignsRes.json();

      const videos = videosData.data || [];
      const campaigns = campaignsData.data || [];

      const totalViews = 0;
      let totalClips = 0;
      for (const c of campaigns) {
        totalClips += c._count?.clips || 0;
      }

      setStats({
        totalVideos: videos.length,
        totalCampaigns: campaigns.length,
        totalViews,
        totalClips,
      });
    }

    loadStats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 border-b border-amber-100/80 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Dashboard · Ministry</span>
            <h1 className="font-display text-[clamp(1.85rem,3.5vw,2.75rem)] font-medium leading-[1.05] tracking-tight text-gray-900">
              {t.church.welcome.replace("{name}", user?.name || "")}
            </h1>
          </div>
          <HelpButton
            title={{ en: "Church dashboard", br: "Painel da igreja" }}
            content={{
              en: "Overview of your church: active missions, sermons, and the impact of creators turning your messages into short-form content.",
              br: "Visao geral da sua igreja: missoes ativas, sermoes e o impacto dos creators transformando suas mensagens em conteudo curto.",
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Video} label={t.church.statsSermons} value={stats.totalVideos} />
        <StatCard icon={Megaphone} label={t.church.statsMissions} value={stats.totalCampaigns} />
        <StatCard icon={Eye} label={t.church.statsReach} value={stats.totalViews.toLocaleString()} />
        <StatCard icon={Film} label={t.church.statsContent} value={stats.totalClips} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex">
        <Button render={<Link href={`/${locale}/church/sermons`} />} className="h-12 gap-2 text-base bg-[#F5A623] hover:bg-[#E09000] text-white sm:h-9 sm:text-sm">
          <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
          {t.church.quickNewSermon}
        </Button>
        <Button variant="outline" render={<Link href={`/${locale}/church/missions/new`} />} className="h-12 gap-2 text-base border-amber-100 text-gray-900 sm:h-9 sm:text-sm">
          <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
          {t.church.quickNewMission}
        </Button>
      </div>
    </div>
  );
}
