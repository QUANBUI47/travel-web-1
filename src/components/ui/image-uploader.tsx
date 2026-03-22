"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ value = [], onChange, maxFiles = 5 }: ImageUploaderProps) {
  const t = useTranslations("ImageUploader");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      addToast({ title: t("error_max_files", { maxFiles }), color: "danger" });
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      addToast({ title: t("error_config"), description: t("error_config_desc"), color: "danger" });
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
        const compressedFile = new File([compressedBlob], originalFile.name.replace(/\.[^/.]+$/, "") + ".webp", {
          type: "image/webp",
        });

        // 2. Chuẩn bị FormData bắn thẳng lên Cloudinary
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("upload_preset", uploadPreset);

        // 3. Post HTTP request
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          formData
        );

        if (res.data && res.data.secure_url) {
          newUrls.push(res.data.secure_url);
        }
      }

      // 4. Báo thay đổi ra ngoài
      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      addToast({ title: t("error_upload"), description: t("error_upload_desc"), color: "danger" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <label 
        htmlFor="image-file-upload"
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all ${
          isUploading 
            ? "border-default-300 bg-default-100 cursor-not-allowed opacity-60" 
            : "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary cursor-pointer active:scale-[0.98]"
        }`}
      >
        <input 
          id="image-file-upload"
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="w-10 h-10 mb-3 animate-spin mx-auto" />
            <p className="font-semibold text-sm">{t("uploading")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-primary/80">
            <UploadCloud className="w-12 h-12 mb-3 mx-auto" />
            <p className="font-semibold text-base mb-1">{t("click_to_upload", { maxFiles })}</p>
            <p className="text-xs text-default-500">{t("seo_note")}</p>
          </div>
        )}
      </label>

      {/* Gallery Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {value.map((url, idx) => (
            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-default-200 group bg-default-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="p-2 bg-danger text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  aria-label={t("delete_image")}
                >
                  <X size={16} className="font-bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
