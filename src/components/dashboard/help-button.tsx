"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/hooks/use-locale";

type HelpContent = { en: string | string[]; br: string | string[] };
type HelpTitle = { en: string; br: string };

export function HelpButton({ title, content }: { title: HelpTitle; content: HelpContent }) {
  const [open, setOpen] = useState(false);
  const { locale } = useLocale();
  const lc = locale === "br" ? "br" : "en";
  const body = content[lc];
  const paragraphs = Array.isArray(body) ? body : [body];
  const label = locale === "br" ? "Como usar" : "How to use";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 border-amber-100 text-gray-700 hover:text-gray-900"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title[lc]}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm text-gray-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
