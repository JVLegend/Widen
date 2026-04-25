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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-honeycomb px-4 py-10">
        <Link
          href={`/${locale}`}
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur transition-all hover:border-amber-300 hover:bg-white hover:text-gray-900"
        >
          <span aria-hidden>←</span>
          <span>{locale === "br" ? "Voltar" : "Back to home"}</span>
        </Link>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hex-clip absolute left-[-4%] top-[12%] h-32 w-32 bg-[#F5A623]/12" />
          <div className="hex-clip absolute right-[-3%] bottom-[10%] h-40 w-40 bg-[#F5A623]/10" />
        </div>

        <div className="relative w-full max-w-3xl space-y-10">
          <div className="text-center rise">
            <div
              className="hex-clip bee-pulse mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-gradient-to-br from-[#F5A623] to-[#E09000] text-white"
            >
              <span className="text-xl">🐝</span>
            </div>
            <span className="eyebrow">Step 1 of 2 · Choose your path</span>
            <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-tight text-gray-900">
              {t.signup.title}
            </h1>
            <p className="mt-3 text-gray-600 max-w-md mx-auto">{t.signup.subtitle}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <button
              onClick={() => selectRole("influencer")}
              className="card-editorial rise rise-1 group relative overflow-hidden p-7 text-left"
            >
              <div aria-hidden className="hex-clip absolute -right-6 -top-6 h-24 w-24 bg-gradient-to-br from-[#FFF1CF] to-[#FFE3A0] opacity-60 transition-transform duration-500 group-hover:scale-110" />
              <div className="relative">
                <div className="hex-clip flex h-12 w-12 items-center justify-center bg-[#F5A623] text-white shadow-[0_6px_18px_-4px_rgba(245,166,35,0.5)]">
                  <Video className="h-5 w-5" />
                </div>
                <span className="eyebrow mt-5 block">Role · Publisher</span>
                <h3 className="font-display mt-1 text-2xl font-medium text-gray-900">
                  {t.signup.roleChurch}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{t.signup.roleChurchDesc}</p>
                <ul className="mt-5 space-y-1.5 text-sm text-gray-700">
                  {t.signup.roleChurchFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#F5A623]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 h-px origin-left scale-x-0 bg-gradient-to-r from-[#F5A623] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </button>

            <button
              onClick={() => selectRole("clipper")}
              className="card-editorial rise rise-2 group relative overflow-hidden p-7 text-left"
            >
              <div aria-hidden className="hex-clip absolute -right-6 -top-6 h-24 w-24 bg-gradient-to-br from-[#FFF1CF] to-[#FFE3A0] opacity-60 transition-transform duration-500 group-hover:scale-110" />
              <div className="relative">
                <div className="hex-clip flex h-12 w-12 items-center justify-center bg-[#F5A623] text-white shadow-[0_6px_18px_-4px_rgba(245,166,35,0.5)]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="eyebrow mt-5 block">Role · Creator</span>
                <h3 className="font-display mt-1 text-2xl font-medium text-gray-900">
                  {t.signup.roleCreator}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{t.signup.roleCreatorDesc}</p>
                <ul className="mt-5 space-y-1.5 text-sm text-gray-700">
                  {t.signup.roleCreatorFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#F5A623]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 h-px origin-left scale-x-0 bg-gradient-to-r from-[#F5A623] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            {t.signup.haveAccount}{" "}
            <Link href={`/${locale}/login`} className="font-medium text-[#F5A623] underline-offset-4 hover:underline">
              {t.signup.signIn}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FFFBF0] px-4 py-8">
      <Link
        href={`/${locale}`}
        className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur transition-all hover:border-amber-300 hover:bg-white hover:text-gray-900"
      >
        <span aria-hidden>←</span>
        <span>{locale === "br" ? "Voltar" : "Back to home"}</span>
      </Link>
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
