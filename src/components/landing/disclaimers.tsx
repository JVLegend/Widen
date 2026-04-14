"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Ban, MessageCircleOff, UserX, Scale, AlertTriangle } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const icons = [MessageCircleOff, Ban, UserX, AlertTriangle, Scale, ShieldAlert];

export function Disclaimers() {
  const { t } = useLocale();

  return (
    <section id="regras" className="bg-[#FFFBF0] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
          >
            <ShieldAlert className="h-4 w-4" />
            {t.disclaimers.sectionTitle}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            {t.disclaimers.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-lg text-gray-600"
          >
            {t.disclaimers.sectionSubtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t.disclaimers.rules.map((rule, i) => {
            const Icon = icons[i] || ShieldAlert;
            return (
              <div
                key={rule.title}
                className={`rounded-2xl border p-6 transition-all ${
                  rule.severity === "critical"
                    ? "border-red-200 bg-red-50 hover:border-red-300"
                    : "border-amber-200 bg-amber-50 hover:border-amber-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    rule.severity === "critical"
                      ? "bg-red-100"
                      : "bg-amber-100"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      rule.severity === "critical" ? "text-red-500" : "text-amber-500"
                    }`}
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{rule.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {rule.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
