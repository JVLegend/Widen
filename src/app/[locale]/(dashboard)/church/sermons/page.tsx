"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoForm } from "@/components/influencer/video-form";
import { HelpButton } from "@/components/dashboard/help-button";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Plus, Pencil, Trash2, ExternalLink, Film } from "lucide-react";
import type { Video } from "@prisma/client";

type VideoWithCounts = Video & { _count: { clips: number; campaignVideos: number } };

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  available: "default",
  in_campaign: "secondary",
  archived: "outline",
};

export default function ChurchSermonsPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [videos, setVideos] = useState<VideoWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`/api/videos?influencerId=${user.userId}`);
    const data = await res.json();
    setVideos(data.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    fetch(`/api/videos?influencerId=${user.userId}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setVideos(data.data || []); setLoading(false); } });
    return () => { cancelled = true; };
  }, [user]);

  async function handleCreate(formData: { title: string; description: string; originalUrl: string; platform: string; thumbnailUrl: string; tags: string }) {
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        influencerId: user!.userId,
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (!res.ok) throw new Error("Error creating sermon");
    setDialogOpen(false);
    fetchVideos();
  }

  async function handleEdit(formData: { title: string; description: string; originalUrl: string; platform: string; thumbnailUrl: string; tags: string }) {
    if (!editingVideo) return;
    const res = await fetch(`/api/videos/${editingVideo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (!res.ok) throw new Error("Error editing sermon");
    setEditingVideo(null);
    fetchVideos();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this sermon?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    fetchVideos();
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
          <h1 className="text-2xl font-bold text-gray-900">{t.church.sermonsTitle}</h1>
          <p className="text-sm text-gray-600">{t.church.sermonsSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <HelpButton
            title={{ en: "Sermons", br: "Sermoes" }}
            content={{
              en: "Your sermons available for creators to turn into short-form content. Add sermon URLs from YouTube or other platforms.",
              br: "Suas pregacoes disponiveis para os creators transformarem em conteudo curto. Adicione URLs de sermoes do YouTube ou outras plataformas.",
            }}
          />
          <Button onClick={() => setDialogOpen(true)} className="h-12 w-full gap-2 text-base bg-[#F5A623] hover:bg-[#E09000] text-white sm:h-9 sm:w-auto sm:text-sm">
            <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            {t.church.addSermon}
          </Button>
        </div>
      </div>

      {videos.length === 0 ? (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Film className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t.common.noResults}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {t.church.sermonsSubtitle}
            </p>
            <Button onClick={() => setDialogOpen(true)} className="mt-4 gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
              <Plus className="h-4 w-4" />
              {t.church.addSermon}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden bg-white border border-amber-100 rounded-xl">
              {video.thumbnailUrl && (
                <div className="aspect-video bg-gray-50">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium leading-tight line-clamp-2 text-gray-900">{video.title}</h3>
                  <Badge variant={statusVariant[video.status] || "default"}>
                    {t.church.sermonStatus[video.status as keyof typeof t.church.sermonStatus] || video.status}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <span>{PLATFORM_LABELS[video.platform] || video.platform}</span>
                  <span>•</span>
                  <span>{video._count.clips} {t.creator.statsContent.toLowerCase()}</span>
                  <span>•</span>
                  <span>{video._count.campaignVideos} {t.church.statsMissions.toLowerCase()}</span>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => window.open(video.originalUrl, "_blank")}
                    className="h-10 w-10 sm:h-9 sm:w-9"
                  >
                    <ExternalLink className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => setEditingVideo(video)}
                    className="h-10 w-10 sm:h-9 sm:w-9"
                  >
                    <Pencil className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => handleDelete(video.id)}
                    className="h-10 w-10 text-destructive hover:text-destructive sm:h-9 sm:w-9"
                  >
                    <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.church.addSermon}</DialogTitle>
          </DialogHeader>
          <VideoForm
            onSubmit={handleCreate}
            onCancel={() => setDialogOpen(false)}
            submitLabel={t.common.create}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.church.editSermon}</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <VideoForm
              initialData={{
                title: editingVideo.title,
                description: editingVideo.description || "",
                originalUrl: editingVideo.originalUrl,
                platform: editingVideo.platform,
                thumbnailUrl: editingVideo.thumbnailUrl || "",
                tags: (() => {
                  try { return JSON.parse(editingVideo.tags).join(", "); } catch { return ""; }
                })(),
              }}
              onSubmit={handleEdit}
              onCancel={() => setEditingVideo(null)}
              submitLabel={t.common.save}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
