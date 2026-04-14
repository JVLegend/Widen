"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

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
      const session = JSON.parse(localStorage.getItem("cortesai_session") || "{}");
      router.push(session.role === "influencer" ? `/${locale}/church` : `/${locale}/creator`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFBF0] px-4">
      <Card className="w-full max-w-md border-amber-100 bg-white">
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center bg-[#F5A623] text-white"
            style={{ clipPath: hexClip }}
          >
            <span className="text-lg">🐝</span>
          </div>
          <CardTitle className="text-2xl text-gray-900">{t.login.title}</CardTitle>
          <CardDescription className="text-gray-600">
            {t.login.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">{t.login.email}</Label>
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
              <Label htmlFor="password" className="text-gray-900">{t.login.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="h-12 w-full bg-[#F5A623] text-white hover:bg-[#e09510] text-base sm:h-9 sm:text-sm" disabled={loading}>
              {loading ? t.common.loading : t.login.submit}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            {t.login.noAccount}{" "}
            <Link href={`/${locale}/signup`} className="text-[#F5A623] hover:underline">
              {t.login.createAccount}
            </Link>
          </div>

          <div className="mt-6 rounded-lg border border-amber-100 bg-[#FFFBF0] p-3 text-xs text-gray-600">
            <p className="font-medium mb-1 text-gray-900">{t.login.testAccounts}:</p>
            <p>{t.roles.church}: grace@example.com / 123456</p>
            <p>{t.roles.creator}: sarah.chen@example.com / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
