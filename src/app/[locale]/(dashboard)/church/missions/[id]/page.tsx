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
import { Eye, Film, Sparkles, Pause, Play, ArrowLeft, Pencil, OctagonX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", budget: "", instructions: "", startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [ending, setEnding] = useState(false);

  function openEdit() {
    if (!campaign) return;
    setEditForm({
      name: campaign.name || "",
      budget: String(campaign.budget ?? ""),
      instructions: campaign.instructions || "",
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().slice(0, 10) : "",
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : "",
    });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!campaign) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          budget: parseFloat(editForm.budget) || 0,
          instructions: editForm.instructions,
          startDate: editForm.startDate,
          endDate: editForm.endDate,
        }),
      });
      if (res.ok) {
        const j = await res.json();
        setCampaign({ ...campaign, ...j.data });
        setEditOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}`)
      .then((r) => r.json())
      .then((d) => { setCampaign(d.data); setLoading(false); });
  }, [params.id]);

  async function toggleStatus() {
    if (!campaign || campaign.status === "completed") return;
    const newStatus = campaign.status === "active" ? "paused" : "active";
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setCampaign({ ...campaign, status: newStatus });
    } finally {
      setStatusSaving(false);
    }
  }

  async function endMission() {
    if (!campaign || campaign.status === "completed") return;
    const confirmed = window.confirm(
      locale === "br"
        ? "Encerrar esta missão agora? Ela deixará de aceitar novos conteúdos."
        : "End this mission now? It will stop accepting new content.",
    );
    if (!confirmed) return;

    setEnding(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (res.ok) setCampaign({ ...campaign, status: "completed" });
    } finally {
      setEnding(false);
    }
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
        <Button variant="outline" onClick={openEdit} className="gap-2 border-amber-100 text-gray-900">
          <Pencil className="h-4 w-4" />
          {locale === "br" ? "Editar" : "Edit"}
        </Button>
        {campaign.status !== "completed" && (
          <>
            <Button
              variant="outline"
              onClick={toggleStatus}
              disabled={statusSaving}
              className="gap-2 border-amber-100 text-gray-900"
            >
              {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {campaign.status === "active" ? t.church.togglePause : t.church.toggleActive}
            </Button>
            <Button
              variant="destructive"
              onClick={endMission}
              disabled={ending}
              className="gap-2"
            >
              <OctagonX className="h-4 w-4" />
              {ending ? t.church.endingMission : t.church.endMission}
            </Button>
          </>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "br" ? "Editar missao" : "Edit mission"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label>{t.church.missionName}</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="bg-white border-amber-100" />
            </div>
            <div className="space-y-1">
              <Label>{t.church.missionBudget} ({t.common.pointsSymbol})</Label>
              <Input type="number" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} className="bg-white border-amber-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{t.church.missionStart}</Label>
                <Input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} className="bg-white border-amber-100" />
              </div>
              <div className="space-y-1">
                <Label>{t.church.missionEnd}</Label>
                <Input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} className="bg-white border-amber-100" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>{t.church.missionInstructions}</Label>
              <Textarea rows={3} value={editForm.instructions} onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })} className="bg-white border-amber-100" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="border-amber-100">{t.common.cancel}</Button>
              <Button onClick={saveEdit} disabled={saving} className="bg-[#F5A623] hover:bg-[#E09000] text-white">{saving ? t.common.loading : t.common.save}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
