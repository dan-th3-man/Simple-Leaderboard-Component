import { LeaderboardEntry, LeaderboardQueryParams } from "@/types/leaderboard";

const API_BASE_URL = "/api/leaderboard";
const APP_ID = process.env.NEXT_PUBLIC_OPENFORMAT_DAPP_ID;

export async function fetchLeaderboard(params: LeaderboardQueryParams): Promise<LeaderboardEntry[]> {
  const queryString = new URLSearchParams({
    chain: params.chain,
    app_id: APP_ID ?? '',
    ...(params.start && { start: params.start }),
    ...(params.end && { end: params.end }),
  }).toString();

  const response = await fetch(`${API_BASE_URL}?${queryString}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  return data;
} 