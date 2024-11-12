# Simple Leaderboard Component

A modern, responsive leaderboard component built with Next.js, Privy authentication, and Tailwind CSS. This component displays user rankings, points, and position changes with a clean, accessible interface.

## Features

- 🌓 Dark/Light mode support
- 🔐 Authentication with Privy (Email, Wallet, Discord, Google)
- 📊 Real-time position tracking
- 🔄 Position change indicators
- 💫 Smooth loading states
- 👤 Smart user handle display (Email, Discord, or truncated wallet address)
- 📱 Fully responsive design

## Deploy
Instantly deploy your own copy of the template using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopen-format%2Fsimple-leaderboard&env=NEXT_PUBLIC_OPENFORMAT_API_KEY,NEXT_PUBLIC_OPENFORMAT_DAPP_ID,NEXT_PUBLIC_PRIVY_APP_ID,PRIVY_APP_SECRET) [![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/open-format/simple-leaderboard)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Privy Authentication
- Shadcn/ui Components

## Getting Started

1. Clone the repository

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret
NEXT_PUBLIC_OPENFORMAT_API_KEY=your_api_key
NEXT_PUBLIC_OPENFORMAT_DAPP_ID=your_dapp_id
```

4. Run the development server:
```
npm run dev
```

## API Integrations

The leaderboard integrates with two main APIs:

1. OpenFormat API for leaderboard data
2. Privy API for user authentication and handle resolution

## Features in Detail

### User Handle Display

- Automatically detects and displays email addresses
- Shows Discord usernames when available
- Truncates wallet addresses for better readability
- Includes loading states to prevent display flicker

### Position Tracking
- Shows position changes over 12-hour periods
- Indicates new entries with a star icon
- Uses color-coding for position changes (green for up, red for down)

### Theme Support
- Supports both light and dark modes
- Smooth transitions between themes
- Accessible color contrasts in both modes
