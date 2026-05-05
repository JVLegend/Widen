"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VIDEO_PLATFORMS, PLATFORM_LABELS } from "@/lib/constants";
import { Loader2, Search } from "lucide-react";

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

type VideoMetadata = Omit<Partial<VideoFormData>, "tags"> & {
  tags?: string[] | string;
};

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
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");
  const [error, setError] = useState("");
  const lastFetchedUrlRef = useRef("");
  const lastAppliedRef = useRef<Partial<VideoFormData>>({});

  function handleUrlChange(url: string) {
    const detected = detectPlatform(url);
    setMetadataError("");
    setData((d) => ({
      ...d,
      originalUrl: url,
      ...(detected && !d.platform && { platform: detected }),
    }));
  }

  function shouldReplace(current: string, previous?: string) {
    return !current || (!!previous && current === previous);
  }

  function applyMetadata(metadata: VideoMetadata) {
    const nextApplied = {
      title: metadata.title || "",
      description: metadata.description || "",
      thumbnailUrl: metadata.thumbnailUrl || "",
      tags: Array.isArray(metadata.tags) ? metadata.tags.join(", ") : metadata.tags || "",
      platform: metadata.platform || "",
    };

    setData((d) => ({
      ...d,
      title: shouldReplace(d.title, lastAppliedRef.current.title) ? nextApplied.title || d.title : d.title,
      description: shouldReplace(d.description, lastAppliedRef.current.description)
        ? nextApplied.description || d.description
        : d.description,
      thumbnailUrl: shouldReplace(d.thumbnailUrl, lastAppliedRef.current.thumbnailUrl)
        ? nextApplied.thumbnailUrl || d.thumbnailUrl
        : d.thumbnailUrl,
      tags: shouldReplace(d.tags, lastAppliedRef.current.tags) ? nextApplied.tags || d.tags : d.tags,
      platform: nextApplied.platform || d.platform,
    }));
    lastAppliedRef.current = nextApplied;
  }

  async function fetchMetadata(force = false) {
    const url = data.originalUrl.trim();
    if (!url || !/^https?:\/\//i.test(url)) return;
    if (!force && lastFetchedUrlRef.current === url) return;

    setMetadataLoading(true);
    setMetadataError("");
    lastFetchedUrlRef.current = url;

    try {
      const res = await fetch(`/api/videos/metadata?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Não foi possível buscar os dados do vídeo");
      applyMetadata(json.data);
    } catch (err) {
      setMetadataError(err instanceof Error ? err.message : "Não foi possível buscar os dados do vídeo");
    } finally {
      setMetadataLoading(false);
    }
  }

  useEffect(() => {
    const url = data.originalUrl.trim();
    if (!url || !/^https?:\/\//i.test(url)) return;

    const timeout = window.setTimeout(() => {
      fetchMetadata();
    }, 800);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.originalUrl]);

  async function handleSubmit(e: FormEvent) {
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
        <div className="flex gap-2">
          <Input
            id="originalUrl"
            value={data.originalUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={() => fetchMetadata(true)}
            placeholder="https://youtube.com/watch?v=..."
            required
          />
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={() => fetchMetadata(true)}
            disabled={metadataLoading || !data.originalUrl.trim()}
            aria-label="Buscar dados do vídeo"
            title="Buscar dados do vídeo"
          >
            {metadataLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
        </div>
        {metadataLoading && <p className="text-xs text-gray-500">Buscando thumbnail, título e tags...</p>}
        {metadataError && <p className="text-xs text-amber-700">{metadataError}</p>}
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
