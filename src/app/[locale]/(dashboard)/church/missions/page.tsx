"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Plus, Megaphone, Film, Calendar } from "lucide-react";
import { HelpButton } from "@/components/dashboard/help-button";
import type { Campaign } from "@prisma/client";

type CampaignWithDetails = Campaign & {
  influencer: { id: string; name: string };
  campaignVideos: { video: { title: string } }[];
  _count: { clips: number };
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
  draft: "outline",
};

export default function ChurchMissionsPage() {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    fetch(`/api/campaigns?influencerId=${user.userId}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setCampaigns(data.data || []); setLoading(false); } });
    return () => { cancelled = true; };
  }, [user]);

  const active = campaigns.filter((c) => c.status === "active");
  const paused = campaigns.filter((c) => c.status === "paused");
  const drafts = campaigns.filter((c) => c.status === "draft");
  const ended = campaigns.filter((c) => c.status === "completed");

  function CampaignCard({ campaign: c }: { campaign: CampaignWithDetails }) {
    let platforms: string[] = [];
    try { platforms = JSON.parse(c.platforms); } catch { /* empty */ }

    return (
      <Link href={`/${locale}/church/missions/${c.id}`}>
        <Card className="transition-colors hover:bg-gray-50 active:scale-[0.99] bg-white border border-amber-100 rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-900">{c.name}</h3>
              <Badge variant={statusVariant[c.status] || "outline"} className="text-[10px]">
                {t.missionStatuses[c.status as keyof typeof t.missionStatuses] || c.status}
              </Badge>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Megaphone className="h-3 w-3" />
                {t.common.pointsSymbol} {Math.round(c.budget).toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Film className="h-3 w-3" />
                {c._count.clips} {t.church.statsContent.toLowerCase()}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 truncate">
                {platforms.map((p) => PLATFORM_LABELS[p] || p).join(", ")}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.church.missionsTitle}</h1>
          <p className="text-sm text-gray-600">{campaigns.length} {t.church.statsMissions.toLowerCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <HelpButton
            title={{ en: "How to use — My Campaigns", br: "Como usar — Minhas Campanhas" }}
            content={{
              en: [
                "Active: campaigns live and accepting clips.",
                "Paused: campaigns temporarily stopped and hidden from creators.",
                "Drafts: campaigns you saved but haven't published. Tap to open and edit.",
                "Ended: completed campaigns that no longer accept clips.",
                "Tap 'New mission' to launch a campaign and pick sermons for creators to clip.",
              ],
              br: [
                "Ativas: campanhas no ar aceitando cortes.",
                "Pausadas: campanhas temporariamente interrompidas e ocultas para creators.",
                "Rascunhos: campanhas salvas mas nao publicadas. Toque para abrir e editar.",
                "Encerradas: campanhas concluidas que nao aceitam mais cortes.",
                "Toque em 'Nova missao' para lancar uma campanha e escolher sermoes para os creators cortarem.",
              ],
            }}
          />
          <Button render={<Link href={`/${locale}/church/missions/new`} />} className="h-12 w-full gap-2 text-base bg-[#F5A623] hover:bg-[#E09000] text-white sm:h-9 sm:w-auto sm:text-sm">
            <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            {t.church.newMission}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="flex-1 py-2.5 text-sm sm:flex-initial sm:py-1.5">{t.church.activeMissions} ({active.length})</TabsTrigger>
          <TabsTrigger value="paused" className="flex-1 py-2.5 text-sm sm:flex-initial sm:py-1.5">{t.church.pausedMissions} ({paused.length})</TabsTrigger>
          <TabsTrigger value="drafts" className="flex-1 py-2.5 text-sm sm:flex-initial sm:py-1.5">{t.church.draftMissions} ({drafts.length})</TabsTrigger>
          <TabsTrigger value="ended" className="flex-1 py-2.5 text-sm sm:flex-initial sm:py-1.5">{t.church.completedMissions} ({ended.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {active.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">{t.church.noActiveMissions}</p>
          ) : active.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </TabsContent>

        <TabsContent value="paused" className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {paused.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">{t.church.noPaused}</p>
          ) : paused.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </TabsContent>

        <TabsContent value="drafts" className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {drafts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">{t.church.noDrafts}</p>
          ) : drafts.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </TabsContent>

        <TabsContent value="ended" className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {ended.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">{t.church.noCompleted}</p>
          ) : ended.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
