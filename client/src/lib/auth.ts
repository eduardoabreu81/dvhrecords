/**
 * Auth helpers para Manus OAuth
 */

export function getLoginUrl(): string {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const currentUrl = window.location.href;
  return `${oauthPortalUrl}?redirect_uri=${encodeURIComponent(currentUrl)}`;
}
