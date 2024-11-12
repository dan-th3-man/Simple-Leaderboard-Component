import { PrivyClient } from "@privy-io/server-auth";
import { NextResponse } from "next/server";
import type { Address } from "viem";

const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  // Check each environment variable separately
  const missingVars = [];
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    missingVars.push('NEXT_PUBLIC_PRIVY_APP_ID');
  }
  if (!process.env.PRIVY_APP_SECRET) {
    missingVars.push('PRIVY_APP_SECRET');
  }

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

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  const privyClient = new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
    process.env.PRIVY_APP_SECRET as string
  );

  try {
    const user = await privyClient.getUserByWalletAddress(wallet as Address);
    
    if (!user) {
      return NextResponse.json({ handle: truncateAddress(wallet) });
    }

    if (user?.discord?.username) {
      return NextResponse.json({ handle: user.discord.username.replace('#0', '') });
    }
    if (user?.google?.email) {
      return NextResponse.json({ handle: user.google.email });
    }
    if (user?.email?.address) {
      return NextResponse.json({ handle: user.email.address });
    }

    return NextResponse.json({ handle: truncateAddress(wallet) });
  } catch (error) {
    console.error('Privy error:', error);
    return NextResponse.json({ handle: truncateAddress(wallet) });
  }
}