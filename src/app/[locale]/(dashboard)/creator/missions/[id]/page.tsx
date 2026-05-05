"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpButton } from "@/components/dashboard/help-button";
import { PLATFORM_LABELS } from "@/lib/constants";
import { ArrowLeft, Send, Calendar, Sparkles, Play } from "lucide-react";

export default function CreatorMissionDetailPage() {
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

  let platforms: string[] = [];
  try { platforms = JSON.parse(campaign.platforms); } catch { /* empty */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={campaign.influencer.avatarUrl || undefined} />
              <AvatarFallback>{campaign.influencer.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{t.creator.missionBy} {campaign.influencer.name}</span>
          </div>
        </div>
        <HelpButton
          title={{ en: "Mission detail", br: "Detalhes da missao" }}
          content={{
            en: "Mission details, available sermons and rules. Submit your clips here.",
            br: "Detalhes da missao, sermoes disponiveis e regras. Submeta seus cortes aqui.",
          }}
        />
        <Button render={<Link href={`/${locale}/creator/content/new?missionId=${campaign.id}`} />} className="gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
          <Send className="h-4 w-4" />
          {t.creator.submitContentBtn}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="flex items-center gap-3 p-4">
            <Sparkles className="h-5 w-5 text-[#F5A623]" />
            <div>
              <p className="text-sm text-gray-600">{t.creator.pointsInfo}</p>
              <p className="font-medium text-gray-900">
                {campaign.paymentModel === "cpv"
                  ? `${t.common.pointsSymbol} ${campaign.cpvRate} per ${t.common.reach}`
                  : `${t.common.pointsSymbol} ${Math.round(campaign.fixedRate || 0)} per content`}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">{t.creator.missionPeriod}</p>
              <p className="font-medium text-gray-900">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="flex items-center gap-3 p-4">
            <Send className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">{t.creator.targetPlatforms}</p>
              <div className="flex gap-1">
                {platforms.map((p) => (
                  <Badge key={p} variant="outline" className="text-xs">
                    {PLATFORM_LABELS[p]}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {campaign.instructions && (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardHeader><CardTitle className="text-base text-gray-900">{t.creator.instructions}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{campaign.instructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Sermons */}
      <Card className="bg-white border border-amber-100 rounded-xl">
        <CardHeader><CardTitle className="text-base text-gray-900">{t.creator.availableSermons}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {campaign.campaignVideos?.map((cv: any) => (
            <div key={cv.video.id} className="flex items-center gap-3 rounded-lg border border-amber-100 p-3">
              {cv.video.thumbnailUrl && (
                <img src={cv.video.thumbnailUrl} alt="" className="h-16 w-28 rounded object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{cv.video.title}</p>
                <p className="text-xs text-gray-600">{PLATFORM_LABELS[cv.video.platform]}</p>
              </div>
              {cv.video.originalUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-amber-200"
                  render={<a href={cv.video.originalUrl} target="_blank" rel="noopener noreferrer" />}
                >
                  <Play className="h-3.5 w-3.5" />
                  {locale === "br" ? "Assistir" : "Watch"}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
