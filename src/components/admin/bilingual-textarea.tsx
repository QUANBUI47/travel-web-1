"use client";

import { Textarea } from "@heroui/input";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import {
  parseBilingualValue,
  type BilingualValue,
} from "@/lib/utils/bilingual";

interface BilingualTextareaProps {
  label: string;
  name: string;
  defaultValue?: BilingualValue;
  value?: BilingualValue;
  onValueChange?: (value: { vi: string; en: string }) => void;
  placeholder?: string;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isRequired?: boolean;
  minRows?: number;
}

export function BilingualTextarea({
  label,
  name,
  defaultValue,
  placeholder,
  variant = "bordered",
  isRequired = false,
  minRows = 3,
  value,
  onValueChange,
}: BilingualTextareaProps) {
  const t = useTranslations("Admin.Bilingual");
  const initial = parseBilingualValue(value ?? defaultValue);
  const [vi, setVi] = useState(initial.vi);
  const [en, setEn] = useState(initial.en);

  useEffect(() => {
    const next = parseBilingualValue(value ?? defaultValue);

    setVi(next.vi);
    setEn(next.en);
  }, [value, defaultValue]);

  const p = placeholder || "";

  const handleChange = (lang: "vi" | "en", val: string) => {
    const newVal =
      lang === "vi"
        ? { vi: val, en }
        : { vi: val !== undefined ? vi : "", en: val };

    if (lang === "vi") setVi(val);
    else setEn(val);
    if (onValueChange) onValueChange(newVal);
  };

  return (
    <div className="space-y-3 group/bilingual">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </div>

      <div className="space-y-3 bg-default-50/50 p-3 rounded-2xl border border-default-100 transition-all group-hover/bilingual:border-primary/20 group-hover/bilingual:bg-default-50">
        {/* Vietnamese Row */}
        <div className="relative group/vi">
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 pointer-events-none">
            <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-emerald-500/20">
              VI
            </span>
          </div>
          <Textarea
            classNames={{
              input: "pl-10 text-sm font-medium",
              inputWrapper:
                "shadow-sm border-default-200 group-hover/vi:border-emerald-500/50",
            }}
            isRequired={isRequired}
            minRows={minRows}
            name={`${name}_vi`}
            placeholder={p ? `${p} (VI)...` : t("placeholder_vi")}
            value={vi}
            variant={variant}
            onValueChange={(v) => handleChange("vi", v)}
          />
        </div>

        {/* English Row */}
        <div className="relative group/en">
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 pointer-events-none">
            <span className="bg-blue-500/10 text-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-blue-500/20">
              EN
            </span>
          </div>
          <Textarea
            classNames={{
              input: "pl-10 text-sm font-medium",
              inputWrapper:
                "shadow-sm border-default-200 group-hover/en:border-blue-500/50",
            }}
            isRequired={isRequired}
            minRows={minRows}
            name={`${name}_en`}
            placeholder={p ? `${p} (EN)...` : t("placeholder_en")}
            value={en}
            variant={variant}
            onValueChange={(v) => handleChange("en", v)}
          />
        </div>
      </div>
    </div>
  );
}
