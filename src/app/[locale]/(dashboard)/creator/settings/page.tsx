"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpButton } from "@/components/dashboard/help-button";
import { Save } from "lucide-react";

export default function CreatorSettingsPage() {
  const { user, updateUser } = useAuth();
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/users/${user.userId}`)
      .then((r) => r.json())
      .then((d) => {
        setName(d.data.name);
        setEmail(d.data.email);
        setAvatarUrl(d.data.avatarUrl || "");
      });
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await fetch(`/api/users/${user.userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatarUrl: avatarUrl || null }),
    });
    updateUser({ name, avatarUrl: avatarUrl || undefined });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.creator.settingsTitle}</h1>
          <p className="text-sm text-gray-600">{t.creator.manageProfile}</p>
        </div>
        <HelpButton
          title={{ en: "Creator settings", br: "Configuracoes do creator" }}
          content={{
            en: "Your preferences and creator profile data.",
            br: "Suas preferencias e dados de creator.",
          }}
        />
      </div>

      <Card className="bg-white border border-amber-100 rounded-xl">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">{t.creator.profileSection}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-900">{t.creator.nameLabel}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-amber-100" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-900">{t.creator.emailLabel}</Label>
            <Input value={email} disabled className="bg-gray-50 border-amber-100" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-900">{t.creator.avatarLabel}</Label>
            <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className="bg-white border-amber-100" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
            <Save className="h-4 w-4" />
            {saving ? t.common.loading : saved ? "Saved!" : t.common.save}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
