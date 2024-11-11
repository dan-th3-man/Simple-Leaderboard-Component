export interface LeaderboardEntry {
  user: string;
  xp_rewarded: string;
  positionChange?: 'new' | number; // number represents positions changed (positive = improved, negative = declined)
}

export interface LeaderboardQueryParams {
  chain: string;
  app_id: string;
  start?: string;
  end?: string;
} 