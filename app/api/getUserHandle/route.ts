import { PrivyClient } from "@privy-io/server-auth";
import { NextResponse } from "next/server";
import type { Address } from "viem";

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
  throw new Error("Missing Privy environment variables");
}

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
  process.env.PRIVY_APP_SECRET as string
);

const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    const user = await privyClient.getUserByWalletAddress(wallet as Address);
    
    // If no user found, return truncated wallet address
    if (!user) {
      return NextResponse.json({ handle: truncateAddress(wallet) });
    }

    // Return social identifiers as-is
    if (user?.discord?.username) {
      return NextResponse.json({ handle: user.discord.username.replace('#0', '') });
    }
    if (user?.google?.email) {
      return NextResponse.json({ handle: user.google.email });
    }
    if (user?.email?.address) {
      return NextResponse.json({ handle: user.email.address });
    }

    // Default to truncated wallet address
    return NextResponse.json({ handle: truncateAddress(wallet) });
  } catch (error) {
    console.error('Privy error:', error);
    return NextResponse.json({ handle: truncateAddress(wallet) });
  }
}