"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function Pricing() {
  const { locale, t } = useLocale();

  const plans = [
    {
      name: t.pricing.free.name,
      price: t.pricing.free.price,
      period: "",
      description: t.pricing.free.description,
      features: [...t.pricing.free.features],
      cta: t.common.signup,
      popular: false,
    },
    {
      name: t.pricing.pro.name,
      price: t.pricing.pro.price,
      period: "",
      description: t.pricing.pro.description,
      features: [...t.pricing.pro.features],
      cta: t.pricing.pro.name,
      popular: true,
    },
    {
      name: t.pricing.enterprise.name,
      price: t.pricing.enterprise.price,
      period: "",
      description: t.pricing.enterprise.description,
      features: [...t.pricing.enterprise.features],
      cta: t.pricing.enterprise.name,
      popular: false,
    },
  ];

  return (
    <section id="precos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t.pricing.sectionTitle}</h2>
          <p className="mt-4 text-lg text-gray-600">
            {t.pricing.sectionSubtitle}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "relative border-primary shadow-lg" : ""}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={plan.popular ? "default" : "outline"}
                  render={<Link href={`/${locale}/signup?role=church`} />}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
