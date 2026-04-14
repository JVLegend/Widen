"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function Footer() {
  const { locale, t } = useLocale();

  return (
    <footer className="border-t border-amber-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center bg-[#F5A623]"
                style={{ clipPath: hexClip }}
              >
                <span className="text-sm">🐝</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{t.brand}</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.footer.platform}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><a href="#o-que-fazemos" className="transition-colors hover:text-gray-900">{t.nav.whatWeDo}</a></li>
              <li><a href="#como-funciona" className="transition-colors hover:text-gray-900">{t.nav.howItWorks}</a></li>
              <li><Link href={`/${locale}/ranking`} className="transition-colors hover:text-gray-900">{t.nav.ranking}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.footer.account}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href={`/${locale}/signup?role=church`} className="transition-colors hover:text-gray-900">{t.footer.imChurch}</Link></li>
              <li><Link href={`/${locale}/signup?role=creator`} className="transition-colors hover:text-gray-900">{t.footer.imCreator}</Link></li>
              <li><Link href={`/${locale}/login`} className="transition-colors hover:text-gray-900">{t.common.login}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.footer.legal}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><span className="cursor-default">{t.footer.terms}</span></li>
              <li><span className="cursor-default">{t.footer.privacy}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-amber-200 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
