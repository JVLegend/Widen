"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, type SignupData } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, TrendingUp } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const { locale, t } = useLocale();

  const preselectedRole = searchParams.get("role") as "influencer" | "clipper" | null;
  const [step, setStep] = useState<"role" | "form">(preselectedRole ? "form" : "role");
  const [role, setRole] = useState<"influencer" | "clipper">(preselectedRole || "influencer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [channelName, setChannelName] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");

  function selectRole(r: "influencer" | "clipper") {
    setRole(r);
    setStep("form");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const socialAccounts: SignupData["socialAccounts"] = [];

      if (youtubeUrl) {
        const handle = channelName || name;
        socialAccounts.push({
          platform: "youtube",
          handle: `@${handle.toLowerCase().replace(/\s/g, "")}`,
          profileUrl: youtubeUrl,
        });
      }
      if (instagramUrl) {
        socialAccounts.push({
          platform: "instagram",
          handle: `@${name.toLowerCase().replace(/\s/g, "")}`,
          profileUrl: instagramUrl,
        });
      }
      if (tiktokUrl) {
        socialAccounts.push({
          platform: "tiktok",
          handle: `@${name.toLowerCase().replace(/\s/g, "")}`,
          profileUrl: tiktokUrl,
        });
      }

      await signup({
        email,
        password,
        name,
        role,
        bio: category ? `Category: ${category}` : undefined,
        socialAccounts,
      });

      router.push(role === "influencer" ? `/${locale}/church` : `/${locale}/creator`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.error);
    } finally {
      setLoading(false);
    }
  }

  if (step === "role") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBF0] px-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-[#F5A623] text-white"
              style={{ clipPath: hexClip }}
            >
              <span className="text-lg">🐝</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t.signup.title}</h1>
            <p className="mt-2 text-gray-600">{t.signup.subtitle}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="cursor-pointer border-amber-100 bg-white transition-all hover:border-[#F5A623] hover:shadow-md"
              onClick={() => selectRole("influencer")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623]/10">
                  <Video className="h-7 w-7 text-[#F5A623]" />
                </div>
                <CardTitle className="mt-2 text-gray-900">{t.signup.roleChurch}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t.signup.roleChurchDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  {t.signup.roleChurchFeatures.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-amber-100 bg-white transition-all hover:border-[#F5A623] hover:shadow-md"
              onClick={() => selectRole("clipper")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623]/10">
                  <TrendingUp className="h-7 w-7 text-[#F5A623]" />
                </div>
                <CardTitle className="mt-2 text-gray-900">{t.signup.roleCreator}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t.signup.roleCreatorDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  {t.signup.roleCreatorFeatures.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-gray-600">
            {t.signup.haveAccount}{" "}
            <Link href={`/${locale}/login`} className="text-[#F5A623] hover:underline">
              {t.signup.signIn}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFBF0] px-4 py-8">
      <Card className="w-full max-w-md border-amber-100 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">
            {role === "influencer" ? t.signup.roleChurch : t.signup.roleCreator}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t.signup.step2Title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900">{t.signup.fullName}</Label>
              <Input
                id="name"
                placeholder={t.signup.fullName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">{t.signup.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900">{t.signup.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {role === "influencer" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="channel" className="text-gray-900">{t.signup.churchName}</Label>
                  <Input
                    id="channel"
                    placeholder="e.g. @yourchurch"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-900">{t.signup.contentCategory}</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {t.categories[cat as keyof typeof t.categories]}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-3 rounded-lg border border-amber-100 p-3">
              <p className="text-sm font-medium text-gray-900">{t.signup.socialMedia} {t.signup.socialOptional}</p>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-xs text-gray-600">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="https://youtube.com/@yourchannel"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-xs text-gray-600">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/yourprofile"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok" className="text-xs text-gray-600">TikTok</Label>
                <Input
                  id="tiktok"
                  placeholder="https://tiktok.com/@yourprofile"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full bg-[#F5A623] text-white hover:bg-[#e09510]" disabled={loading}>
              {loading ? t.signup.creating : t.signup.create}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <button
              onClick={() => setStep("role")}
              className="hover:text-gray-900"
            >
              ← {t.common.back}
            </button>
            <Link href={`/${locale}/login`} className="text-[#F5A623] hover:underline">
              {t.signup.haveAccount}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
