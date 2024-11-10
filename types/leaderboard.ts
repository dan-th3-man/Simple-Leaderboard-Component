export interface LeaderboardEntry {
  user: string;
  xp_rewarded: string;
}

export interface LeaderboardQueryParams {
  chain: string;
  app_id: string;
  start?: string;
  end?: string;
} 