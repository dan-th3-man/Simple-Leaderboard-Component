'use client';

import { PrivyProvider as Provider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

export function PrivyProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <Provider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      onSuccess={(user) => {
        console.log(`User ${user.id} logged in!`);
      }}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          showWalletLoginFirst: false,
        }
      }}
    >
      {children}
    </Provider>
  );
} 