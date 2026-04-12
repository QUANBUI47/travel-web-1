"use client";

import React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type Placement = "top" | "bottom";

export type PanelPosition = {
  placement: Placement;
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
};

type HeroSearchDropdownProps = {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  minWidth?: number;
  align?: "anchor" | "search-bar";
  searchBarRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  children: React.ReactNode;
};

function computePosition(
  anchor: HTMLElement,
  panelHeight: number,
  minWidth: number,
  align: "anchor" | "search-bar",
  searchBar?: HTMLElement | null,
): PanelPosition {
  const anchorRect = anchor.getBoundingClientRect();
  const barRect = searchBar?.getBoundingClientRect();
  const gap = 8;
  const viewportPad = 12;

  const spaceBelow = window.innerHeight - anchorRect.bottom - gap - viewportPad;
  const spaceAbove = anchorRect.top - gap - viewportPad;
  const openUp = spaceBelow < panelHeight && spaceAbove > spaceBelow;
  const maxHeight = Math.min(
    360,
    Math.max(160, openUp ? spaceAbove : spaceBelow),
  );

  const width = Math.max(
    minWidth,
    align === "search-bar" && barRect ? barRect.width : anchorRect.width,
  );
  const left =
    align === "search-bar" && barRect
      ? barRect.left
      : Math.min(anchorRect.left, window.innerWidth - width - viewportPad);

  if (openUp) {
    return {
      placement: "top",
      bottom: window.innerHeight - anchorRect.top + gap,
      left,
      width,
      maxHeight,
    };
  }

  return {
    placement: "bottom",
    top: anchorRect.bottom + gap,
    left,
    width,
    maxHeight,
  };
}

export function HeroSearchDropdown({
  anchorRef,
  open,
  onClose,
  panelRef,
  minWidth = 280,
  align = "anchor",
  searchBarRef,
  className,
  children,
}: HeroSearchDropdownProps) {
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<PanelPosition | null>(null);

  const setPanelRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      measureRef.current = el;
      if (panelRef) {
        (panelRef as React.MutableRefObject<HTMLDivElement | null>).current =
          el;
      }
    },
    [panelRef],
  );

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current;
    const panel = measureRef.current;

    if (!anchor || !panel) return;

    const height = panel.getBoundingClientRect().height || 280;

    setPosition(
      computePosition(anchor, height, minWidth, align, searchBarRef?.current),
    );
  }, [anchorRef, minWidth, align, searchBarRef]);

  React.useLayoutEffect(() => {
    if (!open) {
      setPosition(null);

      return;
    }

    updatePosition();

    const panel = measureRef.current;

    if (!panel) return;

    const ro = new ResizeObserver(updatePosition);

    ro.observe(panel);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      if (
        anchorRef.current?.contains(target) ||
        measureRef.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, anchorRef, onClose]);

  if (!open || typeof document === "undefined") return null;

  const panelStyle: React.CSSProperties = position
    ? {
        position: "fixed",
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
        zIndex: 9999,
        ...(position.placement === "bottom"
          ? { top: position.top }
          : { bottom: position.bottom }),
      }
    : { position: "fixed", visibility: "hidden", pointerEvents: "none" };

  return createPortal(
    <div
      ref={setPanelRef}
      className={cn(
        "rounded-[1.25rem] border border-slate-200/90 dark:border-slate-600/80",
        "bg-white/98 dark:bg-slate-900/98 backdrop-blur-md",
        "shadow-[0_16px_48px_-12px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 dark:ring-white/10",
        "overflow-hidden flex flex-col",
        "animate-in fade-in duration-200 ease-out",
        position?.placement === "bottom" && "slide-in-from-top-1",
        position?.placement === "top" && "slide-in-from-bottom-1",
        !position && "opacity-0",
        "[&_button]:cursor-pointer [&_label]:cursor-pointer",
        className,
      )}
      role="dialog"
      style={panelStyle}
    >
      {children}
    </div>,
    document.body,
  );
}
