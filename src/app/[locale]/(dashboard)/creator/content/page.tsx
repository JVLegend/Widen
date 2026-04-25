"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Plus, Eye, Heart, MessageCircle, Share2, BarChart3, ExternalLink, Film, RefreshCw } from "lucide-react";
import { HelpButton } from "@/components/dashboard/help-button";

function isYouTubeUrl(url: string) {
  try {
    const h = new URL(url).hostname;
    return h.endsWith("youtube.com") || h === "youtu.be";
  } catch {
    return false;
  }
}

function ytIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.endsWith("youtube.com")) {
      const m = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
      return u.searchParams.get("v");
    }
  } catch {}
  return null;
}

function thumbFor(clip: { thumbnailUrl: string | null; video: { thumbnailUrl: string | null }; clipUrl: string }): string | null {
  if (clip.thumbnailUrl) return clip.thumbnailUrl;
  if (clip.video.thumbnailUrl) return clip.video.thumbnailUrl;
  const id = ytIdFromUrl(clip.clipUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

type ClipWithDetails = {
  id: string;
  clipUrl: string;
  platform: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  earnings: number;
  publishedAt: string | null;
  createdAt: string;
  campaign: { id: string; name: string; paymentModel: string; cpvRate: number | null; fixedRate: number | null };
  thumbnailUrl: string | null;
  video: { id: string; title: string; platform: string; thumbnailUrl: string | null };
  socialAccount: { id: string; platform: string; handle: string };
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  pending: "outline",
  active: "default",
  metrics_collected: "secondary",
  paid: "default",
  rejected: "outline",
};

export default function CreatorContentPage() {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const [clips, setClips] = useState<ClipWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{ id: string; ok: boolean; msg: string } | null>(null);

  // Manual metrics fallback dialog
  const [metricsClip, setMetricsClip] = useState<ClipWithDetails | null>(null);

  // Metrics form
  const [views, setViews] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");

  const fetchClips = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`/api/clips?clipperId=${user.userId}`, { cache: "no-store" });
    const data = await res.json();
    setClips(data.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    fetch(`/api/clips?clipperId=${user.userId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setClips(data.data || []); setLoading(false); } });
    return () => { cancelled = true; };
  }, [user]);

  async function syncMetrics(clip: ClipWithDetails) {
    setSyncingId(clip.id);
    setSyncResult(null);
    try {
      const res = await fetch(`/api/clips/${clip.id}/sync`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setSyncResult({ id: clip.id, ok: true, msg: `Synced: ${json.data?.synced?.views?.toLocaleString() ?? 0} views` });
        await fetchClips();
      } else {
        setSyncResult({ id: clip.id, ok: false, msg: json.error || "Sync error" });
      }
    } catch {
      setSyncResult({ id: clip.id, ok: false, msg: "Connection error" });
    } finally {
      setSyncingId(null);
    }
  }

  function openMetrics(clip: ClipWithDetails) {
    setMetricsClip(clip);
    setViews(clip.views.toString());
    setLikes(clip.likes.toString());
    setComments(clip.comments.toString());
    setShares(clip.shares.toString());
  }

  async function saveMetrics() {
    if (!metricsClip) return;
    await fetch(`/api/clips/${metricsClip.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        views: parseInt(views) || 0,
        likes: parseInt(likes) || 0,
        comments: parseInt(comments) || 0,
        shares: parseInt(shares) || 0,
        status: "metrics_collected",
      }),
    });
    setMetricsClip(null);
    fetchClips();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.creator.contentTitle}</h1>
          <p className="text-sm text-gray-600">{t.creator.contentSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <HelpButton
            title={{ en: "How to use — My Content", br: "Como usar — Meus Cortes" }}
            content={{
              en: [
                "This list shows every clip you submitted. Tap 'Submit' to add a new clip URL.",
                "If the clip is on YouTube, use 'Sync from YouTube' to pull views/likes/comments automatically.",
                "For other platforms, tap 'Update metrics' to enter numbers manually.",
              ],
              br: [
                "Esta lista mostra cada corte enviado. Toque em 'Enviar' para adicionar uma nova URL.",
                "Se o corte e do YouTube, use 'Sync from YouTube' para puxar views/likes/comments automaticamente.",
                "Para outras plataformas, toque em 'Atualizar metricas' e insira os numeros manualmente.",
              ],
            }}
          />
          <Button render={<Link href={`/${locale}/creator/content/new`} />} className="gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
            <Plus className="h-4 w-4" />
            {t.creator.quickSubmitContent}
          </Button>
        </div>
      </div>

      {clips.length === 0 ? (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="py-16 text-center">
            <Film className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-600">{t.creator.noContent}</p>
            <p className="text-sm text-gray-600">{t.creator.missionsSubtitle}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clips.map((clip) => (
            <Card key={clip.id} className="bg-white border border-amber-100 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {thumbFor(clip) && (
                    <img src={thumbFor(clip)!} alt="" className="h-16 w-28 shrink-0 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{clip.campaign.name}</p>
                        <p className="text-xs text-gray-600 truncate">{clip.video.title}</p>
                      </div>
                      <Badge variant={statusVariant[clip.status] || "outline"} className="shrink-0">
                        {t.creator.contentStatus[clip.status as keyof typeof t.creator.contentStatus] || clip.status}
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {clip.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {clip.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {clip.comments.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" /> {clip.shares.toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {PLATFORM_LABELS[clip.platform]} • @{clip.socialAccount.handle}
                      </Badge>
                    </div>

                    {clip.earnings > 0 && (
                      <p className="mt-1 text-sm font-medium text-[#F5A623]">
                        {t.common.pointsSymbol} {Math.round(clip.earnings).toLocaleString()} {t.common.points}
                      </p>
                    )}

                    {syncResult?.id === clip.id && (
                      <p className={`mt-1 text-xs ${syncResult.ok ? "text-green-600" : "text-red-500"}`}>
                        {syncResult.msg}
                      </p>
                    )}

                    <div className="mt-2 flex gap-2">
                      {isYouTubeUrl(clip.clipUrl) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncMetrics(clip)}
                          disabled={syncingId === clip.id}
                          className="gap-1 text-xs border-amber-100"
                        >
                          <RefreshCw className={`h-3 w-3 ${syncingId === clip.id ? "animate-spin" : ""}`} />
                          {syncingId === clip.id ? "Syncing…" : "Sync from YouTube"}
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => openMetrics(clip)} className="gap-1 text-xs border-amber-100">
                          <BarChart3 className="h-3 w-3" />
                          {t.creator.updateMetrics}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => window.open(clip.clipUrl, "_blank")} className="gap-1 text-xs">
                        <ExternalLink className="h-3 w-3" />
                        {t.creator.viewContent}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!metricsClip} onOpenChange={(open) => !open && setMetricsClip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.creator.updateMetrics}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">{t.creator.views}</Label>
                <Input type="number" value={views} onChange={(e) => setViews(e.target.value)} className="bg-white border-amber-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">{t.creator.likes}</Label>
                <Input type="number" value={likes} onChange={(e) => setLikes(e.target.value)} className="bg-white border-amber-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">{t.creator.comments}</Label>
                <Input type="number" value={comments} onChange={(e) => setComments(e.target.value)} className="bg-white border-amber-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">{t.creator.shares}</Label>
                <Input type="number" value={shares} onChange={(e) => setShares(e.target.value)} className="bg-white border-amber-100" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMetricsClip(null)} className="border-amber-100">{t.common.cancel}</Button>
              <Button onClick={saveMetrics} className="bg-[#F5A623] hover:bg-[#E09000] text-white">{t.common.save}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
