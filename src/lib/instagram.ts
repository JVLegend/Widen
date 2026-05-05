/**
 * Instagram Login API for Business — OAuth helpers.
 *
 * Required env vars:
 *   INSTAGRAM_APP_ID
 *   INSTAGRAM_APP_SECRET
 *   INSTAGRAM_REDIRECT_URI  (must match the redirect URI configured in Meta dashboard)
 *
 * Scopes: instagram_business_basic (username + followers_count).
 *
 * Setup steps (Meta dashboard):
 *   1. developers.facebook.com → Create App → "Business" → product: Instagram.
 *   2. Configure "Instagram API with Instagram Login".
 *   3. Add the redirect URI (e.g. https://<railway-domain>/api/auth/instagram/callback).
 *   4. App must be in Live mode and the IG account must be a Business/Creator account.
 */

const AUTHORIZE_URL = "https://www.instagram.com/oauth/authorize";
const TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const LONG_LIVED_URL = "https://graph.instagram.com/access_token";
const GRAPH_BASE = "https://graph.instagram.com";

export interface IGTokens {
  shortLivedToken: string;
  longLivedToken: string;
  expiresIn: number;
  igUserId: string;
}

export interface IGProfile {
  username: string;
  followers: number;
  igUserId: string;
}

export function buildAuthorizeUrl(state: string): string {
  const id = process.env.INSTAGRAM_APP_ID;
  const redirect = process.env.INSTAGRAM_REDIRECT_URI;
  if (!id || !redirect) throw new Error("INSTAGRAM_APP_ID or INSTAGRAM_REDIRECT_URI not set");

  const params = new URLSearchParams({
    client_id: id,
    redirect_uri: redirect,
    response_type: "code",
    scope: "instagram_business_basic",
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCode(code: string): Promise<IGTokens> {
  const id = process.env.INSTAGRAM_APP_ID;
  const secret = process.env.INSTAGRAM_APP_SECRET;
  const redirect = process.env.INSTAGRAM_REDIRECT_URI;
  if (!id || !secret || !redirect) throw new Error("Instagram OAuth env vars missing");

  const body = new URLSearchParams({
    client_id: id,
    client_secret: secret,
    grant_type: "authorization_code",
    redirect_uri: redirect,
    code,
  });

  const shortRes = await fetch(TOKEN_URL, { method: "POST", body });
  if (!shortRes.ok) throw new Error(`IG short-token exchange failed: ${await shortRes.text()}`);
  const short = await shortRes.json();
  const shortLivedToken: string = short.access_token;
  const igUserId: string = String(short.user_id);

  const longParams = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: secret,
    access_token: shortLivedToken,
  });
  const longRes = await fetch(`${LONG_LIVED_URL}?${longParams.toString()}`);
  if (!longRes.ok) throw new Error(`IG long-token exchange failed: ${await longRes.text()}`);
  const long = await longRes.json();

  return {
    shortLivedToken,
    longLivedToken: long.access_token,
    expiresIn: long.expires_in,
    igUserId,
  };
}

export async function fetchProfile(accessToken: string): Promise<IGProfile> {
  const url = `${GRAPH_BASE}/v23.0/me?fields=user_id,username,followers_count&access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`IG profile fetch failed: ${await res.text()}`);
  const json = await res.json();
  return {
    username: json.username,
    followers: typeof json.followers_count === "number" ? json.followers_count : 0,
    igUserId: String(json.user_id),
  };
}
