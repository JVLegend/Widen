"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t.church.welcome.replace("{name}", user?.name || "")}
        </h1>
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
