"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { locale, t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const session = JSON.parse(localStorage.getItem("widen_session") || "{}");
      router.push(session.role === "influencer" ? `/${locale}/church` : `/${locale}/creator`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-honeycomb px-4 py-10">
      {/* Back to home */}
      <Link
        href={`/${locale}`}
        className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur transition-all hover:border-amber-300 hover:bg-white hover:text-gray-900"
      >
        <span aria-hidden>←</span>
        <span>{locale === "br" ? "Voltar" : "Back to home"}</span>
      </Link>
      {/* Ambient hexagons — decorative parallax */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hex-clip absolute left-[-6%] top-[8%] h-40 w-40 bg-[#F5A623]/10" />
        <div className="hex-clip absolute right-[-4%] top-[18%] h-28 w-28 bg-[#F5A623]/15" />
        <div className="hex-clip absolute left-[12%] bottom-[6%] h-24 w-24 bg-[#F5A623]/10" />
        <div className="hex-clip absolute right-[8%] bottom-[14%] h-32 w-32 bg-[#F5A623]/12" />
      </div>

      <div className="relative grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Editorial left panel */}
        <div className="hidden lg:block rise">
          <span className="eyebrow">Widen · Ministry × Creators</span>
          <h1 className="font-display mt-4 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[0.95] tracking-tight text-gray-900">
            Spread the <em className="text-[#F5A623]">Word</em>
            <br />
            through <em className="italic">viral</em>
            <br />
            short-form content.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-gray-600">
            A sweet marketplace where churches publish sermons and young creators turn
            them into shorts that reach millions.
          </p>

          {/* Mini honeycomb stat row */}
          <div className="mt-10 flex items-center gap-6">
            <div>
              <p className="numeric-display text-3xl text-[#F5A623]">+4M</p>
              <p className="eyebrow mt-1">reach</p>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <p className="numeric-display text-3xl text-gray-900">12</p>
              <p className="eyebrow mt-1">creators</p>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <p className="numeric-display text-3xl text-gray-900">8</p>
              <p className="eyebrow mt-1">churches</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="amber-halo rise rise-2">
          <div className="card-editorial relative p-8 sm:p-10">
            {/* Top accent strip */}
            <div aria-hidden className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent" />

            <div className="flex items-center gap-3">
              <div className="hex-clip bee-pulse flex h-11 w-11 items-center justify-center bg-gradient-to-br from-[#F5A623] to-[#E09000] text-white">
                <span className="text-lg">🐝</span>
              </div>
              <div>
                <span className="eyebrow">Welcome back</span>
                <h2 className="font-display text-2xl font-medium leading-tight text-gray-900">
                  {t.login.title}
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">{t.login.subtitle}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="eyebrow">{t.login.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-amber-200/70 bg-white/70 text-gray-900 placeholder:text-gray-400 focus-visible:border-[#F5A623] focus-visible:ring-2 focus-visible:ring-[#F5A623]/25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="eyebrow">{t.login.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-amber-200/70 bg-white/70 text-gray-900 placeholder:text-gray-400 focus-visible:border-[#F5A623] focus-visible:ring-2 focus-visible:ring-[#F5A623]/25"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50/70 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="group relative h-12 w-full overflow-hidden bg-gradient-to-r from-[#F5A623] to-[#E09000] text-white shadow-[0_8px_24px_-8px_rgba(245,166,35,0.55)] transition-transform hover:translate-y-[-1px]"
              >
                <span className="relative">
                  {loading ? t.common.loading : t.login.submit}
                </span>
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              {t.login.noAccount}{" "}
              <Link href={`/${locale}/signup`} className="font-medium text-[#F5A623] underline-offset-4 hover:underline">
                {t.login.createAccount}
              </Link>
            </div>

            {/* Test accounts, editorial styled */}
            <div className="mt-8 rounded-lg border border-amber-100 bg-[#FFFBF0]/70 p-4">
              <p className="eyebrow text-[#8A5A00]">{t.login.testAccounts}</p>
              <div className="mt-3 grid gap-1.5 text-xs text-gray-600 font-mono">
                <div className="flex justify-between"><span className="text-gray-500">{t.roles.church}</span><span>tela@widen.com · 123456</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t.roles.church}</span><span>contato@redetela.com.br · 123456</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t.roles.creator}</span><span>creator1@widen.com · 123456</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t.roles.creator}</span><span>creator2@widen.com · 123456</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
