# CLAUDE.md — Widen

## Project Overview
Widen is a ministry content platform connecting churches to young content creators. Churches share sermons and teachings; creators make short-form viral content to spread God's Word on social media. Creators earn impact points based on reach.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui v4 (Base UI, NOT Radix)
- **Database**: Prisma v6 + PostgreSQL (Supabase)
- **Auth**: Mock auth via localStorage (key: `widen_session`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **i18n**: Custom dictionary-based (EN default, PT-BR at /br)

## Key Architecture Decisions
- **shadcn v4 uses Base UI**: No `asChild` prop. Use `render` prop for composition.
- **i18n**: `[locale]` dynamic route segment with middleware. EN=default, BR=Portuguese.
- **Roles**: DB stores "influencer"/"clipper" but UI shows "Church"/"Creator".
- **Points model**: No real money. Impact points (✦) replace currency.
- **Route groups**: `(landing)` for public, `(auth)` for login/signup, `(dashboard)` for authenticated pages.
- **Next.js 16 params**: Route params are `Promise<{}>`, must be awaited in API routes.

## Common Commands
```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run db:push      # Push schema to DB
npm run db:seed      # Seed with test data
npm run db:studio    # Open Prisma Studio
npx prisma generate  # Regenerate Prisma client
```

## Project Structure
```
src/
  app/
    layout.tsx                    # Root layout (minimal)
    [locale]/
      layout.tsx                  # Locale layout (AuthProvider + LocaleProvider)
      (landing)/page.tsx          # Landing page
      (auth)/login, signup        # Auth pages
      (dashboard)/
        layout.tsx                # Dashboard shell (sidebar + header)
        church/{page, sermons, missions, missions/new, missions/[id], analytics, settings}
        creator/{page, missions, missions/[id], content, content/new, social-accounts, analytics, settings}
      ranking/page.tsx            # Public ranking
    api/{users, videos, campaigns, clips, social-accounts, analytics, rankings}
  components/
    ui/                           # shadcn/ui components
    landing/                      # Landing page sections
    dashboard/                    # Shared dashboard components
  lib/
    i18n/{en.ts, br.ts, index.ts} # Translation dictionaries
    prisma.ts, mock-auth.ts, utils.ts, constants.ts, types.ts
  hooks/{use-auth.tsx, use-locale.tsx}
  middleware.ts                   # Locale detection
prisma/{schema.prisma, seed.ts}
```

## Database Models
User, SocialAccount, Video, Campaign, CampaignVideo, Clip, Ranking
(DB field names unchanged from original for API compatibility)

## Seed Data
6 churches, 11 creators, social accounts, 18 sermons, 10 missions, 50+ content pieces, ranking entries.

## Test Accounts
- Church: `grace@example.com / 123456`
- Creator: `sarah.chen@example.com / 123456`

## Known Quirks
- CSS imports use relative paths (`../../node_modules/...`) due to Turbopack resolution.
- `use-auth` must be `.tsx` (contains JSX).
- `AuthContext.Provider` syntax required (not `<AuthContext value={...}>`).
- Signup page wraps content in `<Suspense>` due to `useSearchParams` SSG restriction.
