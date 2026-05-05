"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpButton } from "@/components/dashboard/help-button";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Sparkles, Calendar, Film } from "lucide-react";

export default function CreatorMissionsPage() {
  const { locale, t } = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns?active=true")
      .then((r) => r.json())
      .then((d) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const real = (d.data || []).filter((c: any) => !c.influencer?.email?.endsWith("@example.com"));
        setCampaigns(real);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.creator.missionsTitle}</h1>
          <p className="text-sm text-gray-600">{t.creator.missionsSubtitle}</p>
        </div>
        <HelpButton
          title={{ en: "Open missions", br: "Missoes abertas" }}
          content={{
            en: "Missions you can join to create and submit short-form content from church sermons.",
            br: "Missoes abertas para voce participar e gerar conteudo curto a partir de sermoes.",
          }}
        />
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="py-16 text-center">
            <p className="text-gray-600">{t.common.noResults}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => {
            let platforms: string[] = [];
            try { platforms = JSON.parse(c.platforms); } catch { /* empty */ }

            return (
              <Link key={c.id} href={`/${locale}/creator/missions/${c.id}`}>
                <Card className="transition-colors hover:bg-gray-50 bg-white border border-amber-100 rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={c.influencer.avatarUrl || undefined} />
                        <AvatarFallback>{c.influencer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{c.name}</h3>
                        <p className="text-xs text-gray-600">{t.creator.missionBy} {c.influencer.name}</p>
                      </div>
                    </div>

                    {/* Sermon thumbnails */}
                    {c.campaignVideos?.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {c.campaignVideos.map((cv: any) => cv.video.thumbnailUrl && (
                          <img
                            key={cv.video.id}
                            src={cv.video.thumbnailUrl}
                            alt={cv.video.title}
                            className="h-16 w-28 shrink-0 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-[#F5A623]" />
                        {t.common.pointsSymbol} {Math.round(c.budget).toLocaleString()} ({t.pointsModels[c.paymentModel === "cpv" ? "ppr" : "fixed_per_content" as keyof typeof t.pointsModels]})
                      </div>
                      <div className="flex items-center gap-1">
                        <Film className="h-3 w-3" />
                        {c._count.clips} {t.creator.statsContent.toLowerCase()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        {platforms.map((p) => (
                          <Badge key={p} variant="outline" className="text-[10px]">
                            {PLATFORM_LABELS[p]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
