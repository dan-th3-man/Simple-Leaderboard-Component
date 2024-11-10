'use client';

import { usePrivy } from '@privy-io/react-auth';
import Leaderboard from '@/components/leaderboard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { login, authenticated, ready, user, logout } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <button 
          onClick={() => login()}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login with Privy
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={logout}
          >
            Logout
          </Button>
        </div>
        <Leaderboard currentWallet={user?.wallet?.address} />
      </div>
    </div>
  );
}