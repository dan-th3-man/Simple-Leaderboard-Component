'use client'

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { fetchLeaderboard } from "@/services/leaderboardApi";
import { LeaderboardEntry, LeaderboardQueryParams } from "@/types/leaderboard";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { RefreshCw, Moon, Sun, Trophy, Swords, Calendar } from "lucide-react"
import { usePrivy } from '@privy-io/react-auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const getUserIdentifier = (user: any) => {
  const userData = user.linked_accounts || user;
  
  if (userData.discord?.username) {
    return userData.discord.username.replace('#0', '');
  } else if (userData.google?.email) {
    return userData.google.email;
  } else if (userData.email?.address) {
    return userData.email.address;
  } else if (userData.wallet?.address) {
    return userData.wallet.address;
  }
  return user.id || 'Unknown User';
};

function NoPointsMessage({ theme, setTheme, onRefresh }: { 
  theme: string | undefined, 
  setTheme: (theme: string) => void,
  onRefresh: () => Promise<void>
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-950 shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to the Leaderboard!</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="rounded-full"
            >
              <RefreshCw className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Refresh leaderboard</span>
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Trophy className="h-4 w-4" />
          <AlertTitle>No Points Yet</AlertTitle>
          <AlertDescription>
            You haven't earned any points yet. Start your journey to the top of the leaderboard!
          </AlertDescription>
        </Alert>
        
        <div className="rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Earn Points</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <h3 className="font-medium">Complete Quests</h3>
                <p className="text-sm text-muted-foreground">Embark on exciting quests to earn points and rewards.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Swords className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <h3 className="font-medium">Win Battles</h3>
                <p className="text-sm text-muted-foreground">Challenge other players and climb the ranks with each victory.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <h3 className="font-medium">Weekly Challenges</h3>
                <p className="text-sm text-muted-foreground">Participate in special events for bonus points and unique rewards.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button className="w-full sm:w-auto" onClick={onRefresh}>
            Start Earning Points
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Leaderboard({ currentWallet }: { currentWallet?: string }) {
  const { user } = usePrivy();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLeaderboard = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setIsRefreshing(true);
    
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
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const userHasPoints = () => {
    if (!currentWallet) return false;
    return leaderboardData.some(
      entry => entry.user.toLowerCase() === currentWallet.toLowerCase()
    );
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500 text-center">{error}</div>;
  }

  if (!userHasPoints()) {
    return (
      <div className="container mx-auto p-4">
        <NoPointsMessage theme={theme} setTheme={setTheme} onRefresh={loadLeaderboard} />
      </div>
    );
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => loadLeaderboard(true)}
                className="rounded-full"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
                  isRefreshing ? 'animate-spin' : ''
                }`} />
                <span className="sr-only">Refresh leaderboard</span>
              </Button>
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
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="space-y-1 transition-all duration-500"
            style={{ opacity: isRefreshing ? 0.7 : 1 }}
          >
            {leaderboardData.map((entry, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 rounded-lg ${
                  currentWallet && entry.user.toLowerCase() === currentWallet.toLowerCase()
                    ? 'bg-purple-100 dark:bg-purple-950/20'
                    : 'hover:bg-gray-50 dark:hover:bg-zinc-800/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-purple-500">#{index + 1}</span>
                  <span>
                    {currentWallet && entry.user.toLowerCase() === currentWallet.toLowerCase() 
                      ? getUserIdentifier(user)
                      : entry.user}
                  </span>
                  {currentWallet && entry.user.toLowerCase() === currentWallet.toLowerCase() && (
                    <span className="text-gray-500">(You)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">{entry.xp_rewarded}</span>
                  <span className="text-purple-500">XP</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}