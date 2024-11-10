'use client'

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { fetchLeaderboard } from "@/services/leaderboardApi";
import { LeaderboardEntry, LeaderboardQueryParams } from "@/types/leaderboard";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function Leaderboard({ currentWallet = "0x208c5b9C4Fe63ca96736E722525c32bE411cE3ce" }: { currentWallet?: string }) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard({
          chain: "arbitrum-sepolia"
        } as LeaderboardQueryParams);
        
        if (Array.isArray(data)) {
          setLeaderboardData(data);
        } else {
          console.error('Invalid data format:', data);
          setError('Invalid data format received');
        }
      } catch (err) {
        setError("Failed to load leaderboard data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500 text-center">{error}</div>;
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return <div className="container mx-auto p-4 text-center">No leaderboard data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-950 shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {leaderboardData.length} {leaderboardData.length === 1 ? 'Participant' : 'Participants'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.user}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.user.toLowerCase() === currentWallet?.toLowerCase()
                    ? 'bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-purple-600 dark:text-purple-400 w-12 font-medium">
                    #{index + 1}
                  </span>
                  <span className="font-medium font-mono">
                    {entry.user}
                    {entry.user.toLowerCase() === currentWallet?.toLowerCase() && (
                      <span className="text-sm text-muted-foreground ml-2">(You)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{entry.xp_rewarded} XP</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}