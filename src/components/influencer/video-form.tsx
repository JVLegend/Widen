"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VIDEO_PLATFORMS, PLATFORM_LABELS } from "@/lib/constants";

interface VideoFormData {
  title: string;
  description: string;
  originalUrl: string;
  platform: string;
  thumbnailUrl: string;
  tags: string;
}

interface VideoFormProps {
  initialData?: Partial<VideoFormData>;
  onSubmit: (data: VideoFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  return "";
}

export function VideoForm({ initialData, onSubmit, onCancel, submitLabel = "Salvar" }: VideoFormProps) {
  const [data, setData] = useState<VideoFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    originalUrl: initialData?.originalUrl || "",
    platform: initialData?.platform || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    tags: initialData?.tags || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleUrlChange(url: string) {
    const detected = detectPlatform(url);
    setData((d) => ({
      ...d,
      originalUrl: url,
      ...(detected && !d.platform && { platform: detected }),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
          placeholder="Ex: 10 Ferramentas de IA para 2026"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="originalUrl">URL do vídeo original *</Label>
        <Input
          id="originalUrl"
          value={data.originalUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Plataforma *</Label>
        <select
          id="platform"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data.platform}
          onChange={(e) => setData((d) => ({ ...d, platform: e.target.value }))}
          required
        >
          <option value="">Selecione...</option>
          {VIDEO_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
          placeholder="Descrição do vídeo..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnailUrl">URL da thumbnail</Label>
        <Input
          id="thumbnailUrl"
          value={data.thumbnailUrl}
          onChange={(e) => setData((d) => ({ ...d, thumbnailUrl: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={data.tags}
          onChange={(e) => setData((d) => ({ ...d, tags: e.target.value }))}
          placeholder="ia, produtividade, tecnologia"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
