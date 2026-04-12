"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Mail, ChevronRight } from "lucide-react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { useTranslations } from "next-intl";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { requestPasswordReset } from "@/app/(auth)/actions";
import { ROUTES } from "@/constants";

function ForgotPasswordForm() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const sent = searchParams.get("sent") === "1";
  const emailParam = searchParams.get("email") ?? "";
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (sent) {
    return (
      <AuthFormShell
        description={t("forgot.sent_desc", { email: emailParam })}
        footer={
          <p className="mt-6 text-center text-sm text-slate-500">
            <NextLink
              className="text-primary font-bold hover:underline"
              href={ROUTES.LOGIN}
            >
              {t("forgot.back_login")}
            </NextLink>
          </p>
        }
        title={t("forgot.sent_title")}
        trustBadge={t("login.trust_badge")}
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
          {t("forgot.check_spam")}
        </p>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      description={t("forgot.desc")}
      footer={
        <p className="mt-6 text-center text-sm text-slate-500">
          {t("forgot.remember")}{" "}
          <NextLink
            className="text-primary font-bold hover:underline"
            href={ROUTES.LOGIN}
          >
            {t("forgot.back_login")}
          </NextLink>
        </p>
      }
      title={t("forgot.title")}
      trustBadge={t("login.trust_badge")}
    >
      {errorMsg && (
        <div className="border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold mb-5 rounded-r bg-red-50 dark:bg-danger-900/20">
          {errorMsg}
        </div>
      )}

      <form
        action={(fd) => {
          startTransition(async () => {
            const result = await requestPasswordReset(fd);

            if (result?.error) setErrorMsg(result.error);
          });
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("login.email_label")}
          </label>
          <Input
            isRequired
            classNames={{
              inputWrapper:
                "h-12 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 focus-within:!border-primary",
            }}
            defaultValue={emailParam}
            name="email"
            placeholder="example@vivu.com.vn"
            startContent={<Mail className="text-slate-400 mr-2" size={16} />}
            type="email"
            variant="bordered"
          />
        </div>

        <Button
          className="w-full h-12 font-bold shadow-xl shadow-primary/20 bg-[#0a66c2]"
          color="primary"
          endContent={!isPending && <ChevronRight size={16} />}
          isLoading={isPending}
          radius="lg"
          type="submit"
        >
          {t("forgot.button")}
        </Button>
      </form>
    </AuthFormShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
