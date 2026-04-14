"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stat-card";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Eye, Film, Sparkles, Pause, Play, ArrowLeft } from "lucide-react";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}`)
      .then((r) => r.json())
      .then((d) => { setCampaign(d.data); setLoading(false); });
  }, [params.id]);

  async function toggleStatus() {
    if (!campaign) return;
    const newStatus = campaign.status === "active" ? "paused" : "active";
    await fetch(`/api/campaigns/${campaign.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setCampaign({ ...campaign, status: newStatus });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    );
  }

  if (!campaign) {
    return <p className="py-20 text-center text-gray-600">{t.common.noResults}</p>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalViews = campaign.clips?.reduce((sum: number, c: any) => sum + c.views, 0) || 0;
  const totalClips = campaign.clips?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{t.missionStatuses[campaign.status as keyof typeof t.missionStatuses]}</Badge>
            <span className="text-sm text-gray-600">
              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={toggleStatus} className="gap-2 border-amber-100 text-gray-900">
          {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {campaign.status === "active" ? t.church.togglePause : t.church.toggleActive}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Eye} label={t.church.statsReach} value={totalViews.toLocaleString()} />
        <StatCard icon={Film} label={t.church.statsContent} value={totalClips} />
        <StatCard icon={Sparkles} label={t.church.missionBudget} value={`${t.common.pointsSymbol} ${Math.round(campaign.budget).toLocaleString()}`} />
      </div>

      {campaign.instructions && (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardHeader><CardTitle className="text-base text-gray-900">{t.church.missionInstructions}</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-600">{campaign.instructions}</p></CardContent>
        </Card>
      )}

      {/* Content table */}
      <Card className="bg-white border border-amber-100 rounded-xl">
        <CardHeader><CardTitle className="text-base text-gray-900">{t.church.contentReceived} ({totalClips})</CardTitle></CardHeader>
        <CardContent>
          {totalClips === 0 ? (
            <p className="py-4 text-center text-sm text-gray-600">{t.church.noMissions}</p>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {campaign.clips.map((clip: any) => (
                <div key={clip.id} className="flex items-center gap-3 rounded-lg border border-amber-100 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={clip.clipper.avatarUrl || undefined} />
                    <AvatarFallback>{clip.clipper.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{clip.clipper.name}</p>
                    <p className="text-xs text-gray-600">
                      {PLATFORM_LABELS[clip.platform]} {clip.socialAccount?.handle ? `• ${clip.socialAccount.handle}` : ""}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-gray-900">{clip.views.toLocaleString()} {t.common.reach}</p>
                    <Badge variant="outline" className="text-xs">
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
