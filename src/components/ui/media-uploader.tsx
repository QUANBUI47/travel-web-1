"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Film, ImageIcon } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

import { uploadFileFromClient } from "@/lib/cloudinary/client-upload";
import { isCloudinaryUnsignedConfigured } from "@/lib/cloudinary/config";

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  accept?: "image/*" | "video/*" | "image/*,video/*";
  label?: string;
  maxSizeMB?: number;
}

export function MediaUploader({
  value,
  onChange,
  accept = "image/*",
  label,
  maxSizeMB = 10,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("MediaUploader");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      addToast({
        title: t("file_too_large_title"),
        description: t("file_too_large_desc", { maxSizeMB }),
        color: "warning",
      });

      return;
    }

    if (!isCloudinaryUnsignedConfigured()) {
      addToast({
        title: t("upload_failed_title"),
        description: t("upload_failed_desc"),
        color: "danger",
      });

      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadFileFromClient(file);

      if (result.success) {
        onChange(result.url);
        addToast({ title: t("upload_success"), color: "success" });
      } else {
        addToast({
          title: t("upload_failed_title"),
          description: result.message ?? t("upload_failed_desc"),
          color: "danger",
        });
      }
    } catch {
      addToast({
        title: t("upload_failed_title"),
        description: t("upload_failed_desc"),
        color: "danger",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isVideo =
    value.match(/\.(mp4|webm|ogg|mov)$/i) || value.includes("/video/upload/");

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!value ? (
        <label
          className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-[2rem] transition-all group ${
            isUploading
              ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
              : "border-slate-200 bg-white hover:bg-primary/[0.02] hover:border-primary/50 cursor-pointer"
          }`}
          htmlFor="media-file-upload"
        >
          <input
            ref={fileInputRef}
            accept={accept}
            className="hidden"
            disabled={isUploading}
            id="media-file-upload"
            type="file"
            onChange={handleFileChange}
          />

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
              isUploading
                ? "bg-slate-100 text-slate-400"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : accept.includes("video") ? (
              <Film className="w-6 h-6" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="text-center">
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-800">
              {isUploading ? t("processing") : (label ?? t("click_upload"))}
            </p>
          </div>
        </label>
      ) : (
        <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl bg-black aspect-video group">
          {isVideo ? (
            <video
              controls
              muted
              playsInline
              className="w-full h-full object-cover"
              src={value}
            >
              <track kind="captions" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Preview"
              className="w-full h-full object-cover"
              src={value}
            />
          )}

          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-danger transition-all border border-white/20"
              type="button"
              onClick={() => onChange("")}
            >
              <X size={16} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            {isVideo ? (
              <Film className="text-white" size={12} />
            ) : (
              <ImageIcon className="text-white" size={12} />
            )}
            <span className="text-[9px] font-black uppercase text-white tracking-widest">
              {isVideo ? "Video Content" : "Image Content"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
