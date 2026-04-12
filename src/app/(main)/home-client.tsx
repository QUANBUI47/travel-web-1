"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

import { HomeModuleSection } from "@/lib/builder/module-sections";
import { HomeSetting, Destination, Tour } from "@/types";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { migrateToModules } from "@/lib/builder/migrate";

interface HomeClientProps {
  initialData: HomeSetting;
  allDestinations: Destination[];
  featuredTours: Tour[];
}

export function HomeClient({
  initialData,
  allDestinations,
  featuredTours,
}: HomeClientProps) {
  const locale = useLocale();
  const modules = useMemo(() => migrateToModules(initialData), [initialData]);

  return (
    <div className="flex flex-col pb-12 md:pb-16">
      {modules
        .filter((m) => m.isVisible)
        .map((module, index) => (
          <SectionWrapper
            key={module.id || index}
            animationVariant={module.type === "HERO" ? "fade" : "slide-up"}
          >
            <HomeModuleSection
              allDestinations={allDestinations}
              featuredTours={featuredTours}
              locale={locale}
              module={module}
            />
          </SectionWrapper>
        ))}
    </div>
  );
}
