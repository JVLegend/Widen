"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLATFORM_LABELS } from "@/lib/constants";
import { Trophy, Eye, Film, Medal, ArrowLeft } from "lucide-react";

type RankingEntry = {
  id: string;
  totalViews: number;
  totalClips: number;
  badge: string | null;
  platform: string | null;
  clipper: { id: string; name: string; avatarUrl: string | null };
};

const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

export default function RankingPage() {
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const backHref = user
    ? `/${locale}/${user.role === "clipper" ? "creator" : "church"}`
    : `/${locale}`;
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [period, setPeriod] = useState("all_time");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/rankings?period=${period}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setRankings(d.data || []); setLoading(false); } });
    return () => { cancelled = true; };
  }, [period]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Button render={<Link href={backHref} />} variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
            <Trophy className="h-7 w-7 text-[#F5A623]" />
            {t.ranking.title}
          </h1>
          <p className="text-sm text-gray-600">{t.ranking.subtitle}</p>
        </div>
      </div>

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="all_time">{t.ranking.allTime}</TabsTrigger>
          <TabsTrigger value="monthly">{t.ranking.monthly}</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5A623] border-t-transparent" />
            </div>
          ) : rankings.length === 0 ? (
            <Card className="bg-white border border-amber-100 rounded-xl">
              <CardContent className="py-16 text-center">
                <p className="text-gray-600">{t.common.noResults}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rankings.map((entry, i) => (
                <Card key={entry.id} className={`bg-white border rounded-xl ${i < 3 ? "border-[#F5A623]/30" : "border-amber-100"}`}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center">
                      {i < 3 ? (
                        <Medal className={`h-6 w-6 ${medalColors[i]}`} />
                      ) : (
                        <span className="text-lg font-bold text-gray-600">{i + 1}</span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarImage src={entry.clipper.avatarUrl || undefined} />
                      <AvatarFallback>{entry.clipper.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{entry.clipper.name}</p>
                        {entry.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {t.badges[entry.badge as keyof typeof t.badges] || entry.badge}
                          </Badge>
                        )}
                      </div>
                      {entry.platform && (
                        <p className="text-xs text-gray-600">{PLATFORM_LABELS[entry.platform]}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <Eye className="h-3.5 w-3.5" />
                        {entry.totalViews.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Film className="h-3 w-3" />
                        {entry.totalClips} {t.ranking.totalContent.toLowerCase()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
