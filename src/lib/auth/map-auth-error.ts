import type { ZodError } from "zod";

type TranslateFn = (key: string) => string;

const ZOD_KEY_MAP: Record<string, string> = {
  email_required: "email_required",
  invalid_email: "invalid_email",
  password_required: "password_required",
  password_min_length: "password_min_length",
  password_uppercase: "password_uppercase",
  password_lowercase: "password_lowercase",
  password_number: "password_number",
  fullname_required: "signup.fullname_required",
  terms_required: "signup.terms_required",
  password_mismatch: "signup.password_mismatch",
};

const ZOD_PATH_MAP: Record<string, string> = {
  email: "email_required",
  password: "password_required",
  fullName: "signup.fullname_required",
  confirmPassword: "password_required",
};

/** Không hiển thị message kỹ thuật (Supabase, SMTP, URL…) cho người dùng. */
export function mapZodAuthError(error: ZodError, t: TranslateFn): string {
  const first = error.issues[0];

  if (!first) return t("login_system_error");

  const pathKey =
    typeof first.path[0] === "string" ? ZOD_PATH_MAP[first.path[0]] : undefined;

  if (pathKey) {
    return t(pathKey);
  }

  const key = ZOD_KEY_MAP[first.message] ?? first.message;

  try {
    return t(key);
  } catch {
    return t("login_system_error");
  }
}

export function mapSupabaseAuthError(message: string, t: TranslateFn): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return t("invalid_credentials");
  }

  if (lower.includes("email not confirmed")) {
    return t("email_not_confirmed");
  }

  if (lower.includes("user already registered")) {
    return t("signup.email_exists");
  }

  if (
    lower.includes("rate limit") ||
    lower.includes("over_email_send_rate") ||
    lower.includes("too many requests")
  ) {
    return t("rate_limit");
  }

  if (
    lower.includes("error sending") ||
    lower.includes("confirmation email") ||
    lower.includes("smtp") ||
    lower.includes("mail send") ||
    (lower.includes("redirect") && lower.includes("url"))
  ) {
    return t("email_send_failed");
  }

  if (lower.includes("password") && lower.includes("weak")) {
    return t("password_min_length");
  }

  if (lower.includes("signup") || lower.includes("sign up")) {
    return t("signup_failed");
  }

  if (
    lower.includes("provider") ||
    lower.includes("oauth") ||
    lower.includes("google")
  ) {
    return t("google_sign_in_failed");
  }

  return t("login_system_error");
}
