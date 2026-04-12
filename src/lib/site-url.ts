import { headers } from "next/headers";

/**
 * Canonical site origin for auth redirects and email links.
 * Prefer NEXT_PUBLIC_SITE_URL; fall back to request host in dev.
 */
export async function getSiteUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (envUrl) return envUrl;

  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export function getAuthCallbackUrl(siteUrl: string, next = "/"): string {
  const nextParam = encodeURIComponent(next);

  return `${siteUrl}/auth/callback?next=${nextParam}`;
}

/** Sau khi bấm link xác nhận email → callback → trang đăng nhập. */
export function getSignupConfirmRedirectUrl(
  siteUrl: string,
  loginPath: string,
) {
  return getAuthCallbackUrl(siteUrl, `${loginPath}?verified=1`);
}
