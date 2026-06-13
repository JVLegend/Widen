"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const avatars = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=pastorjames",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=sarahchen",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=pastordavid",
];

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function Testimonials() {
  const { t } = useLocale();

  return (
    <section className="bg-[#FFFBF0] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            {t.testimonials.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            {t.testimonials.sectionSubtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {t.testimonials.items.map((item, i) => (
            <div
              key={item.name}
              className="rounded-2xl border border-amber-200 bg-white p-6 transition-all hover:border-[#F5A623]/30"
            >
              <Quote className="h-8 w-8 text-[#F5A623]/20" />
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-amber-200 pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- Dicebear avatars are generated external images. */}
                <img
                  src={avatars[i]}
                  alt={item.name}
                  className="h-10 w-10 bg-amber-50"
                  style={{ clipPath: hexClip }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
