import { PrivyClient } from "@privy-io/server-auth";
import { NextResponse } from "next/server";
import type { Address } from "viem";

/**
 * Truncates an Ethereum address to a shorter format
 * Example: 0x1234...5678
 * @param address - The full Ethereum address
 * @returns Truncated address string or empty string if no address provided
 */
const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

/**
 * API Route Handler for getting a user's display handle
 * Attempts to fetch user's social login info (Discord, Google, Email)
 * Falls back to truncated wallet address if no social login found
 */
export async function GET(request: Request) {
  // Extract wallet address from query parameters
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  // Validate environment variables
  // Required for Privy client initialization
  const missingVars = [];
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    missingVars.push('NEXT_PUBLIC_PRIVY_APP_ID');
  }
  if (!process.env.PRIVY_APP_SECRET) {
    missingVars.push('PRIVY_APP_SECRET');
  }

  // If any environment variables are missing, return early with debug info
  if (missingVars.length > 0) {
    console.error(`Missing Privy environment variables: ${missingVars.join(', ')}`);
    return NextResponse.json({ 
      handle: truncateAddress(wallet || ''),
      error: `Missing environment variables: ${missingVars.join(', ')}`,
      debug: {
        missingVars,
        hasAppId: !!process.env.NEXT_PUBLIC_PRIVY_APP_ID,
        hasSecret: !!process.env.PRIVY_APP_SECRET
      }
    });
  }

  // Validate wallet address is provided
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  // Initialize Privy client with environment variables
  const privyClient = new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
    process.env.PRIVY_APP_SECRET as string
  );

  try {
    // Attempt to fetch user data from Privy
    const user = await privyClient.getUserByWalletAddress(wallet as Address);
    
    // If no user found, return truncated wallet address
    if (!user) {
      return NextResponse.json({ handle: truncateAddress(wallet) });
    }

    // Priority order for display handle:
    // 1. Discord username (remove #0 suffix)
    // 2. Google email
    // 3. Email address
    // 4. Truncated wallet address (fallback)
    if (user?.discord?.username) {
      return NextResponse.json({ handle: user.discord.username.replace('#0', '') });
    }
    if (user?.google?.email) {
      return NextResponse.json({ handle: user.google.email });
    }
    if (user?.email?.address) {
      return NextResponse.json({ handle: user.email.address });
    }

    // Fallback to truncated wallet if no social logins found
    return NextResponse.json({ handle: truncateAddress(wallet) });
  } catch (error) {
    // Log error and fallback to truncated wallet address
    console.error('Privy error:', error);
    return NextResponse.json({ handle: truncateAddress(wallet) });
  }
}