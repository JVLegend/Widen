"use client";

import { motion } from "framer-motion";
import { Upload, Scissors, BarChart3, DollarSign, Search, Share2 } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const icons = [Upload, Search, Scissors, Share2, BarChart3, DollarSign];

const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function HowItWorks() {
  const { t } = useLocale();

  const steps = t.howItWorks.steps.map((step, i) => ({
    icon: icons[i],
    number: String(i + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
  }));

  return (
    <section id="como-funciona" className="bg-[#FFFBF0] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            {t.howItWorks.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            {t.howItWorks.sectionSubtitle}
          </motion.p>
        </div>

        <div className="relative mt-16">
          {/* Vertical line connector (desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#F5A623]/0 via-[#F5A623]/20 to-[#F5A623]/0 lg:block" />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex flex-col items-center gap-6 lg:flex-row ${
                  i % 2 === 0 ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-flex items-center gap-3 ${
                      i % 2 === 0 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-sm font-bold text-[#F5A623]">{step.number}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>

                {/* Center hexagon icon */}
                <div
                  className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center border border-amber-200 bg-white transition-all hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.15)]"
                  style={{ clipPath: hexClip }}
                >
                  <step.icon className="h-6 w-6 text-[#F5A623]" />
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
