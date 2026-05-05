"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORMS, PLATFORM_LABELS } from "@/lib/constants";
import { HelpButton } from "@/components/dashboard/help-button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { Video } from "@prisma/client";

export default function NewMissionPage() {
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [paymentModel, setPaymentModel] = useState("cpv");
  const [cpvRate, setCpvRate] = useState("");
  const [fixedRate, setFixedRate] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`/api/videos?influencerId=${user.userId}`)
      .then((r) => r.json())
      .then((d) => setVideos(d.data || []));
  }, [user]);

  function toggleVideo(id: string) {
    setSelectedVideoIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  function togglePlatform(p: string) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((v) => v !== p) : [...prev, p]
    );
  }

  async function handleSubmit(statusOverride: "active" | "draft" = "active") {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencerId: user!.userId,
          name,
          budget: parseFloat(budget || "0"),
          paymentModel,
          cpvRate: cpvRate ? parseFloat(cpvRate) : null,
          fixedRate: fixedRate ? parseFloat(fixedRate) : null,
          platforms,
          instructions,
          startDate: startDate || new Date().toISOString().slice(0, 10),
          endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          status: statusOverride,
          videoIds: selectedVideoIds,
        }),
      });
      if (!res.ok) throw new Error("Error creating mission");
      router.push(`/${locale}/church/missions`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.church.newMission}</h1>
          <p className="text-sm text-gray-600">
            {locale === "br" ? `Passo ${step} de 3` : `Step ${step} of 3`}
          </p>
        </div>
        <HelpButton
          title={{ en: "Create new mission", br: "Criar nova missao" }}
          content={{
            en: "Create a new mission in 3 steps: pick the sermons, set budget and rules, then review and publish.",
            br: "Crie uma nova missao em 3 passos: selecione os sermoes, defina orcamento e regras, depois revise e publique.",
          }}
        />
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-[#F5A623]" : "bg-gray-200"}`}
          />
        ))}
      </div>

      {/* Step 1: Select Sermons */}
      {step === 1 && (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-900">{t.church.selectSermons}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {videos.length === 0 ? (
              <p className="text-sm text-gray-600">
                {t.common.noResults}
              </p>
            ) : (
              videos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => toggleVideo(v.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedVideoIds.includes(v.id)
                      ? "border-[#F5A623] bg-amber-50"
                      : "border-amber-100 hover:bg-gray-50"
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded border ${
                    selectedVideoIds.includes(v.id)
                      ? "border-[#F5A623] bg-[#F5A623] text-white"
                      : "border-gray-300"
                  }`}>
                    {selectedVideoIds.includes(v.id) && <Check className="h-3 w-3" />}
                  </div>
                  {v.thumbnailUrl && (
                    <img src={v.thumbnailUrl} alt="" className="h-12 w-20 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{v.title}</p>
                    <p className="text-xs text-gray-600">
                      {PLATFORM_LABELS[v.platform] || v.platform}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-900">{t.church.missionName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-900">{t.church.missionName} *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Easter Outreach" required className="bg-white border-amber-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-900">{t.church.missionBudget} ({t.common.pointsSymbol}) *</Label>
                <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="5000" required className="bg-white border-amber-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">{t.church.missionPayment} *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-amber-100 bg-white px-3 py-2 text-sm text-gray-900"
                  value={paymentModel}
                  onChange={(e) => setPaymentModel(e.target.value)}
                >
                  <option value="cpv">{t.church.pointsPerReach}</option>
                  <option value="fixed_per_clip">{t.church.fixedPerContent}</option>
                </select>
              </div>
            </div>
            {paymentModel === "cpv" ? (
              <div className="space-y-2">
                <Label className="text-gray-900">{t.church.pprRate} ({t.common.pointsSymbol})</Label>
                <Input type="number" step="0.001" value={cpvRate} onChange={(e) => setCpvRate(e.target.value)} placeholder="0.02" className="bg-white border-amber-100" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-gray-900">{t.church.fixedRate} ({t.common.pointsSymbol})</Label>
                <Input type="number" value={fixedRate} onChange={(e) => setFixedRate(e.target.value)} placeholder="50" className="bg-white border-amber-100" />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-gray-900">{t.church.missionPlatforms}</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Badge
                    key={p}
                    variant={platforms.includes(p) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePlatform(p)}
                  >
                    {PLATFORM_LABELS[p]}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-900">{t.church.missionStart} *</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="bg-white border-amber-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">{t.church.missionEnd} *</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="bg-white border-amber-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">{t.church.missionInstructions}</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={locale === "br" ? "Tom, estilo, o que evitar..." : "Tone, style, what to avoid..."}
                rows={4}
                className="bg-white border-amber-100"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-900">
              {locale === "br" ? "Revisar e Publicar" : "Review & Publish"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.church.missionName}</span>
                <span className="font-medium text-gray-900">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.church.missionBudget}</span>
                <span className="font-medium text-gray-900">{t.common.pointsSymbol} {Math.round(parseFloat(budget || "0")).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.church.missionPayment}</span>
                <span className="font-medium text-gray-900">{paymentModel === "cpv" ? t.church.pointsPerReach : t.church.fixedPerContent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.church.missionDates}</span>
                <span className="font-medium text-gray-900">{startDate} — {endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.church.selectSermons}</span>
                <span className="font-medium text-gray-900">{selectedVideoIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.church.missionPlatforms}</span>
                <span className="font-medium text-gray-900">{platforms.map((p) => PLATFORM_LABELS[p]).join(", ") || (locale === "br" ? "Todas" : "All")}</span>
              </div>
              {instructions && (
                <div>
                  <span className="text-gray-600">{t.church.missionInstructions}:</span>
                  <p className="mt-1 rounded bg-gray-50 p-2 text-xs text-gray-900">{instructions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="gap-2 border-amber-100 text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 1 ? t.common.back : (locale === "br" ? "Anterior" : "Previous")}
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading || !name} className="border-amber-100 text-gray-900">
            {locale === "br" ? "Salvar rascunho" : "Save draft"}
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
              {locale === "br" ? "Proximo" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => handleSubmit("active")} disabled={loading} className="bg-[#F5A623] hover:bg-[#E09000] text-white">
              {loading ? t.common.loading : (locale === "br" ? "Publicar Missao" : "Publish Mission")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
