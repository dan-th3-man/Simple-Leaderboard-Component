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

export async function fetchLeaderboardWithChanges(): Promise<LeaderboardEntry[]> {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const twelveHoursAgo = now - (12 * 60 * 60); // 12 hours ago in seconds
  
  const currentParams: LeaderboardQueryParams = {
    chain: "arbitrum-sepolia",
    app_id: APP_ID ?? ''
  };
  
  const previousParams: LeaderboardQueryParams = {
    chain: "arbitrum-sepolia",
    app_id: APP_ID ?? '',
    end: twelveHoursAgo.toString()
  };

  try {
    // Fetch both current and previous leaderboards
    const [current, previous] = await Promise.all([
      fetchLeaderboard(currentParams),
      fetchLeaderboard(previousParams)
    ]);

    console.log('Current data:', current);
    console.log('Previous data:', previous);

    return current.map(entry => {
      const previousPosition = previous.findIndex(p => p.user.toLowerCase() === entry.user.toLowerCase());
      const currentPosition = current.findIndex(p => p.user.toLowerCase() === entry.user.toLowerCase());
      
      let positionChange: number | 'new' = 'new';
      
      if (previousPosition !== -1) {
        positionChange = previousPosition - currentPosition;
      }

      return {
        ...entry,
        positionChange
      };
    });

  } catch (error) {
    console.error('Error in fetchLeaderboardWithChanges:', error);
    throw error;
  }
} 