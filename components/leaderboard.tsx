'use client'

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchLeaderboardWithChanges } from "@/services/leaderboardApi"
import { LeaderboardEntry } from "@/types/leaderboard"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { RefreshCw, Moon, Sun, Trophy, Swords, Calendar, Star, Minus, ArrowUp, ArrowDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton" 

/**
 * Component shown when user has no points
 * Displays information about how to earn points and start participating
 */
function NoPointsMessage({ theme, setTheme, onRefresh }: { 
  theme: string | undefined, 
  setTheme: (theme: string) => void,
  onRefresh: () => Promise<void>
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-zinc-50 dark:bg-zinc-950 shadow-lg">
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
            You haven&apos;t earned any points yet. Start your journey to the top of the leaderboard!
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

/**
 * Individual row in the leaderboard
 * Displays position, user handle, points, and position changes
 */
const LeaderboardRow = ({ entry, position, currentWallet}: { 
  entry: LeaderboardEntry
  position: number
  currentWallet?: string
}) => {
  const [displayName, setDisplayName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const isCurrentUser = currentWallet && entry.user.toLowerCase() === currentWallet.toLowerCase()

  useEffect(() => {
    const fetchUserHandle = async () => {
      try {
        const response = await fetch(`/api/getUserHandle?wallet=${entry.user}`);
        const data = await response.json();
        if (data.handle) {
          setDisplayName(data.handle);
        }
      } catch (error) {
        console.error('Failed to fetch user handle:', error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchUserHandle();
  }, [entry.user]);

  const renderPositionChange = () => {
    if (position === 1) {
      return (
        <span className="flex items-center justify-end text-yellow-500 text-sm w-16">
          <Trophy className="h-4 w-4" />
        </span>
      )
    }

    if (entry.positionChange === undefined || entry.positionChange === null) {
      return (
        <span className="flex items-center justify-end text-gray-500 text-sm w-16">
          <Minus className="h-4 w-4" />
        </span>
      )
    }
    
    if (entry.positionChange === 'new') {
      return (
        <span className="flex items-center justify-end text-blue-500 text-sm w-16">
          <Star className="h-4 w-4" />
        </span>
      )
    }
    
    if (entry.positionChange === 0) {
      return (
        <span className="flex items-center justify-end text-gray-500 text-sm w-16">
          <Minus className="h-4 w-4" />
          0
        </span>
      )
    }

    if (entry.positionChange > 0) {
      return (
        <span className="flex items-center justify-end text-green-500 text-sm w-16">
          <ArrowUp className="h-4 w-4" />
          {entry.positionChange}
        </span>
      )
    }

    return (
      <span className="flex items-center justify-end text-red-500 text-sm w-16">
        <ArrowDown className="h-4 w-4" />
        {Math.abs(entry.positionChange)}
      </span>
    )
  }

  return (
    <div className={cn(
      "flex items-center justify-between py-4 px-4 rounded-lg transition-colors",
      isCurrentUser ? "bg-purple-100 dark:bg-purple-900/50" : "hover:bg-zinc-100/80 dark:hover:bg-zinc-900/30"
    )}>
      <div className="flex items-center gap-4 flex-1">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold",
          position === 1 ? "bg-yellow-500 text-white" :
          position === 2 ? "bg-gray-300 text-gray-800" :
          position === 3 ? "bg-amber-600 text-white" :
          "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
        )}>
          {position}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isLoading ? (
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ) : (
            <span className="font-medium truncate">
              {displayName}
            </span>
          )}
          {isCurrentUser && (
            <span className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full whitespace-nowrap">You</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="font-semibold w-40 text-right">{entry.xp_rewarded} Points</div>
        {renderPositionChange()}
      </div>
    </div>
  )
}

/**
 * Main Leaderboard Component
 * Displays user rankings with points and position changes
 */
export default function Leaderboard({ currentWallet }: { currentWallet?: string }) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [visibleData, setVisibleData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  /**
   * Updates visible data to show relevant positions
   * Shows 7 positions: current user's position ±3 positions
   * If user not found, shows top 7
   */
  const updateVisibleData = useCallback((data: LeaderboardEntry[]) => {
    if (!currentWallet) {
      setVisibleData(data.slice(0, 7))
      return
    }

    const userIndex = data.findIndex(entry => entry.user.toLowerCase() === currentWallet.toLowerCase())
    if (userIndex === -1) {
      setVisibleData(data.slice(0, 7))
      return
    }

    const start = Math.max(0, userIndex - 3)
    const end = Math.min(data.length, userIndex + 4)
    setVisibleData(data.slice(start, end))
  }, [currentWallet])

  const loadLeaderboard = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    setIsRefreshing(true)
    
    try {
      const data = await fetchLeaderboardWithChanges()
      setLeaderboardData(data)
      updateVisibleData(data)
    } catch (err) {
      setError("Failed to load leaderboard data")
      console.error(err)
    } finally {
      if (!silent) setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [updateVisibleData])

  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  useEffect(() => {
    updateVisibleData(leaderboardData)
  }, [leaderboardData, currentWallet, updateVisibleData])

  const userHasPoints = () => {
    if (!currentWallet) return false
    return leaderboardData.some(
      entry => entry.user.toLowerCase() === currentWallet.toLowerCase()
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-950 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!userHasPoints()) {
    return (
      <div className="container mx-auto p-4">
        <NoPointsMessage theme={theme} setTheme={setTheme} onRefresh={loadLeaderboard} />
      </div>
    )
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No leaderboard data available</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto bg-zinc-50 dark:bg-zinc-950 shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Dan&apos;s Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {leaderboardData.length} {leaderboardData.length === 1 ? 'Participant' : 'Participants'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
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
                variant="outline"
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
            className="space-y-2 transition-all duration-500"
            style={{ opacity: isRefreshing ? 0.7 : 1 }}
          >
            {visibleData.map((entry) => (
              <LeaderboardRow 
                key={entry.user}
                entry={entry} 
                position={leaderboardData.findIndex(e => e.user === entry.user) + 1}
                currentWallet={currentWallet}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}