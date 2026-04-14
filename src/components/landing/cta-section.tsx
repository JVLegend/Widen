"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

/* Honeycomb pattern for CTA background */
const honeycombBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66ZM28 100L0 84L0 50L28 34L56 50L56 84L28 100Z' fill='none' stroke='%23F5A623' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E")`;

export function CTASection() {
  const { locale, t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-[#FFFBF0] py-20 sm:py-28">
      {/* Glow background */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5A623]/5 blur-[120px]" />
        <div className="absolute inset-0" style={{ backgroundImage: honeycombBg }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            {t.cta.title} <span className="text-[#F5A623]">{t.cta.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t.cta.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-10 max-w-md"
        >
          <ul className="space-y-3">
            {t.cta.benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="h-4 w-4 shrink-0 text-[#F5A623]" />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href={`/${locale}/signup?role=church`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F5A623] px-8 py-4 text-base font-semibold text-black transition-all hover:bg-[#FFB830] hover:shadow-[0_0_30px_rgba(245,166,35,0.3)] sm:w-auto"
          >
            {t.cta.ctaChurch}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/signup?role=creator`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#F5A623]/50 bg-[#F5A623]/10 px-8 py-4 text-base font-semibold text-[#F5A623] transition-all hover:bg-[#F5A623]/20 sm:w-auto"
          >
            {t.cta.ctaCreator}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <Mail className="h-4 w-4" />
          {t.cta.contact}
        </motion.div>
      </div>
    </section>
  );
}
