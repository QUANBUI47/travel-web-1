import { createBrowserClient } from "@supabase/ssr";

import { ROUTES, AUTH_COOKIES } from "@/constants";

export function createClient() {
  // Tự động nhận diện site dựa trên đường dẫn
  const isAdminPath =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith(ROUTES.ADMIN.HOME);
  const cookieName = isAdminPath ? AUTH_COOKIES.ADMIN : AUTH_COOKIES.PUBLIC;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: cookieName,
      },
    },
  );
}
