"use client";

import { Button } from "@heroui/button";
import { Mail } from "lucide-react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { useTranslations } from "next-intl";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { resendSignupConfirmation } from "@/app/(auth)/actions";
import { ROUTES } from "@/constants";

function VerifyEmailContent() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleResend() {
    if (!email) return;

    startTransition(async () => {
      setMessage(null);
      setErrorMsg(null);
      const result = await resendSignupConfirmation(email);

      if (result?.error) {
        setErrorMsg(result.error);
      } else if (result?.success) {
        setMessage(t("verify.resend_success"));
      }
    });
  }

  return (
    <AuthFormShell
      description={t("verify.desc", { email })}
      footer={
        <p className="mt-6 text-center text-sm text-slate-500">
          <NextLink
            className="text-primary font-bold hover:underline"
            href={ROUTES.LOGIN}
          >
            {t("verify.back_login")}
          </NextLink>
        </p>
      }
      title={t("verify.title")}
      trustBadge={t("login.trust_badge")}
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="text-primary w-8 h-8" />
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-6">
        {t("verify.check_inbox")}
      </p>

      {message && (
        <div className="border-l-4 border-emerald-500 px-4 py-3 text-emerald-700 text-sm font-bold mb-4 rounded-r bg-emerald-50">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold mb-4 rounded-r bg-red-50">
          {errorMsg}
        </div>
      )}

      <Button
        className="w-full h-12 font-bold"
        color="primary"
        isDisabled={!email || isPending}
        isLoading={isPending}
        radius="lg"
        variant="bordered"
        onPress={handleResend}
      >
        {t("verify.resend")}
      </Button>

      <p className="mt-4 text-xs text-slate-400 text-center">
        {t("verify.check_spam")}
      </p>
    </AuthFormShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
