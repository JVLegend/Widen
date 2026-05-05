"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLATFORMS, PLATFORM_LABELS } from "@/lib/constants";
import { HelpButton } from "@/components/dashboard/help-button";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

type SocialAccount = {
  id: string;
  platform: string;
  handle: string;
  profileUrl: string;
  followers: number | null;
};

export default function SocialAccountsPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialAccount | null>(null);

  // Form
  const [platform, setPlatform] = useState("tiktok");
  const [handle, setHandle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [followers, setFollowers] = useState("");

  const fetchAccounts = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`/api/social-accounts?userId=${user.userId}`);
    const data = await res.json();
    setAccounts(data.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    fetch(`/api/social-accounts?userId=${user.userId}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setAccounts(data.data || []); setLoading(false); } });
    return () => { cancelled = true; };
  }, [user]);

  function openNew() {
    setEditing(null);
    setPlatform("tiktok");
    setHandle("");
    setProfileUrl("");
    setFollowers("");
    setDialogOpen(true);
  }

  function openEdit(acc: SocialAccount) {
    setEditing(acc);
    setPlatform(acc.platform);
    setHandle(acc.handle);
    setProfileUrl(acc.profileUrl);
    setFollowers(acc.followers?.toString() || "");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!user) return;
    const payload = {
      userId: user.userId,
      platform,
      handle,
      profileUrl,
      followers: followers ? parseInt(followers) : null,
    };

    if (editing) {
      await fetch(`/api/social-accounts/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setDialogOpen(false);
    fetchAccounts();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/social-accounts/${id}`, { method: "DELETE" });
    fetchAccounts();
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
          <h1 className="text-2xl font-bold text-gray-900">{t.creator.socialTitle}</h1>
          <p className="text-sm text-gray-600">{t.creator.socialSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <HelpButton
            title={{ en: "Social accounts", br: "Redes sociais" }}
            content={{
              en: "Connect your social media accounts so you can be credited for the clips you publish.",
              br: "Conecte suas redes sociais para receber credito pelos cortes publicados.",
            }}
          />
          <Button onClick={openNew} className="gap-2 bg-[#F5A623] hover:bg-[#E09000] text-white">
            <Plus className="h-4 w-4" />
            {t.creator.addAccount}
          </Button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <Card className="bg-white border border-amber-100 rounded-xl">
          <CardContent className="py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-600">{t.creator.noAccounts}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {accounts.map((acc) => (
            <Card key={acc.id} className="bg-white border border-amber-100 rounded-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{PLATFORM_LABELS[acc.platform]}</Badge>
                    <span className="font-medium text-gray-900">@{acc.handle}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 truncate">{acc.profileUrl}</p>
                  {acc.followers && (
                    <p className="text-xs text-gray-600">{acc.followers.toLocaleString()} {t.creator.followers}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(acc)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(acc.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t.creator.editAccount : t.creator.addAccount}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-gray-900">{t.creator.platform}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-amber-100 bg-white px-3 py-2 text-sm text-gray-900"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">{t.creator.handle}</Label>
              <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="myprofile" className="bg-white border-amber-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">{t.creator.profileUrl}</Label>
              <Input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} placeholder="https://tiktok.com/@myprofile" className="bg-white border-amber-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-900">{t.creator.followers}</Label>
              <Input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} placeholder="10000" className="bg-white border-amber-100" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-amber-100">{t.common.cancel}</Button>
              <Button onClick={handleSave} disabled={!handle || !profileUrl} className="bg-[#F5A623] hover:bg-[#E09000] text-white">
                {editing ? t.common.save : t.creator.addAccount}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
