# gRust Panel 2.0

## Setup Instructions

1. Create a Steam API key at https://steamcommunity.com/dev/apikey
2. Copy `.env.example` to `.env` and fill in the required values:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   STEAM_SECRET=your_steam_secret_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- Steam authentication
- Dark/light theme toggle
- Responsive design
- Protected routes

## Technologies

- Next.js 14 (App Router)
- NextAuth.js with next-auth-steam
- shadcn/ui components
- Tailwind CSS