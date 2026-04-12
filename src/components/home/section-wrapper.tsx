"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  type Transition,
  type Variants,
} from "framer-motion";

type AnimationVariant = "fade" | "slide-up" | "zoom";

interface SectionWrapperProps {
  children: React.ReactNode;
  animationVariant?: AnimationVariant;
  id?: string;
  className?: string;
}

const VARIANTS: Record<AnimationVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

const TRANSITIONS: Record<AnimationVariant, Transition> = {
  fade: { duration: 0.6, ease: "easeOut" },
  "slide-up": { duration: 0.7, ease: "easeOut" },
  zoom: { duration: 0.5, ease: "easeOut" },
};

export function SectionWrapper({
  children,
  animationVariant = "slide-up",
  id,
  className,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
      className={className}
      id={id}
      initial="hidden"
      transition={TRANSITIONS[animationVariant]}
      variants={VARIANTS[animationVariant]}
    >
      {children}
    </motion.div>
  );
}
