"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Percent,
  Clock,
  Target,
  Gift,
  ShieldCheck,
  ChevronDown,
  CreditCard,
  TrendingUp,
  Wallet,
  ArrowDown,
  RefreshCcw,
  HelpCircle,
  Star,
} from "lucide-react";

/* --- Impact point tiers --- */
const tiers = [
  { min: "5,000 pts", max: "9,999 pts", retention: "20%", net: "80%", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  { min: "10,000 pts", max: "19,999 pts", retention: "15%", net: "85%", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  { min: "20,000 pts", max: "no limit", retention: "10%", net: "90%", color: "text-[#F5A623]", bg: "bg-[#F5A623]/10 border-[#F5A623]/20" },
];

/* --- FAQ items --- */
const faqChurch = [
  {
    q: "What happens with my impact points fund?",
    a: "Your points fund is used exclusively to reward creators who participate in your missions. The platform applies a retention fee before distributing. You can track everything in real time on the dashboard.",
  },
  {
    q: "What if 50 content pieces are not generated?",
    a: "We refund the full value of your points. That's our commitment: we only charge if we deliver results. The 50 content pieces are counted across all creators who participate in your missions.",
  },
  {
    q: "Can I add more points later?",
    a: "Yes. You can make additional deposits at any time. The retention fee is calculated based on the total accumulated value -- so if you start with 5K points (20%) and later add another 5K, the fee drops to 15% on the total.",
  },
  {
    q: "How does the 20%, 15%, or 10% retention work?",
    a: "Retention is the platform fee on the deposited points. The larger the investment, the lower the fee. Example: with 5,000 points of credit, 4,000 go to reward creators and 1,000 is the platform fee.",
  },
];

const faqCreator = [
  {
    q: "When can I redeem my impact points?",
    a: "Redemptions can be made every 15 days. There is no minimum amount -- you can redeem any accumulated points.",
  },
  {
    q: "How does the 50% bonus work?",
    a: "During the launch promotional period, when you hit platform-defined milestones (e.g., X content pieces in a month, Y total reach), you earn a 50% bonus on your points for that period. Example: if you earned 200 pts and hit the milestone, you receive 300 pts.",
  },
  {
    q: "What counts as reach?",
    a: "We count unique views from the platform where the content was published (TikTok, Instagram Reels, YouTube Shorts). Duplicate views or bot views are not counted.",
  },
  {
    q: "Can I participate in multiple missions at the same time?",
    a: "Yes! There's no limit. The more missions you join and the more quality content you create, the more impact points you earn.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-amber-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="pr-4 text-sm font-medium text-gray-900">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-40 pb-4" : "max-h-0"}`}>
        <p className="text-sm leading-relaxed text-gray-600">{a}</p>
      </div>
    </div>
  );
}

export default function InternalFAQPage() {
  const { user } = useAuth();
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">How {t.brand} Works</h1>
        <p className="mt-1 text-gray-600">Business model, impact points, and platform rules</p>
      </div>

      {/* ================================================================== */}
      {/* CHURCH SECTION                                                      */}
      {/* ================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#F5A623]" />
          <h2 className="text-lg font-semibold text-gray-900">For Churches</h2>
        </div>

        {/* Points fund + guarantee */}
        <Card className="border-amber-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Star className="h-4 w-4 text-[#F5A623]" />
              Impact Points Fund &amp; Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-600">
              The church deposits an <span className="font-semibold text-gray-900">impact points fund starting at 5,000 pts</span> that will be
              used to reward the creators in your missions. The platform applies a retention fee on this amount.
            </p>

            <div className="rounded-lg border border-[#F5A623]/30 bg-[#F5A623]/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A623]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Results guarantee</p>
                  <p className="mt-1 text-sm text-gray-600">
                    If we don&apos;t generate at least <span className="font-semibold text-gray-900">50 content pieces</span> for your sermons,
                    we refund <span className="font-semibold text-gray-900">100% of your points</span>. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee tiers */}
        <Card className="border-amber-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Percent className="h-4 w-4 text-[#F5A623]" />
              Retention Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              The bigger the investment, the lower the fee. Simple.
            </p>

            <div className="space-y-3">
              {tiers.map((tier) => (
                <div key={tier.retention} className={`flex items-center gap-4 rounded-xl border p-4 ${tier.bg}`}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {tier.min} — {tier.max}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-600">
                      {tier.net} goes to creator rewards
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${tier.color}`}>{tier.retention}</span>
                    <p className="text-xs text-gray-600">retention</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Practical example */}
            <div className="mt-4 rounded-lg border border-amber-100 bg-[#FFFBF0] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Practical example</p>
              <div className="mt-2 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-lg font-bold text-gray-900">10,000 pts</p>
                  <p className="text-xs text-gray-600">Points Fund</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#F5A623]">8,500 pts</p>
                  <p className="text-xs text-gray-600">For creators</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">1,500 pts</p>
                  <p className="text-xs text-gray-600">Fee (15%)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Church */}
        <Card className="border-amber-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <HelpCircle className="h-4 w-4 text-[#F5A623]" />
              Frequently Asked Questions -- Churches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faqChurch.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ================================================================== */}
      {/* CREATOR SECTION                                                     */}
      {/* ================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#F5A623]" />
          <h2 className="text-lg font-semibold text-gray-900">For Creators</h2>
        </div>

        {/* Rewards */}
        <Card className="border-amber-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <TrendingUp className="h-4 w-4 text-[#F5A623]" />
              Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-[#F5A623]/20 bg-[#F5A623]/5 p-5">
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">100 pts</p>
                <p className="text-sm text-gray-600">per <span className="font-semibold text-gray-900">100,000 views</span></p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5A623]/10">
                <Star className="h-6 w-6 text-[#F5A623]" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              Points are calculated automatically based on verified reach from your published content.
              Your impact points accumulate in real time and you can track everything on the dashboard.
            </p>
          </CardContent>
        </Card>

        {/* Redemptions */}
        <Card className="border-amber-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <ArrowDown className="h-4 w-4 text-[#F5A623]" />
              Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-100 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">Frequency</p>
                </div>
                <p className="mt-1 text-2xl font-bold text-gray-900">Every 15 days</p>
                <p className="text-xs text-gray-600">Redemption window opens biweekly</p>
              </div>
              <div className="rounded-xl border border-amber-100 p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">Minimum amount</p>
                </div>
                <p className="mt-2 text-2xl font-bold text-[#F5A623]">None</p>
                <p className="text-xs text-gray-600">Redeem any accumulated points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone bonus */}
        <Card className="border-[#F5A623]/30 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                <Gift className="h-4 w-4 text-[#F5A623]" />
                Milestone Bonus
              </CardTitle>
              <Badge variant="default" className="bg-[#F5A623] text-white text-xs">Launch Promo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-[#F5A623]/20 bg-[#F5A623]/5 p-5">
              <div className="flex-1">
                <p className="text-3xl font-bold text-[#F5A623]">+50%</p>
                <p className="text-sm text-gray-600">bonus when hitting milestones</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5A623]/10">
                <Target className="h-6 w-6 text-[#F5A623]" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              During the launch promotional period, creators who hit platform-defined milestones
              earn a <span className="font-semibold text-gray-900">50% bonus</span> on their points for that period.
            </p>

            {/* Example */}
            <div className="rounded-lg border border-amber-100 bg-[#FFFBF0] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Example</p>
              <div className="mt-2 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-lg font-bold text-gray-900">200 pts</p>
                  <p className="text-xs text-gray-600">Base earnings</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#F5A623]">+ 100 pts</p>
                  <p className="text-xs text-gray-600">50% Bonus</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">300 pts</p>
                  <p className="text-xs text-gray-600">Total received</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-gray-600">
                Milestones and bonus percentages may be adjusted by the platform. Check your dashboard for active milestones and your progress.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Creator */}
        <Card className="border-amber-100 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <HelpCircle className="h-4 w-4 text-[#F5A623]" />
              Frequently Asked Questions -- Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faqCreator.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
