## Setup Instructions

1. Create a Steam API key at https://steamcommunity.com/dev/apikey
2. `.env` configuration:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   STEAM_SECRET=your_steam_secret_here
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```