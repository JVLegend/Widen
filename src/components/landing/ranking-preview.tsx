"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Eye } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const topCreators = [
  { name: "Sarah Chen", handle: "@sarah.chen", views: "4M", clips: 12, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarahchen", rank: 1 },
  { name: "Daniel Torres", handle: "@daniel.t", views: "2M", clips: 4, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=danielt", rank: 2 },
  { name: "Emily Worship", handle: "@emily.worship", views: "1.6M", clips: 6, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=emilyworship", rank: 3 },
  { name: "Ana Ferreira", handle: "@ana.clips", views: "1.5M", clips: 6, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana", rank: 4 },
  { name: "Gabriel Torres", handle: "@gabriel.creates", views: "1.3M", clips: 3, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=gabriel", rank: 5 },
];

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const medalColors = ["#F5A623", "#9ca3af", "#92400e"];

export function RankingPreview() {
  const { locale, t } = useLocale();

  return (
    <section id="ranking" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            {t.rankingPreview.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            {t.rankingPreview.sectionSubtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="space-y-3">
            {topCreators.map((creator, i) => (
              <div
                key={creator.name}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                  i === 0
                    ? "border-[#F5A623]/30 bg-[#F5A623]/5"
                    : "border-amber-200 bg-white hover:border-[#F5A623]/20"
                }`}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center text-sm font-bold"
                  style={{
                    clipPath: hexClip,
                    background: i < 3 ? medalColors[i] : "#e5e7eb",
                    color: i === 0 ? "black" : i < 3 ? "white" : "#6b7280",
                  }}
                >
                  {creator.rank}
                </span>
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-10 w-10 bg-amber-50"
                  style={{ clipPath: hexClip }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{creator.name}</p>
                  <p className="text-xs text-gray-500">{creator.handle} · {creator.clips} {t.rankingPreview.contents}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                  <Eye className="h-4 w-4 text-gray-500" />
                  {creator.views}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/ranking`}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 transition-all hover:border-[#F5A623]/50 hover:text-gray-900"
            >
              <Trophy className="h-4 w-4 text-[#F5A623]" />
              {t.rankingPreview.viewFullRanking}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
