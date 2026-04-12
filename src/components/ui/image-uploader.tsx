"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

import { uploadFileFromClient } from "@/lib/cloudinary/client-upload";
import { isCloudinaryUnsignedConfigured } from "@/lib/cloudinary/config";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 5,
}: ImageUploaderProps) {
  const t = useTranslations("ImageUploader");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      addToast({ title: t("error_max_files", { maxFiles }), color: "danger" });

      return;
    }

    // Check file sizes
    const maxOriginalSizeMB = 5;

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxOriginalSizeMB * 1024 * 1024) {
        addToast({
          title: t("error_file_too_large_title"),
          description: t("error_file_too_large_desc", {
            maxSizeMB: maxOriginalSizeMB,
          }),
          color: "warning",
        });

        return;
      }
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    if (!isCloudinaryUnsignedConfigured()) {
      addToast({
        title: t("error_config"),
        description: t("error_config_desc"),
        color: "danger",
      });
      setIsUploading(false);

      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const originalFile = files[i];

        // 1. Nén thành WebP tại trình duyệt
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp" as const,
        };
        const compressedBlob = await imageCompression(originalFile, options);
        // Convert Blob to File
        const compressedFile = new File(
          [compressedBlob],
          originalFile.name.replace(/\.[^/.]+$/, "") + ".webp",
          {
            type: "image/webp",
          },
        );

        const result = await uploadFileFromClient(compressedFile);

        if (result.success) {
          newUrls.push(result.url);
        } else {
          addToast({
            title: t("error_upload"),
            description: result.message ?? t("error_upload_desc"),
            color: "danger",
          });

          return;
        }
      }

      // 4. Báo thay đổi ra ngoài
      onChange([...value, ...newUrls]);
    } catch {
      addToast({
        title: t("error_upload"),
        description: t("error_upload_desc"),
        color: "danger",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <label
        className={`relative flex flex-row items-center justify-center gap-6 p-6 border-2 border-dashed rounded-[2rem] transition-all group ${
          isUploading
            ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
            : "border-slate-200 bg-white hover:bg-primary/[0.02] hover:border-primary/50 cursor-pointer active:scale-[0.99]"
        }`}
        htmlFor="image-file-upload"
      >
        <input
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          id="image-file-upload"
          type="file"
          onChange={handleFileChange}
        />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
            isUploading
              ? "bg-slate-100 text-slate-400"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
        </div>

        <div className="flex-1 text-left">
          <p className="font-black text-xs uppercase tracking-widest text-slate-800 mb-1">
            {isUploading ? t("uploading") : t("click_to_upload", { maxFiles })}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {t("seo_note")}
          </p>
        </div>
      </label>

      {/* Gallery Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Uploaded ${idx}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={url}
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  aria-label={t("delete_image")}
                  className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-danger hover:scale-110 transition-all shadow-xl border border-white/20"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                >
                  <X className="stroke-[3]" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
