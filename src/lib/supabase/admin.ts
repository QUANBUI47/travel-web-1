import { createClient as createServerClient } from "@supabase/supabase-js";

/**
 * Tạo Supabase Admin Client dùng Service Role Key.
 * Client này có quyền bypass RLS và quản lý users.
 * CHỈ dùng trên server-side — KHÔNG BAO GIỜ expose ra client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
