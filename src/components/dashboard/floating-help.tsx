"use client";

import { usePathname } from "next/navigation";
import { HelpButton } from "./help-button";

type HelpEntry = {
  title: { en: string; br: string };
  content: { en: string[]; br: string[] };
};

const ENTRIES: { match: (path: string) => boolean; data: HelpEntry }[] = [
  {
    match: (p) => /\/church$/.test(p),
    data: {
      title: { en: "How to use — Church home", br: "Como usar — Home da Igreja" },
      content: {
        en: [
          "Welcome to your ministry dashboard. Stats summarize missions, sermons and reach.",
          "Use 'New mission' to create a campaign that creators can clip.",
        ],
        br: [
          "Bem-vindo ao painel da igreja. Os stats resumem missoes, sermoes e alcance.",
          "Use 'Nova missao' para criar uma campanha que creators podem cortar.",
        ],
      },
    },
  },
  {
    match: (p) => /\/church\/sermons/.test(p),
    data: {
      title: { en: "How to use — Sermons", br: "Como usar — Sermoes" },
      content: {
        en: ["Upload sermons or paste YouTube URLs. Available sermons can be attached to campaigns."],
        br: ["Suba sermoes ou cole URLs do YouTube. Sermoes disponiveis podem ser anexados a campanhas."],
      },
    },
  },
  {
    match: (p) => /\/church\/analytics/.test(p),
    data: {
      title: { en: "How to use — Analytics", br: "Como usar — Analytics" },
      content: {
        en: ["Track reach, impact points spent, and top creators for your missions."],
        br: ["Acompanhe alcance, pontos gastos e top creators das suas missoes."],
      },
    },
  },
  {
    match: (p) => /\/church\/settings|\/creator\/settings/.test(p),
    data: {
      title: { en: "How to use — Settings", br: "Como usar — Configuracoes" },
      content: {
        en: ["Update your profile, avatar and preferences."],
        br: ["Atualize seu perfil, avatar e preferencias."],
      },
    },
  },
  {
    match: (p) => /\/creator\/missions/.test(p),
    data: {
      title: { en: "How to use — Missions", br: "Como usar — Missoes" },
      content: {
        en: ["Browse open missions, pick a sermon, and submit your clip URL."],
        br: ["Navegue pelas missoes abertas, escolha um sermao e envie a URL do seu corte."],
      },
    },
  },
  {
    match: (p) => /\/creator\/social-accounts/.test(p),
    data: {
      title: { en: "How to use — Social Accounts", br: "Como usar — Redes Sociais" },
      content: {
        en: ["Connect YouTube, TikTok and Instagram handles so your clips can be attributed to you."],
        br: ["Conecte seus handles de YouTube, TikTok e Instagram para seus cortes serem atribuidos a voce."],
      },
    },
  },
  {
    match: (p) => /\/creator\/analytics/.test(p),
    data: {
      title: { en: "How to use — Analytics", br: "Como usar — Analytics" },
      content: {
        en: ["See your total views, impact points and best-performing clips."],
        br: ["Veja seu total de views, pontos de impacto e cortes que mais performaram."],
      },
    },
  },
];

export function FloatingHelp() {
  const pathname = usePathname() || "";
  const entry = ENTRIES.find((e) => e.match(pathname));
  if (!entry) return null;
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <HelpButton title={entry.data.title} content={entry.data.content} />
    </div>
  );
}
