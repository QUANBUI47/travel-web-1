"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { parseAuthFormData } from "@/lib/auth/form-data";
import {
  mapSupabaseAuthError,
  mapZodAuthError,
} from "@/lib/auth/map-auth-error";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/schemas/auth";
import {
  getAuthCallbackUrl,
  getSignupConfirmRedirectUrl,
  getSiteUrl,
} from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import { AuthService } from "@/services/auth.service";
import { ROUTES, AUTH_COOKIES } from "@/constants";

/**
 * --- ADMIN ACTIONS ---
 */

export async function loginAdmin(formData: FormData) {
  const t = await getTranslations("Auth");

  const rawData = Object.fromEntries(formData.entries());
  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: mapZodAuthError(validated.error, t) };
  }

  const { email, password } = validated.data;
  const supabase = await createClient(AUTH_COOKIES.ADMIN);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: t("invalid_credentials") };
  }

  const isAdmin = await AuthService.validateAdminRole(data.user.id);

  if (!isAdmin) {
    await supabase.auth.signOut();

    return { error: t("no_admin_access") };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();

    await adminClient.auth.admin.updateUserById(data.user.id, {
      app_metadata: { role: "ADMIN" },
    });
  } catch {
    // Middleware can still validate via DB
  }

  revalidatePath(ROUTES.ADMIN.HOME);
  redirect(ROUTES.ADMIN.HOME);
}

export async function logoutAdmin() {
  const supabase = await createClient(AUTH_COOKIES.ADMIN);

  await supabase.auth.signOut();
  revalidatePath(ROUTES.ADMIN.HOME, "layout");
  redirect(ROUTES.ADMIN.LOGIN);
}

/**
 * --- CUSTOMER ACTIONS ---
 */

export async function login(formData: FormData) {
  const t = await getTranslations("Auth");
  const rawData = parseAuthFormData(formData);
  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: mapZodAuthError(validated.error, t) };
  }

  const { email, password } = validated.data;
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: mapSupabaseAuthError(error?.message ?? "", t) };
  }

  await AuthService.ensureUserProfile(data.user);
  revalidatePath(ROUTES.HOME, "layout");

  const returnTo = formData.get("returnTo") as string | null;

  redirect(safeReturnPath(returnTo));
}

function safeReturnPath(path: string | null): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }

  return ROUTES.HOME;
}

export async function signup(formData: FormData) {
  const t = await getTranslations("Auth");
  const rawData = parseAuthFormData(formData);
  const validated = signupSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: mapZodAuthError(validated.error, t) };
  }

  const { email, password, fullName } = validated.data;
  const siteUrl = await getSiteUrl();
  const emailRedirectTo = getSignupConfirmRedirectUrl(siteUrl, ROUTES.LOGIN);
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo,
    },
  });

  if (error) {
    if (data.user && !data.session) {
      redirect(`${ROUTES.REGISTER_VERIFY}?email=${encodeURIComponent(email)}`);
    }

    return { error: mapSupabaseAuthError(error.message, t) };
  }

  if (data.user && !data.session) {
    redirect(`${ROUTES.REGISTER_VERIFY}?email=${encodeURIComponent(email)}`);
  }

  if (data.user) {
    try {
      await AuthService.ensureUserProfile(data.user);
    } catch {
      return { error: t("login_system_error") };
    }
  }

  revalidatePath(ROUTES.HOME, "layout");
  redirect(ROUTES.HOME);
}

export async function resendSignupConfirmation(email: string) {
  const t = await getTranslations("Auth");
  const siteUrl = await getSiteUrl();
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const parsed = forgotPasswordSchema.safeParse({ email });

  if (!parsed.success) {
    return { error: mapZodAuthError(parsed.error, t) };
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: getSignupConfirmRedirectUrl(siteUrl, ROUTES.LOGIN),
    },
  });

  if (error) {
    return { error: mapSupabaseAuthError(error.message, t) };
  }

  return { success: true as const };
}

export async function requestPasswordReset(formData: FormData) {
  const t = await getTranslations("Auth");
  const rawData = parseAuthFormData(formData);
  const validated = forgotPasswordSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: mapZodAuthError(validated.error, t) };
  }

  const siteUrl = await getSiteUrl();
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const { error } = await supabase.auth.resetPasswordForEmail(
    validated.data.email,
    {
      redirectTo: getAuthCallbackUrl(siteUrl, ROUTES.RESET_PASSWORD),
    },
  );

  if (error) {
    return { error: mapSupabaseAuthError(error.message, t) };
  }

  redirect(
    `${ROUTES.FORGOT_PASSWORD}?sent=1&email=${encodeURIComponent(validated.data.email)}`,
  );
}

export async function updatePassword(formData: FormData) {
  const t = await getTranslations("Auth");
  const rawData = parseAuthFormData(formData);
  const validated = resetPasswordSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: mapZodAuthError(validated.error, t) };
  }

  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: t("reset.session_expired") };
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  });

  if (error) {
    return { error: mapSupabaseAuthError(error.message, t) };
  }

  await AuthService.ensureUserProfile(user);
  revalidatePath(ROUTES.HOME, "layout");
  redirect(`${ROUTES.LOGIN}?reset=success`);
}

export async function signInWithGoogle(formData: FormData) {
  const t = await getTranslations("Auth");
  const siteUrl = await getSiteUrl();
  const returnTo = formData.get("returnTo");
  const next =
    typeof returnTo === "string" ? safeReturnPath(returnTo) : ROUTES.HOME;
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(siteUrl, next),
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    return { error: mapSupabaseAuthError(error.message, t) };
  }

  if (!data.url) {
    return { error: t("google_sign_in_failed") };
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  await supabase.auth.signOut();
  revalidatePath(ROUTES.HOME, "layout");
  redirect(ROUTES.HOME);
}
