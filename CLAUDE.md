# Harel Playground

A game portal built with Next.js. Pages are not publicly listed — each published page gets a unique UUID link. Users manage their pages via Google SSO.

## Repo Structure

```
harel-playground/
  package.json             <-- Node project config
  next.config.ts           <-- Next.js config
  tsconfig.json            <-- TypeScript config
  .env.example             <-- required environment variables
  data/
    pages.json             <-- published pages database (UUID/email mappings)
  src/
    app/
      layout.tsx           <-- root layout (wraps SessionProvider)
      page.tsx             <-- homepage (landing page with publish/login)
      globals.css          <-- global styles
      login/
        page.tsx           <-- Google SSO sign-in page
      publish/
        page.tsx           <-- publish a game as a UUID page (asks for email)
      dashboard/
        page.tsx           <-- user's pages list (requires Google login)
      p/[uuid]/
        page.tsx           <-- UUID-based page viewer
      games/[slug]/
        page.tsx           <-- legacy game page route
      api/
        auth/[...nextauth]/
          route.ts         <-- NextAuth Google SSO handler
        pages/
          route.ts         <-- API for creating/listing/deleting pages
    components/
      Navbar.tsx           <-- nav bar with Publish/SignIn/Dashboard links
      GameFrame.tsx        <-- iframe wrapper for games
      SessionProvider.tsx  <-- NextAuth session context wrapper
    lib/
      games.ts             <-- game registry (add new games here)
      auth.ts              <-- NextAuth configuration
      pages-db.ts          <-- JSON file-based pages database
  public/
    games/
      space-shooter/       <-- space shooting game (HTML/CSS/JS)
      balloon-popper/      <-- balloon popping game (HTML/CSS/JS)
```

## Rules for Working in This Repo

1. **When adding a new game:**
   - Put game files in `public/games/<game-name>/` with an `index.html`
   - Add an entry to the `games` array in `src/lib/games.ts`
2. **Keep games as plain HTML/CSS/JS** — they run in iframes, no build step needed for game code.
3. **Don't modify game HTML files** to add framework dependencies — games must work standalone.
4. **Pages are private by default** — games are only accessible via UUID links created through the publish flow.
5. **Email binding** — when publishing a page, an email is required. The user can later sign in with Google SSO to manage pages bound to their email.

## Key Flows

### Publishing a Page
1. User goes to `/publish`
2. Selects a game, names the page, enters their email
3. System generates a UUID and creates the page entry in `data/pages.json`
4. User receives a unique link: `/p/<uuid>`

### Viewing a Page
- Pages are accessed via `/p/<uuid>` — only people with the link can view them
- No public listing of pages exists

### Managing Pages (Dashboard)
1. User goes to `/dashboard`
2. Signs in with Google SSO
3. Sees all pages bound to their Google email
4. Can copy links, open pages, or delete them

## Development

```bash
cp .env.example .env.local   # fill in Google OAuth credentials
npm install
npm run dev
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID credentials
3. Set authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

## Deployment

This app requires a Node.js server (not static export). Deploy to Vercel, Railway, or any Node.js hosting platform.
