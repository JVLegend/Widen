import type { User, SocialAccount, Video, Campaign, CampaignVideo, Clip, Ranking } from "@prisma/client";

// Re-export Prisma types
export type { User, SocialAccount, Video, Campaign, CampaignVideo, Clip, Ranking };

// Auth session stored in localStorage
export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: "influencer" | "clipper";
  avatarUrl: string | null;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Campaign with relations
export interface CampaignWithDetails extends Campaign {
  influencer: Pick<User, "id" | "name" | "avatarUrl">;
  campaignVideos: (CampaignVideo & { video: Video })[];
  clips: ClipWithDetails[];
  _count?: { clips: number };
}

// Clip with relations
export interface ClipWithDetails extends Clip {
  clipper: Pick<User, "id" | "name" | "avatarUrl">;
  campaign: Pick<Campaign, "id" | "name">;
  video: Pick<Video, "id" | "title" | "thumbnailUrl">;
  socialAccount: Pick<SocialAccount, "id" | "handle" | "platform">;
}

// Analytics data types
export interface DailyViews {
  date: string;
  views: number;
}

export interface PlatformStats {
  platform: string;
  views: number;
  clips: number;
}

export interface TopClipper {
  id: string;
  name: string;
  avatarUrl: string | null;
  totalViews: number;
  totalClips: number;
}

export interface InfluencerAnalytics {
  totalViews: number;
  totalClips: number;
  totalCampaigns: number;
  dailyViews: DailyViews[];
  platformStats: PlatformStats[];
  topClippers: TopClipper[];
}

export interface ClipperAnalytics {
  totalViews: number;
  totalClips: number;
  totalEarnings: number;
  pendingEarnings: number;
  activeCampaigns: number;
  dailyViews: DailyViews[];
  platformStats: PlatformStats[];
  earningsByMonth: { month: string; earnings: number }[];
}

// Ranking entry for display
export interface RankingEntry {
  position: number;
  clipperId: string;
  clipperName: string;
  clipperAvatar: string | null;
  totalViews: number;
  totalClips: number;
  badge: string | null;
}
