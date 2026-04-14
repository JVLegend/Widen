"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function Navbar() {
  const { locale, t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: "#o-que-fazemos", label: t.nav.whatWeDo },
    { href: "#como-funciona", label: t.nav.howItWorks },
    { href: "#ranking", label: t.nav.ranking },
    { href: "#faq", label: t.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-amber-200"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-[#F5A623]" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <span className="text-sm">🐝</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{t.brand}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#F5A623] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={t.nav.switchLangPath}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <Globe className="h-4 w-4" />
            {t.nav.switchLang}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            {t.common.login}
          </Link>
          <Link
            href={`/${locale}/signup`}
            className="rounded-lg bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#FFB830] hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]"
          >
            {t.nav.wantToJoin}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-900 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-amber-200 bg-white/95 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={t.nav.switchLangPath}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-gray-900"
            >
              <Globe className="h-4 w-4" />
              {t.nav.switchLang}
            </Link>
            <div className="mt-3 flex flex-col gap-2 border-t border-amber-200 pt-3">
              <Link
                href={`/${locale}/login`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-amber-200 px-3 py-3 text-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {t.common.login}
              </Link>
              <Link
                href={`/${locale}/signup`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-[#F5A623] px-3 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-[#FFB830]"
              >
                {t.nav.wantToJoin}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
