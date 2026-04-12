"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { User } from "@heroui/user";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  Plane,
  Bus,
} from "lucide-react";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Tour, TourInput } from "@/types";
import { ROUTES } from "@/constants";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  createTourAction,
  updateTourAction,
  deleteTourAction,
} from "@/actions/tour.actions";
import { DeleteConfirmModal } from "@/components/admin/delete-confirm-modal";
import { useAdminToursList, useDestinationsPicklist } from "@/hooks/queries";
import { invalidateTours } from "@/lib/query/invalidate";
import { slugify } from "@/lib/utils/slugify";

const DEFAULT_TRANSPORT = "Ô tô";
const DEFAULT_TOUR_TYPE = "Ghép đoàn";

export default function AdminToursPage() {
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tCommon = useTranslations("Common");
  const t = useTranslations("Admin.Tours");
  const tAdmin = useTranslations("Admin.Common");
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose: closeDisclosure,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("q") || "";
  const rowsPerPage = 10;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  const setPage = (newPage: number) => {
    router.push(pathname + "?" + createQueryString("page", newPage.toString()));
  };

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(pathname + "?" + params.toString());
  };

  const [formData, setFormData] = useState<
    TourInput & { id: string | null; tagsString: string }
  >({
    id: null,
    nameVi: "",
    nameEn: "",
    slug: "",
    destinationId: "",
    description: "",
    durationDays: 1,
    durationText: "",
    departurePoint: "",
    transport: DEFAULT_TRANSPORT,
    tourType: DEFAULT_TOUR_TYPE,
    priceFrom: 0,
    oldPrice: 0,
    imageUrls: [],
    tags: [],
    tagsString: "",
    inclusions: "",
    exclusions: "",
    policy: "",
    isActive: true,
  });

  const { data: toursData, isLoading } = useAdminToursList(
    page,
    rowsPerPage,
    searchQuery,
  );
  const { data: destinationsData } = useDestinationsPicklist();

  // Mutations via Server Actions
  const mutation = useMutation({
    mutationFn: async (newData: TourInput & { id: string | null }) => {
      const { id, ...data } = newData;

      if (id) {
        return updateTourAction(id, data);
      }

      return createTourAction(data);
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        void invalidateTours(queryClient);
        addToast({ title: tCommon("success"), color: "success" });
        // Nếu đang tạo mới (id === null) -> đưa thẳng sang trang chỉnh lộ trình
        if (!variables?.id && result.data.id) {
          router.push(`${ROUTES.ADMIN.TOURS}/${result.data.id}`);
        }
        closeDisclosure();
      } else {
        addToast({
          title: tCommon("error"),
          description:
            result.message ??
            result.error ??
            tCommon("toast_cannot_save_config"),
          color: "danger",
        });
      }
    },
    onError: (error: Error) => {
      addToast({
        title: tCommon("error"),
        description: error.message || tCommon("toast_system_error"),
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteTourAction(id);
    },
    onSuccess: (result) => {
      if (result.success) {
        void invalidateTours(queryClient);
        addToast({
          title: tCommon("toast_deleted_tour_success"),
          color: "success",
        });
      } else {
        addToast({
          title: tCommon("error"),
          description:
            result.message ??
            result.error ??
            tCommon("toast_delete_tour_failed"),
          color: "danger",
        });
      }
    },
    onError: () => {
      addToast({
        title: tCommon("error"),
        description: tCommon("toast_delete_tour_failed"),
        color: "danger",
      });
    },
  });

  const tours = toursData?.success ? toursData.data : [];
  const destinations = destinationsData?.success ? destinationsData.data : [];
  const totalPages = (toursData?.success ? toursData.meta.totalPages : 1) || 1;

  const handleEdit = (tour: Tour) => {
    setFormData({
      id: tour.id,
      nameVi: tour.nameVi,
      nameEn: tour.nameEn || "",
      slug: tour.slug,
      destinationId: tour.destinationId || "",
      description: tour.description || "",
      durationDays: tour.durationDays,
      durationText: tour.durationText || "",
      departurePoint: tour.departurePoint || "",
      transport: tour.transport || DEFAULT_TRANSPORT,
      tourType: tour.tourType || DEFAULT_TOUR_TYPE,
      priceFrom: Number(tour.priceFrom),
      oldPrice: Number(tour.oldPrice || 0),
      imageUrls: tour.imageUrls || [],
      tags: tour.tags || [],
      tagsString: (tour.tags || []).join(", "),
      inclusions: (tour.inclusions as string) || "",
      exclusions: (tour.exclusions as string) || "",
      policy: (tour.policy as string) || "",
      isActive: tour.isActive,
    });
    onOpen();
  };

  const handleAddNew = () => {
    setFormData({
      id: null,
      nameVi: "",
      nameEn: "",
      slug: "",
      destinationId: "",
      description: "",
      durationDays: 1,
      durationText: "",
      departurePoint: "",
      transport: DEFAULT_TRANSPORT,
      tourType: DEFAULT_TOUR_TYPE,
      priceFrom: 0,
      oldPrice: 0,
      imageUrls: [],
      tags: [],
      tagsString: "",
      inclusions: "",
      exclusions: "",
      policy: "",
      isActive: true,
    });
    onOpen();
  };

  const handleSave = () => {
    const { id, tagsString, ...rest } = formData;
    const finalData = {
      ...rest,
      tags: tagsString
        ? tagsString
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    mutation.mutate({ id, ...finalData });
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (pendingDeleteId) {
      deleteMutation.mutate(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-default-900">
            {t("title")}
          </h1>
          <p className="text-default-500">{t("subtitle")}</p>
        </div>
        <Button
          className="font-bold shadow-lg shadow-primary/20"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleAddNew}
        >
          {t("add_new")}
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          isClearable
          className="flex-1"
          placeholder={t("search_placeholder")}
          startContent={<Search className="text-default-400" size={18} />}
          value={searchQuery}
          variant="flat"
          onValueChange={handleSearch}
        />
        <Button startContent={<Filter size={18} />} variant="flat">
          {t("filter")}
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table
            removeWrapper
            aria-label={t("table_label")}
            bottomContent={
              totalPages <= 1 ? null : (
                <div className="flex w-full justify-center p-4">
                  <Pagination
                    showControls
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={(p) => setPage(p)}
                  />
                </div>
              )
            }
            className="min-h-[400px]"
          >
            <TableHeader>
              <TableColumn className="bg-default-100/50">
                {t("col_tour")}
              </TableColumn>
              <TableColumn className="bg-default-100/50">
                {t("col_destination")}
              </TableColumn>
              <TableColumn className="bg-default-100/50">
                {t("col_departure")}
              </TableColumn>
              <TableColumn className="bg-default-100/50 text-center">
                {t("col_transport")}
              </TableColumn>
              <TableColumn className="bg-default-100/50">
                {t("col_price")}
              </TableColumn>
              <TableColumn className="bg-default-100/50">
                {t("col_status")}
              </TableColumn>
              <TableColumn className="bg-default-100/50 text-right">
                {t("col_actions")}
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={isLoading ? tAdmin("loading") : t("empty")}
              isLoading={isLoading}
            >
              {tours.map((tour: Tour) => (
                <TableRow
                  key={tour.id}
                  className="hover:bg-default-50 transition-colors"
                >
                  <TableCell>
                    <User
                      avatarProps={{
                        src: tour.imageUrls?.[0] || undefined,
                        radius: "lg",
                      }}
                      description={tour.slug}
                      name={tour.nameVi}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-primary" size={14} />
                      <span className="text-sm font-medium">
                        {tour.destination?.nameVi || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-500">
                      {tour.departurePoint || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {tour.transport?.toLowerCase().includes("bay") ? (
                        <Plane className="text-blue-500" size={16} />
                      ) : (
                        <Bus className="text-slate-400" size={16} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {tour.oldPrice ? (
                        <span className="text-[10px] text-slate-400 line-through">
                          {Number(tour.oldPrice).toLocaleString("vi-VN")}
                        </span>
                      ) : null}
                      <span className="font-bold text-primary">
                        {Number(tour.priceFrom).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="font-bold uppercase text-[10px]"
                      color={tour.isActive ? "success" : "default"}
                      size="sm"
                      variant="flat"
                    >
                      {tour.isActive ? tAdmin("active") : tAdmin("inactive")}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip content={tAdmin("view")}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() =>
                            router.push(`${ROUTES.ADMIN.TOURS}/${tour.id}`)
                          }
                        >
                          <Eye className="text-default-400" size={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip content={tAdmin("edit")}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEdit(tour)}
                        >
                          <Edit2 className="text-primary" size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip color="danger" content={t("delete_title")}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleDelete(tour.id)}
                        >
                          <Trash2 className="text-danger" size={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        classNames={{
          base: "rounded-3xl border border-slate-100 shadow-2xl",
          header: "border-b border-slate-100 p-6",
          body: "p-6",
          footer: "border-t border-slate-100 p-6",
        }}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onCloseModal: () => void) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {formData.id ? t("modal_edit") : t("modal_create")}
                </h2>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
                  {t("basic_subtitle")}
                </p>
              </ModalHeader>
              <ModalBody className="space-y-8 py-8">
                {/* Section 1: Thông tin cơ bản */}
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 w-fit px-3 py-1 rounded-full">
                    {t("basic_title")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BilingualInput
                      isRequired
                      label={t("field_name")}
                      name="name"
                      value={{ vi: formData.nameVi, en: formData.nameEn || "" }}
                      onValueChange={(val) => {
                        setFormData({
                          ...formData,
                          nameVi: val.vi,
                          nameEn: val.en,
                          slug: formData.id ? formData.slug : slugify(val.vi),
                        });
                      }}
                    />
                    <Input
                      isRequired
                      label={t("field_slug")}
                      labelPlacement="outside"
                      placeholder="tour-du-lich-ha-long"
                      value={formData.slug}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({ ...formData, slug: v })
                      }
                    />
                  </div>
                </div>

                {/* Section 2: Thông tin vận hành */}
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 w-fit px-3 py-1 rounded-full">
                    {t("departures_title")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                      label={t("field_destination")}
                      labelPlacement="outside"
                      placeholder={t("field_destination_placeholder")}
                      selectedKeys={
                        formData.destinationId ? [formData.destinationId] : []
                      }
                      variant="bordered"
                      onSelectionChange={(keys) =>
                        setFormData({
                          ...formData,
                          destinationId: Array.from(keys)[0] as string,
                        })
                      }
                    >
                      {destinations.map((dest) => (
                        <SelectItem key={dest.id}>{dest.nameVi}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label={t("field_duration")}
                      labelPlacement="outside"
                      type="number"
                      value={formData.durationDays.toString()}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({
                          ...formData,
                          durationDays: parseInt(v) || 1,
                        })
                      }
                    />

                    <Input
                      label={t("field_duration_text")}
                      labelPlacement="outside"
                      value={formData.durationText || ""}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({ ...formData, durationText: v })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label={t("field_departure_point")}
                      labelPlacement="outside"
                      placeholder={t("field_departure_placeholder")}
                      value={formData.departurePoint || ""}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({ ...formData, departurePoint: v })
                      }
                    />

                    <Select
                      label={t("field_transport")}
                      labelPlacement="outside"
                      selectedKeys={[formData.transport || DEFAULT_TRANSPORT]}
                      variant="bordered"
                      onSelectionChange={(keys) =>
                        setFormData({
                          ...formData,
                          transport: Array.from(keys)[0] as string,
                        })
                      }
                    >
                      <SelectItem key={DEFAULT_TRANSPORT}>
                        {t("transport_bus")}
                      </SelectItem>
                      <SelectItem key="Máy bay">
                        {t("transport_plane")}
                      </SelectItem>
                      <SelectItem key="Tàu thủy">
                        {t("transport_ship")}
                      </SelectItem>
                      <SelectItem key="Tàu hỏa">
                        {t("transport_train")}
                      </SelectItem>
                    </Select>

                    <Select
                      label={t("field_tour_type")}
                      labelPlacement="outside"
                      selectedKeys={[formData.tourType || DEFAULT_TOUR_TYPE]}
                      variant="bordered"
                      onSelectionChange={(keys) =>
                        setFormData({
                          ...formData,
                          tourType: Array.from(keys)[0] as string,
                        })
                      }
                    >
                      <SelectItem key={DEFAULT_TOUR_TYPE}>
                        {t("tour_type_group")}
                      </SelectItem>
                      <SelectItem key="Tour riêng">
                        {t("tour_type_private")}
                      </SelectItem>
                    </Select>
                  </div>
                </div>

                {/* Section 3: Giá & Marketing */}
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 w-fit px-3 py-1 rounded-full">
                    {t("field_price")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      color="primary"
                      label={t("field_price")}
                      labelPlacement="outside"
                      type="number"
                      value={formData.priceFrom?.toString()}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({
                          ...formData,
                          priceFrom: parseInt(v) || 0,
                        })
                      }
                    />

                    <Input
                      label={t("field_old_price")}
                      labelPlacement="outside"
                      type="number"
                      value={formData.oldPrice?.toString()}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({
                          ...formData,
                          oldPrice: parseInt(v) || 0,
                        })
                      }
                    />

                    <Input
                      label={t("field_tags")}
                      labelPlacement="outside"
                      value={formData.tagsString}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({ ...formData, tagsString: v })
                      }
                    />
                  </div>
                </div>

                {/* Section 4: Nội dung chi tiết */}
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 w-fit px-3 py-1 rounded-full">
                    {t("field_images")}
                  </div>
                  <div className="space-y-4">
                    <ImageUploader
                      maxFiles={8}
                      value={formData.imageUrls}
                      onChange={(urls) =>
                        setFormData({ ...formData, imageUrls: urls })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RichTextEditor
                      label={t("inclusions")}
                      value={formData.inclusions || ""}
                      onChange={(v) =>
                        setFormData({ ...formData, inclusions: v })
                      }
                    />

                    <RichTextEditor
                      label={t("exclusions")}
                      value={formData.exclusions || ""}
                      onChange={(v) =>
                        setFormData({ ...formData, exclusions: v })
                      }
                    />
                  </div>
                  <RichTextEditor
                    label={t("policy")}
                    placeholder={t("policy_placeholder")}
                    value={formData.policy || ""}
                    onChange={(v) => setFormData({ ...formData, policy: v })}
                  />

                  <RichTextEditor
                    label={t("overview")}
                    placeholder={t("overview_placeholder")}
                    value={formData.description || ""}
                    onChange={(v) =>
                      setFormData({ ...formData, description: v })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onCloseModal}>
                  {tAdmin("cancel")}
                </Button>
                <Button
                  color="primary"
                  isLoading={mutation.isPending}
                  onPress={handleSave}
                >
                  {tAdmin("save_info")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <DeleteConfirmModal
        cancelLabel={tAdmin("cancel")}
        confirmLabel={tCommon("confirm")}
        isLoading={deleteMutation.isPending}
        isOpen={isDeleteOpen}
        message={t("delete_message")}
        title={t("delete_title")}
        onConfirm={handleDeleteConfirm}
        onOpenChange={onDeleteOpenChange}
      />
    </div>
  );
}
