"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from "lucide-react";

import { AppImage } from "@/components/ui/app-image";
import { cn } from "@/lib/utils";

interface DestinationGalleryProps {
  title: string;
  images: string[];
  destinationName: string;
  viewPhotoLabel?: string;
}

export function DestinationGallery({
  title,
  images,
  destinationName,
  viewPhotoLabel = "View photo",
}: DestinationGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  if (images.length === 0) return null;

  const featured = images[0];
  const rest = images.slice(1, 5);
  const extraCount = Math.max(0, images.length - 5);

  const lightbox =
    mounted && lightboxIndex !== null ? (
      <div
        aria-modal
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/95 backdrop-blur-sm"
        role="dialog"
      >
        <div className="relative z-[210] flex shrink-0 items-center justify-between px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] lg:px-8 lg:pt-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
            {lightboxIndex + 1} / {images.length}
          </p>
          <button
            aria-label="Close"
            className="rounded-full bg-white/15 p-3 text-white ring-1 ring-white/20 transition-colors hover:bg-white/25"
            type="button"
            onClick={closeLightbox}
          >
            <X size={22} />
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-4 pb-8 pt-2">
          {images.length > 1 && (
            <>
              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 z-[210] -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 md:left-8"
                type="button"
                onClick={goPrev}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 z-[210] -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 md:right-8"
                type="button"
                onClick={goNext}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="relative h-full w-full max-w-5xl min-h-[200px]">
            <AppImage
              fill
              priority
              alt={`${destinationName} — ${lightboxIndex + 1}`}
              className="object-contain"
              sizes="100vw"
              src={images[lightboxIndex]}
            />
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <section aria-label={title} className="space-y-4">
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {title}
            </p>
            <p className="mt-1 font-heading text-lg font-bold text-slate-800 dark:text-white">
              {destinationName}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/10 dark:text-slate-400">
            <Images size={12} />
            {images.length}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-2 md:gap-3">
          <button
            className="group relative col-span-12 md:col-span-7 min-h-[220px] md:min-h-[320px] overflow-hidden rounded-2xl md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl shadow-slate-900/10 cursor-pointer text-left"
            type="button"
            onClick={() => setLightboxIndex(0)}
          >
            <AppImage
              fill
              alt={`${destinationName} — 1`}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 55vw"
              src={featured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={12} />
              {viewPhotoLabel}
            </span>
          </button>

          <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-2 md:gap-3 min-h-[160px] md:min-h-0">
            {rest.map((url, idx) => {
              const index = idx + 1;
              const isLast = idx === rest.length - 1 && extraCount > 0;

              return (
                <button
                  key={url}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-md cursor-pointer text-left aspect-[4/3] md:aspect-auto md:min-h-0",
                    idx === 0 && rest.length === 1 && "col-span-2",
                  )}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                >
                  <AppImage
                    fill
                    alt={`${destinationName} — ${index + 1}`}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="25vw"
                    src={url}
                  />
                  {isLast ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-[2px]">
                      <span className="text-xl font-black text-white">
                        +{extraCount}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-slate-950/0 transition-colors group-hover:bg-slate-950/20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {images.length > 5 && (
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory md:hidden">
            {images.slice(5).map((url, idx) => (
              <button
                key={url}
                className="relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-700"
                type="button"
                onClick={() => setLightboxIndex(idx + 5)}
              >
                <AppImage
                  fill
                  alt={`${destinationName} — ${idx + 6}`}
                  className="object-cover"
                  sizes="112px"
                  src={url}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {lightbox && createPortal(lightbox, document.body)}
    </>
  );
}
