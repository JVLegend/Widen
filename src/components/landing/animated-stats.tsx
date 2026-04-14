"use client";

import { motion } from "framer-motion";
import { Megaphone, BarChart3, Shield, Zap } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const icons = [Megaphone, BarChart3, Shield, Zap];

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function AnimatedStats() {
  const { t } = useLocale();

  return (
    <section id="o-que-fazemos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            {t.stats.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            {t.stats.sectionSubtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {t.stats.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-amber-200 bg-white p-6 transition-all duration-300 hover:border-[#F5A623]/50 hover:shadow-[0_0_30px_rgba(245,166,35,0.08)]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center bg-[#F5A623]/10"
                  style={{ clipPath: hexClip }}
                >
                  <Icon className="h-6 w-6 text-[#F5A623]" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {card.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
