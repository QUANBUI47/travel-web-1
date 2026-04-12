"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import NextLink from "next/link";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { updatePassword } from "@/app/(auth)/actions";
import { ROUTES } from "@/constants";

export default function ResetPasswordPage() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <AuthFormShell
      description={t("reset.desc")}
      title={t("reset.title")}
      trustBadge={t("login.trust_badge")}
    >
      {errorMsg && (
        <div className="border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold mb-5 rounded-r bg-red-50 dark:bg-danger-900/20">
          {errorMsg}
        </div>
      )}

      <p className="text-xs text-slate-500 mb-4">{t("reset.password_hint")}</p>

      <form
        action={(fd) => {
          startTransition(async () => {
            const result = await updatePassword(fd);

            if (result?.error) setErrorMsg(result.error);
          });
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("reset.new_password")}
          </label>
          <Input
            isRequired
            classNames={{
              inputWrapper:
                "h-12 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 focus-within:!border-primary",
            }}
            endContent={
              <button
                className="text-slate-400"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            name="password"
            startContent={<Lock className="text-slate-400 mr-2" size={16} />}
            type={showPassword ? "text" : "password"}
            variant="bordered"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("signup.confirm_password_label")}
          </label>
          <Input
            isRequired
            classNames={{
              inputWrapper:
                "h-12 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 focus-within:!border-primary",
            }}
            endContent={
              <button
                className="text-slate-400"
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            name="confirmPassword"
            startContent={<Lock className="text-slate-400 mr-2" size={16} />}
            type={showConfirm ? "text" : "password"}
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
          {t("reset.button")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <NextLink
          className="text-primary font-bold hover:underline"
          href={ROUTES.LOGIN}
        >
          {t("forgot.back_login")}
        </NextLink>
      </p>
    </AuthFormShell>
  );
}
