import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import * as LucideIcons from "lucide-react";
import { Button } from "@heroui/button";

import { ROUTES } from "@/constants";
import { TourService } from "@/services/tour.service";
import { TourItinerariesEditor } from "@/components/admin/tours/tour-itineraries-editor";
import { TourBasicEditor } from "@/components/admin/tours/tour-basic-editor";
import { TourDeparturesEditor } from "@/components/admin/tours/tour-departures-editor";
import { TourOptionsEditor } from "@/components/admin/tours/tour-options-editor";

export default async function AdminTourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    const t = await getTranslations("Admin.ToursDetail");

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={ROUTES.ADMIN.TOURS}>
              <Button isIconOnly radius="full" size="sm" variant="flat">
                <LucideIcons.ChevronLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-default-900">
              {t("add_title")}
            </h1>
          </div>
        </div>
        <p className="text-default-500">{t("add_hint")}</p>
      </div>
    );
  }

  const tour = await TourService.getByIdWithItineraries(id);

  if (!tour) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.ADMIN.TOURS}>
            <Button isIconOnly radius="full" size="sm" variant="flat">
              <LucideIcons.ChevronLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-default-900">
            {tour.nameVi}
          </h1>
        </div>
      </div>

      <TourBasicEditor tour={tour} />

      <TourItinerariesEditor
        initialItineraries={(tour.itineraries || []).map((it) => ({
          id: it.id,
          dayNumber: it.dayNumber,
          title: it.title,
          description: it.description,
          hotelId: it.hotelId,
        }))}
        tour={{
          id: tour.id,
          durationDays: tour.durationDays,
          nameVi: tour.nameVi,
        }}
      />

      <TourOptionsEditor tour={tour} />

      <TourDeparturesEditor tour={tour} />
    </div>
  );
}
