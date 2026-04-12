import type { LucideIcon } from "lucide-react";

import * as LucideIcons from "lucide-react";

export function getLucideIcon(iconName?: string): LucideIcon {
  if (!iconName) return LucideIcons.Circle;
  const icon = LucideIcons[iconName as keyof typeof LucideIcons];

  return typeof icon === "function" ? (icon as LucideIcon) : LucideIcons.Circle;
}
