import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { AUTH_COOKIES } from "@/constants";

export async function createClient(cookieName: string = AUTH_COOKIES.PUBLIC) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: cookieName,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll được gọi từ Server Component
          }
        },
      },
    },
  );
}
