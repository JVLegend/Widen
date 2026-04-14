import { AuthProvider } from "@/hooks/use-auth";
import { LocaleProvider } from "@/hooks/use-locale";
import type { Locale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === "br" ? "br" : "en") as Locale;

  return (
    <LocaleProvider locale={safeLocale}>
      <AuthProvider>{children}</AuthProvider>
    </LocaleProvider>
  );
}
