// Roles (DB values stay as influencer/clipper for compatibility, display as church/creator)
export const ROLES = ["influencer", "clipper"] as const;
export type Role = (typeof ROLES)[number];

// Platforms
export const PLATFORMS = ["youtube", "instagram", "tiktok"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const VIDEO_PLATFORMS = [...PLATFORMS, "upload"] as const;
export type VideoPlatform = (typeof VIDEO_PLATFORMS)[number];

// Content categories (church-focused)
export const CATEGORIES = [
  "worship",
  "preaching",
  "testimony",
  "youth",
  "bible_study",
  "missions",
  "prayer",
  "family",
  "discipleship",
  "evangelism",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

// Video status
export const VIDEO_STATUSES = ["available", "in_campaign", "archived"] as const;
export type VideoStatus = (typeof VIDEO_STATUSES)[number];

// Campaign status
export const CAMPAIGN_STATUSES = ["draft", "active", "paused", "completed"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

// Payment models (points-based)
export const PAYMENT_MODELS = ["cpv", "fixed_per_clip"] as const;
export type PaymentModel = (typeof PAYMENT_MODELS)[number];

// Clip status
export const CLIP_STATUSES = ["pending", "active", "metrics_collected", "paid", "rejected"] as const;
export type ClipStatus = (typeof CLIP_STATUSES)[number];

// Ranking periods
export const RANKING_PERIODS = ["all_time", "monthly"] as const;
export type RankingPeriod = (typeof RANKING_PERIODS)[number];

// Ranking badges
export const BADGES = ["top1", "top3", "top10", "rising_star"] as const;
export type Badge = (typeof BADGES)[number];

// Labels are now in i18n files, but keep these for API/server-side use
export const BADGE_LABELS: Record<string, string> = {
  top1: "Top 1",
  top3: "Top 3",
  top10: "Top 10",
  rising_star: "Rising Star",
};

export const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  upload: "Direct Upload",
};

export const CATEGORY_LABELS: Record<string, string> = {
  worship: "Worship",
  preaching: "Preaching",
  testimony: "Testimony",
  youth: "Youth",
  bible_study: "Bible Study",
  missions: "Missions",
  prayer: "Prayer",
  family: "Family",
  discipleship: "Discipleship",
  evangelism: "Evangelism",
  other: "Other",
};

export const PAYMENT_MODEL_LABELS: Record<string, string> = {
  cpv: "Points per Reach (PPR)",
  fixed_per_clip: "Fixed per Content",
};

export const CLIP_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  metrics_collected: "Metrics Collected",
  paid: "Rewarded",
  rejected: "Rejected",
};

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};
