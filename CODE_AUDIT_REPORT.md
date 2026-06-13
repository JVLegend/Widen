# Widen Code Audit Report

Date: 2026-06-13

## Executive Summary

This audit found one user-facing profile sync bug and several engineering risks worth prioritizing before deeper product growth. The profile-name sync issue, lint blockers, several API authorization gaps, password storage for new users, dependency exposure, and metadata URL hardening were improved during the follow-up pass. The application now passes lint, type-check, tests, and production build locally.

Highest-priority remaining work:

1. Replace mock `localStorage` auth before real users.
2. Monitor/update Next once the remaining bundled `postcss` advisory has a non-regressive fix path.
3. Expand tests around API permissions, profile settings, campaign lifecycle, and creator submission flows.
4. Move framework maintenance warnings (`middleware` -> `proxy`, Prisma config file) into a dedicated maintenance task.

## Changes Fixed During Audit

### Profile Name Sync

Problem: Changing the church name in settings could update the local menu/session but leave other parts of the app using stale profile data.

Fixes applied:

- `src/hooks/use-auth.tsx`: `AuthProvider` now refreshes the current user from `/api/users/:id` and reconciles `widen_session` with the saved database profile.
- `src/app/[locale]/(dashboard)/church/settings/page.tsx`: settings save now uses the API response as source of truth before updating session/UI.
- `src/app/[locale]/(dashboard)/creator/settings/page.tsx`: same consistency fix for creators.

Expected result: after saving a new church name, header/menu/dashboard consumers should converge on the database value instead of keeping stale local session data.

### Lint-Blocking Social Lookup Effect

Problem: `src/app/[locale]/(dashboard)/creator/social-accounts/page.tsx` called `setLookupStatus` synchronously inside `useEffect`, failing `react-hooks/set-state-in-effect`.

Fix: moved idle resets to input handlers and kept the effect focused on the delayed async lookup.

### Safer Login And API Responses

Problem: the login flow fetched user records and compared passwords in the browser, while user API responses could expose password fields.

Fixes applied:

- Added `src/app/api/auth/login/route.ts` so password comparison happens server-side.
- Updated `src/hooks/use-auth.tsx` to use the login endpoint.
- Updated users API responses to return explicit safe user fields and omit passwords.

Follow-up improvement:

- Added `src/lib/password.ts` with PBKDF2 hashing and verification.
- New signups now store hashed passwords.
- Existing plaintext seed/legacy passwords remain login-compatible and are migrated to hashed storage after a successful login.

Remaining limitation: this is still not a full auth system; sessions remain client-managed until a secure server-session provider is added.

### Ownership Checks For Mutations

Problem: several mutation routes trusted IDs from the request body/URL and did not enforce resource ownership.

Fixes applied:

- Added lightweight `x-user-id` current-user helpers in `src/lib/api.ts`.
- Added owner checks to user profile updates, campaigns, videos, clips, social accounts, and clip sync.
- Updated dashboard mutation calls to send the current user's ID.

Remaining limitation: this is still mock-auth compatible and should be replaced by secure server sessions before production users.

### Metadata Fetch Hardening

Problem: `/api/videos/metadata` accepted arbitrary URLs for Open Graph fetching.

Fixes applied:

- Restricted metadata fetching to supported public platforms: YouTube, Instagram, and TikTok.
- Added HTTP/HTTPS validation and request timeouts.

Remaining limitation: a production-grade implementation should also add DNS/private-IP checks, content-length limits, and broader test coverage.

### Dashboard Reach Metric

Problem: the church dashboard reach stat was hardcoded to `0`.

Fix: `src/app/[locale]/(dashboard)/church/page.tsx` now reads the influencer analytics endpoint and displays the real `totalViews` value.

### Lint Noise Cleanup

Fixes applied:

- Removed the unused FAQ auth variable.
- Marked intentionally external thumbnail/avatar `<img>` usage with local lint explanations.
- Cleaned intentionally unused seed variables.

### Dependency Upgrade Pass

Fixes applied:

- Ran `npm audit fix` and then a controlled `npm audit fix --force`.
- Upgraded Next from `16.2.2` to `16.2.9`.
- Upgraded `eslint-config-next` to `16.2.9`.
- Upgraded Vitest to `4.1.8`.

Result: vulnerability count dropped from 14 to 2 moderate advisories.

## Validation Results

Commands run:

- `npm run lint`: passed with no warnings
- `npx tsc --noEmit`: passed
- `npm test`: passed, 13 tests in 3 files
- `npm run build`: passed
- `npm audit --audit-level=moderate`: still reports 2 moderate advisories from Next's bundled `postcss`

## High Priority Findings

### 1. Mock Auth Is Not Safe For Real Users

Files:

- `src/hooks/use-auth.tsx`
- `src/lib/mock-auth.ts`
- `src/app/api/users/route.ts`
- `prisma/schema.prisma`

Risk:

- Session lives in `localStorage`, so any XSS can read/modify it.

Recommendation:

- Move to server-side auth with secure httpOnly cookies or a managed provider.
- Store auth in secure, httpOnly cookies or a vetted auth library.

Status:

- Improved: login comparison moved server-side, password fields are no longer returned in normal user/login responses, and new/legacy logins use hashed password storage.
- Still open: replace `localStorage` sessions with server-derived identity.

### 2. API Authorization Is Improved But Still Mock-Based

Files:

- `src/app/api/users/[id]/route.ts`
- `src/app/api/campaigns/[id]/route.ts`
- `src/app/api/videos/[id]/route.ts`
- `src/app/api/social-accounts/[id]/route.ts`
- `src/app/api/clips/[id]/route.ts`

Risk:

Core mutation routes now check an `x-user-id` owner boundary, but that header is still derived from mock client auth. A malicious client could forge it until real server-side sessions exist.

Recommendation:

- Replace `x-user-id` with secure session-derived identity.
- Add tests for "user A cannot mutate user B's data".

### 3. Remaining Dependency Advisory

Command:

- `npm audit --audit-level=moderate`

Reported:

- 2 moderate vulnerabilities
- Remaining package path: Next's bundled `postcss`

Recommendation:

- Do not apply the current npm suggestion because it proposes downgrading Next to `9.3.3`, which is regressive for this Next 16 App Router app.
- Monitor Next releases and update once the bundled advisory has a safe patch path.

### 4. SSRF-Like Metadata Fetch Risk

File:

- `src/app/api/videos/metadata/route.ts`

Risk:

The endpoint now allowlists supported hosts and uses timeouts, but Open Graph fetching still deserves stricter production controls for response size, redirects, and private network resolution.

Recommendation:

- Block private/local IP ranges after DNS resolution.
- Add max response size, redirect limits, and content-type checks.

## Medium Priority Findings

### 5. Duplicate Fetch Logic And Missed Loading States

Examples:

- `src/app/[locale]/(dashboard)/church/sermons/page.tsx`
- `src/app/[locale]/(dashboard)/church/missions/page.tsx`
- `src/app/[locale]/(dashboard)/creator/social-accounts/page.tsx`

Issue:

Several pages define a `fetchX` function and also duplicate the initial fetch in `useEffect`. Some paths ignore failed responses.

Recommendation:

- Keep one `loadX` callback per page.
- Use `try/catch/finally` and show lightweight error states.
- Consider a small `useApiList` helper after two or three more repetitions.

### 6. Excessive `any` In Campaign/Mission Pages

Files:

- `src/app/[locale]/(dashboard)/church/missions/[id]/page.tsx`
- `src/app/[locale]/(dashboard)/creator/missions/page.tsx`
- `src/app/[locale]/(dashboard)/creator/missions/[id]/page.tsx`

Issue:

Several campaign/mission pages previously used broad `any` values around nested campaign, video, and clip shapes. The highest-traffic mission list/detail pages now use shared response types, but a deeper API typing pass would still help.

Recommendation:

- Promote shared response types in `src/lib/types.ts`.
- Type API payloads and page state from those shared types.

### 7. Native `<img>` Usage Should Become `next/image`

Files include:

- `src/app/[locale]/(dashboard)/church/sermons/page.tsx`
- `src/app/[locale]/(dashboard)/creator/content/page.tsx`
- `src/components/landing/ranking-preview.tsx`

Issue:

The current external thumbnail/avatar usage is now explicitly marked as intentional so lint stays clean. For high-traffic pages, `next/image` with remote patterns would still improve optimization.

Recommendation:

- Configure `next/image` remote patterns for trusted hosts.
- Convert high-traffic visible images first: landing, ranking, mission cards.

## Low Priority / Cleanup

### 8. Prisma Config Deprecation

Current build warning:

- `package.json#prisma` config is deprecated and will be removed in Prisma 7.

Recommendation:

- Move Prisma seed/config to `prisma.config.ts` before upgrading Prisma.

### 9. Middleware Convention Deprecated

Current build warning:

- Next.js recommends migrating from `middleware` to `proxy`.

Recommendation:

- Plan a small framework maintenance task to migrate `src/middleware.ts` once the target Next version is chosen.

## Suggested Next Sprint

1. Security pass:
   - replace mock auth with real secure sessions
   - add API ownership regression tests

2. Dependency maintenance:
   - monitor Next/PostCSS advisory
   - keep Prisma config migration separate

3. Reliability:
   - add API tests for users/campaigns/videos/clips
   - add profile settings regression test
   - add campaign lifecycle tests: active -> paused -> active -> completed

4. Dashboard accuracy:
   - centralize analytics summaries

## Verification Snapshot

Latest local verification after fixes:

```text
npm run lint        passed
npx tsc --noEmit    passed
npm test            passed, 13 tests
npm run build       passed
npm audit           2 moderate advisories remain
```
