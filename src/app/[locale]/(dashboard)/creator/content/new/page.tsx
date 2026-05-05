"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_LABELS } from "@/lib/constants";
import { HelpButton } from "@/components/dashboard/help-button";
import { ArrowLeft, Send } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  paymentModel: string;
  cpvRate: number | null;
  fixedRate: number | null;
  campaignVideos: { video: { id: string; title: string; platform: string; thumbnailUrl: string | null } }[];
};

type SocialAccount = {
  id: string;
  platform: string;
  handle: string;
};

function NewContentForm() {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCampaignId = searchParams.get("missionId") || searchParams.get("campaignId") || "";

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form
  const [campaignId, setCampaignId] = useState(preselectedCampaignId);
  const [videoId, setVideoId] = useState("");
  const [socialAccountId, setSocialAccountId] = useState("");
  const [clipUrl, setClipUrl] = useState("");
  const [platform, setPlatform] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/campaigns?active=true").then((r) => r.json()),
      fetch(`/api/social-accounts?userId=${user.userId}`).then((r) => r.json()),
    ]).then(([campData, accData]) => {
      setCampaigns(campData.data || []);
      setAccounts(accData.data || []);
    });
  }, [user]);

  const selectedCampaign = campaigns.find((c) => c.id === campaignId);
  const videos = selectedCampaign?.campaignVideos?.map((cv) => cv.video) || [];

  // Auto-set platform from social account
  useEffect(() => {
    const acc = accounts.find((a) => a.id === socialAccountId);
    if (acc) setPlatform(acc.platform);
  }, [socialAccountId, accounts]);

  async function handleSubmit() {
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clipperId: user.userId,
          campaignId,
          videoId,
          socialAccountId,
          clipUrl,
          platform,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error submitting content");
      }
      router.push(`/${locale}/creator/content`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = campaignId && videoId && socialAccountId && clipUrl && platform;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="flex-1 text-2xl font-bold text-gray-900">{t.creator.newContentTitle}</h1>
        <HelpButton
          title={{ en: "Submit new clip", br: "Submeter novo corte" }}
          content={{
            en: "Submit a new clip you published. Paste the public URL of your post so it can be tracked.",
            br: "Submeta um novo corte. Cole a URL publica da publicacao para que possa ser rastreada.",
          }}
        />
      </div>

      <Card className="bg-white border border-amber-100 rounded-xl">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">{t.creator.selectMission}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-900">{t.creator.selectMission} *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-amber-100 bg-white px-3 py-2 text-sm text-gray-900"
              value={campaignId}
              onChange={(e) => { setCampaignId(e.target.value); setVideoId(""); }}
            >
              <option value="">{t.creator.selectMission}...</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {campaignId && videos.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-900">{t.creator.selectSermon} *</Label>
              <div className="space-y-2">
                {videos.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setVideoId(v.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      videoId === v.id ? "border-[#F5A623] bg-amber-50" : "border-amber-100 hover:bg-gray-50"
                    }`}
                  >
                    {v.thumbnailUrl && (
                      <img src={v.thumbnailUrl} alt="" className="h-12 w-20 rounded object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{v.title}</p>
                      <Badge variant="outline" className="text-xs">{PLATFORM_LABELS[v.platform]}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border border-amber-100 rounded-xl">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">{t.creator.contentUrl}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-900">{t.creator.selectAccount} *</Label>
            {accounts.length === 0 ? (
              <p className="text-sm text-gray-600">
                {t.creator.noAccounts}{" "}
                <Button variant="link" className="h-auto p-0 text-[#F5A623]" onClick={() => router.push(`/${locale}/creator/social-accounts`)}>
                  {t.creator.addAccount}
                </Button>
              </p>
            ) : (
              <select
                className="flex h-10 w-full rounded-md border border-amber-100 bg-white px-3 py-2 text-sm text-gray-900"
                value={socialAccountId}
                onChange={(e) => setSocialAccountId(e.target.value)}
              >
                <option value="">{t.creator.selectAccount}...</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {PLATFORM_LABELS[a.platform]} — @{a.handle}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900">{t.creator.contentUrl} *</Label>
            <Input
              value={clipUrl}
              onChange={(e) => setClipUrl(e.target.value)}
              placeholder="https://tiktok.com/@user/video/123"
              className="bg-white border-amber-100"
            />
          </div>

          <p className="text-xs text-gray-500">
            {locale === "br"
              ? "A data de publicacao e detectada automaticamente para URLs do YouTube."
              : "Publish date is detected automatically for YouTube URLs."}
          </p>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || !canSubmit} className="gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
          <Send className="h-4 w-4" />
          {loading ? t.common.loading : t.creator.submit}
        </Button>
      </div>
    </div>
  );
}

export default function NewContentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
      </div>
    }>
      <NewContentForm />
    </Suspense>
  );
}
