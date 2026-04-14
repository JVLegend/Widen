"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Trophy } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString("en-US")}</span>;
}

const rankingData = [
  { name: "@sarah.chen", views: "4M", prize: "85,225 ✦ pts" },
  { name: "@daniel.t", views: "2M", prize: "47,390 ✦ pts" },
  { name: "@emily.worship", views: "1.6M", prize: "25,120 ✦ pts" },
];

/* Inline SVG for honeycomb background pattern */
const honeycombBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66ZM28 100L0 84L0 50L28 34L56 50L56 84L28 100Z' fill='none' stroke='%23F5A623' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E")`;

export function Hero() {
  const { locale, t } = useLocale();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FFFBF0]">
      {/* Animated background */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5A623]/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#F5A623]/3 blur-[100px]" />
        {/* Honeycomb pattern */}
        <div
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: honeycombBg }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:flex lg:items-center lg:gap-16 lg:px-8 lg:pt-40 lg:pb-32">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm text-gray-600">
              {t.hero.badge}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            {t.hero.title}{" "}
            <span className="text-[#F5A623]">{t.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 lg:text-xl"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <Link
              href={`/${locale}/signup`}
              className="w-full rounded-lg bg-[#F5A623] px-8 py-4 text-center text-base font-semibold text-black transition-all hover:bg-[#FFB830] hover:shadow-[0_0_30px_rgba(245,166,35,0.3)] sm:w-auto"
            >
              {t.hero.cta1}
            </Link>
            <a
              href="#como-funciona"
              className="w-full rounded-lg border border-amber-200 bg-white px-8 py-4 text-center text-base font-medium text-gray-600 transition-all hover:border-[#F5A623]/50 hover:text-gray-900 sm:w-auto"
            >
              {t.hero.cta2}
            </a>
          </motion.div>

          {/* Live counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 lg:justify-start"
          >
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter target={4018} />+
              </div>
              <p className="text-xs text-gray-500">{t.hero.statsClips}</p>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter target={12} />M+
              </div>
              <p className="text-xs text-gray-500">{t.hero.statsReach}</p>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter target={47} />
              </div>
              <p className="text-xs text-gray-500">{t.hero.statsMissions}</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Live Ranking Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-0 lg:w-[420px]"
        >
          <div className="rounded-2xl border border-amber-200 bg-white/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#F5A623]" />
              <h3 className="text-sm font-semibold text-gray-900">{t.hero.liveRanking}</h3>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#F5A623]" />
                Live
              </span>
            </div>

            <div className="space-y-3">
              {rankingData.map((clipper, i) => (
                <div
                  key={clipper.name}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                    i === 0
                      ? "bg-[#F5A623]/10 border border-[#F5A623]/20"
                      : "bg-[#FFFBF0]"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center text-sm font-bold"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: i === 0 ? "#F5A623" : i === 1 ? "#9ca3af" : "#d1d5db",
                      color: i === 0 ? "black" : "#374151",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        i === 0 ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {clipper.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      {clipper.views} {t.rankingPreview.reach}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      i === 0 ? "text-[#F5A623]" : "text-gray-600"
                    }`}
                  >
                    {clipper.prize}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-amber-200 pt-4 text-center">
              <Link
                href={`/${locale}/ranking`}
                className="text-sm font-medium text-[#F5A623] transition-colors hover:text-[#FFB830]"
              >
                {t.rankingPreview.viewFullRanking} →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
