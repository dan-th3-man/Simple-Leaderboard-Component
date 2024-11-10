'use client';

import { PrivyProvider as Provider, User } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes'

export function PrivyProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const getUserIdentifier = (user: User) => {
    if (user.discord?.username) {
      return user.discord.username;
    } else if (user.google?.email) {
      return user.google.email;
    } else if (user.email?.address) {
      return user.email.address;
    } else if (user.wallet?.address) {
      return user.wallet.address;
    }
    return 'Unknown User';
  };

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <Provider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        onSuccess={(user) => {
          console.log(`User ${user.id} logged in!`);
        }}
        config={{
          loginMethods: ['email', 'wallet', 'discord', 'google'],
          appearance: {
            theme: 'dark',
            accentColor: '#9333EA', // Purple-600
            showWalletLoginFirst: false,
          }
        }}
      >
        {children}
      </Provider>
    </ThemeProvider>
  );
} 