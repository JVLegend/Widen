"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Eye, Film, Sparkles, Megaphone, Plus, ArrowRight } from "lucide-react";

type ClipSummary = {
  id: string;
  platform: string;
  status: string;
  views: number;
  earnings: number;
  createdAt: string;
  campaign: { id: string; name: string };
  video: { id: string; title: string; thumbnailUrl: string | null };
  socialAccount: { id: string; handle: string };
};

export default function CreatorHomePage() {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const [clips, setClips] = useState<ClipSummary[]>([]);
  const [campaignCount, setCampaignCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/clips?clipperId=${user.userId}`).then((r) => r.json()),
      fetch("/api/campaigns?active=true").then((r) => r.json()),
    ]).then(([clipData, campData]) => {
      setClips(clipData.data || []);
      setCampaignCount((campData.data || []).length);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    );
  }

  const totalViews = clips.reduce((sum, c) => sum + c.views, 0);
  const totalEarnings = clips.reduce((sum, c) => sum + c.earnings, 0);
  const recentClips = clips.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 border-b border-amber-100/80 pb-6">
        <span className="eyebrow">Dashboard · Creator</span>
        <h1 className="font-display text-[clamp(1.85rem,3.5vw,2.75rem)] font-medium leading-[1.05] tracking-tight text-gray-900">
          {t.creator.welcome.replace("{name}", user?.name || t.roles.creator)}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Film} label={t.creator.statsContent} value={clips.length} />
        <StatCard icon={Eye} label={t.creator.statsReach} value={totalViews.toLocaleString()} />
        <StatCard icon={Sparkles} label={t.creator.statsPoints} value={`${t.common.pointsSymbol} ${Math.round(totalEarnings).toLocaleString()}`} />
        <StatCard icon={Megaphone} label={t.creator.statsActiveMissions} value={campaignCount} />
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Button render={<Link href={`/${locale}/creator/missions`} />} variant="outline" className="h-auto flex-col gap-2 p-5 text-base active:scale-[0.98] border-amber-100 text-gray-900 sm:p-4 sm:text-sm">
          <Megaphone className="h-6 w-6 sm:h-5 sm:w-5" />
          <span>{t.creator.quickViewMissions}</span>
        </Button>
        <Button render={<Link href={`/${locale}/creator/content/new`} />} variant="outline" className="h-auto flex-col gap-2 p-5 text-base active:scale-[0.98] border-amber-100 text-gray-900 sm:p-4 sm:text-sm">
          <Plus className="h-6 w-6 sm:h-5 sm:w-5" />
          <span>{t.creator.quickSubmitContent}</span>
        </Button>
        <Button render={<Link href={`/${locale}/creator/content`} />} variant="outline" className="h-auto flex-col gap-2 p-5 text-base active:scale-[0.98] border-amber-100 text-gray-900 sm:p-4 sm:text-sm">
          <Film className="h-6 w-6 sm:h-5 sm:w-5" />
          <span>{t.creator.quickMyContent}</span>
        </Button>
      </div>

      {/* Recent content */}
      <Card className="bg-white border border-amber-100 rounded-xl">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base text-gray-900">{t.creator.recentContent}</CardTitle>
          {clips.length > 5 && (
            <Button render={<Link href={`/${locale}/creator/content`} />} variant="ghost" size="sm" className="gap-1 text-xs text-gray-600">
              {t.common.viewAll} <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentClips.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-600">{t.creator.noContent}</p>
          ) : (
            <div className="space-y-3">
              {recentClips.map((clip) => (
                <div key={clip.id} className="flex items-center gap-3 rounded-lg border border-amber-100 p-3">
                  {clip.video.thumbnailUrl && (
                    <img src={clip.video.thumbnailUrl} alt="" className="h-10 w-16 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900">{clip.campaign.name}</p>
                    <p className="text-xs text-gray-600">
                      {PLATFORM_LABELS[clip.platform]} • @{clip.socialAccount.handle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{clip.views.toLocaleString()} {t.common.reach}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {t.creator.contentStatus[clip.status as keyof typeof t.creator.contentStatus] || clip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
