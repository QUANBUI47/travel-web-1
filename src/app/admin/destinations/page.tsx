"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { Plus, Edit3, Trash2, ExternalLink } from "lucide-react";
import NextLink from "next/link";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Destination, Region, CreateDestinationInput } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { destinationDetailPath } from "@/constants";
import {
  createDestinationAction,
  updateDestinationAction,
  deleteDestinationAction,
} from "@/actions/destination.actions";
import { useAdminDestinationsList, useRegions } from "@/hooks/queries";
import { invalidateDestinations } from "@/lib/query/invalidate";
import { DeleteConfirmModal } from "@/components/admin/delete-confirm-modal";
import { getDestinationGallery } from "@/lib/destination/cover-image";
import { slugify } from "@/lib/utils/slugify";

export default function DestinationsPage() {
  const t = useTranslations("Admin.Destinations");
  const tAdmin = useTranslations("Admin.Common");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();
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

  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [rowsPerPage] = useState(10);

  const [formData, setFormData] = useState<
    CreateDestinationInput & { id: string | null }
  >({
    id: null,
    nameVi: "",
    nameEn: "",
    slug: "",
    regionId: "",
    imageUrl: "",
    imageUrls: [],
    description: "",
    sortOrder: 0,
    isFeatured: false,
    latitude: null,
    longitude: null,
  });

  const { data: destData, isLoading: isDestLoading } = useAdminDestinationsList(
    page,
    rowsPerPage,
  );
  const { data: regionsData } = useRegions();

  // Mutations via Server Actions
  const mutation = useMutation({
    mutationFn: async (
      newData: CreateDestinationInput & { id: string | null },
    ) => {
      const { id, ...data } = newData;

      if (id) {
        return updateDestinationAction(id, data);
      }

      return createDestinationAction(data);
    },
    onSuccess: (result) => {
      if (result.success) {
        void invalidateDestinations(queryClient);
        addToast({ title: tCommon("success"), color: "success" });
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
      return deleteDestinationAction(id);
    },
    onSuccess: (result) => {
      if (result.success) {
        void invalidateDestinations(queryClient);
        addToast({
          title: tCommon("success"),
          description: tCommon("toast_deleted_destination"),
          color: "success",
        });
      } else {
        addToast({
          title: tCommon("error"),
          description:
            result.message ?? result.error ?? tCommon("toast_delete_failed"),
          color: "danger",
        });
      }
    },
    onError: () => {
      addToast({
        title: tCommon("error"),
        description: tCommon("toast_delete_failed"),
        color: "danger",
      });
    },
  });

  const destinations = destData?.success ? destData.data : [];
  const regions = regionsData?.success ? regionsData.data : [];
  const totalPages = (destData?.success ? destData.meta.totalPages : 1) || 1;
  const totalItems = (destData?.success ? destData.meta.total : 0) || 0;

  const handleEdit = (dest: Destination) => {
    setFormData({
      id: dest.id,
      nameVi: dest.nameVi,
      nameEn: dest.nameEn || "",
      slug: dest.slug,
      regionId: dest.regionId,
      imageUrl: dest.imageUrl || getDestinationGallery(dest)[0] || "",
      imageUrls: getDestinationGallery(dest),
      description: dest.description || "",
      sortOrder: dest.sortOrder || 0,
      isFeatured: dest.isFeatured ?? false,
      latitude: dest.latitude || null,
      longitude: dest.longitude || null,
    });
    onOpen();
  };

  const handleAddNew = () => {
    setFormData({
      id: null,
      nameVi: "",
      nameEn: "",
      slug: "",
      regionId: "",
      imageUrl: "",
      imageUrls: [],
      description: "",
      sortOrder: 0,
      isFeatured: false,
      latitude: null,
      longitude: null,
    });
    onOpen();
  };

  const handleSave = () => {
    if (!formData.nameVi || !formData.regionId || !formData.slug) {
      addToast({
        title: tCommon("toast_fill_required_fields"),
        color: "warning",
      });

      return;
    }
    mutation.mutate(formData);
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

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t("subtitle", { count: totalItems })}
          </p>
        </div>
        <Button
          className="font-black text-xs uppercase tracking-widest px-6 h-12 rounded-2xl shadow-xl shadow-primary/25"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleAddNew}
        >
          {t("add_new")}
        </Button>
      </div>

      <Table
        aria-label={t("table_label")}
        bottomContent={
          totalPages <= 1 ? null : (
            <div className="flex w-full justify-center">
              <Pagination
                showControls
                color="primary"
                page={page}
                total={totalPages}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100"
        classNames={{
          th: "bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px] py-4",
          td: "py-4",
        }}
      >
        <TableHeader>
          <TableColumn>{t("col_destination")}</TableColumn>
          <TableColumn>{t("col_region")}</TableColumn>
          <TableColumn>{t("col_slug")}</TableColumn>
          <TableColumn>{t("col_sort")}</TableColumn>
          <TableColumn align="center">{t("col_actions")}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("empty")} isLoading={isDestLoading}>
          {destinations.map((dest: Destination) => (
            <TableRow key={dest.id}>
              <TableCell>
                <User
                  avatarProps={{
                    src: dest.imageUrl || undefined,
                    radius: "lg",
                    size: "lg",
                  }}
                  description={dest.nameEn || ""}
                  name={dest.nameVi}
                />
              </TableCell>
              <TableCell>
                <Chip
                  className="font-bold"
                  color="primary"
                  size="sm"
                  variant="flat"
                >
                  {dest.region?.nameVi || "N/A"}
                </Chip>
              </TableCell>
              <TableCell>
                <code className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-mono">
                  {dest.slug}
                </code>
              </TableCell>
              <TableCell>
                <span className="font-bold text-slate-400">
                  {dest.sortOrder}
                </span>
              </TableCell>
              <TableCell>
                <div className="relative flex items-center justify-center gap-2">
                  <Tooltip content={t("view_public")}>
                    <Button
                      isIconOnly
                      as={NextLink}
                      className="text-slate-500 hover:bg-slate-100"
                      href={destinationDetailPath(dest.slug)}
                      size="sm"
                      target="_blank"
                      variant="light"
                    >
                      <ExternalLink size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content={tAdmin("edit")}>
                    <Button
                      isIconOnly
                      className="text-primary hover:bg-primary/10"
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(dest)}
                    >
                      <Edit3 size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" content={tAdmin("delete")}>
                    <Button
                      isIconOnly
                      className="text-danger hover:bg-danger/10"
                      size="sm"
                      variant="light"
                      onPress={() => handleDelete(dest.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        classNames={{
          base: "rounded-3xl border border-slate-100 shadow-2xl overflow-hidden",
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
                  {tAdmin("configure_module")}
                </p>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BilingualInput
                    isRequired
                    label={t("field_name")}
                    name="name"
                    value={{ vi: formData.nameVi, en: formData.nameEn ?? "" }}
                    onValueChange={(val) => {
                      setFormData({
                        ...formData,
                        nameVi: val.vi,
                        nameEn: val.en,
                        slug: formData.id ? formData.slug : slugify(val.vi),
                      });
                    }}
                  />
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest text-default-500 ml-1"
                      htmlFor="dest-slug"
                    >
                      {t("field_slug")}
                    </label>
                    <Input
                      isRequired
                      classNames={{ inputWrapper: "rounded-2xl h-11" }}
                      id="dest-slug"
                      placeholder="ha-long-bay"
                      value={formData.slug}
                      variant="bordered"
                      onValueChange={(v: string) =>
                        setFormData({ ...formData, slug: v })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest text-default-500 ml-1"
                      htmlFor="dest-region"
                    >
                      {t("field_region")}
                    </label>
                    <Select
                      isRequired
                      classNames={{
                        trigger: "rounded-2xl h-11 border-default-200",
                      }}
                      id="dest-region"
                      label={t("field_region")}
                      selectedKeys={
                        formData.regionId ? [formData.regionId] : []
                      }
                      variant="bordered"
                      onSelectionChange={(keys) =>
                        setFormData({
                          ...formData,
                          regionId: String(Array.from(keys)[0] ?? ""),
                        })
                      }
                    >
                      {regions.map((reg: Region) => (
                        <SelectItem key={reg.id}>{reg.nameVi}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest text-default-500 ml-1"
                      htmlFor="dest-sort"
                    >
                      {t("col_sort")}
                    </label>
                    <Input
                      classNames={{ inputWrapper: "rounded-2xl h-11" }}
                      id="dest-sort"
                      type="number"
                      value={formData.sortOrder.toString()}
                      variant="bordered"
                      onValueChange={(v: string) =>
                        setFormData({
                          ...formData,
                          sortOrder: parseInt(v) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">
                    {t("field_gallery")}
                  </div>
                  <ImageUploader
                    maxFiles={8}
                    value={formData.imageUrls}
                    onChange={(urls) =>
                      setFormData({
                        ...formData,
                        imageUrls: urls,
                        imageUrl: urls[0] || "",
                      })
                    }
                  />
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t("field_gallery_hint")}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-default-500">
                      {t("field_featured")}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {t("field_featured_hint")}
                    </p>
                  </div>
                  <Switch
                    isSelected={formData.isFeatured}
                    onValueChange={(isFeatured) =>
                      setFormData({ ...formData, isFeatured })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest text-default-500 ml-1"
                      htmlFor="dest-lat"
                    >
                      {t("field_latitude")}
                    </label>
                    <Input
                      classNames={{ inputWrapper: "rounded-2xl h-11" }}
                      id="dest-lat"
                      placeholder="21.0285"
                      type="number"
                      value={formData.latitude?.toString() ?? ""}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({
                          ...formData,
                          latitude: v ? parseFloat(v) : null,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-xs font-black uppercase tracking-widest text-default-500 ml-1"
                      htmlFor="dest-lng"
                    >
                      {t("field_longitude")}
                    </label>
                    <Input
                      classNames={{ inputWrapper: "rounded-2xl h-11" }}
                      id="dest-lng"
                      placeholder="105.8542"
                      type="number"
                      value={formData.longitude?.toString() ?? ""}
                      variant="bordered"
                      onValueChange={(v) =>
                        setFormData({
                          ...formData,
                          longitude: v ? parseFloat(v) : null,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">
                    {t("field_description")}
                  </div>
                  <RichTextEditor
                    label={t("field_description")}
                    placeholder={t("description_placeholder")}
                    value={formData.description || ""}
                    onChange={(description) =>
                      setFormData({ ...formData, description })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="font-bold text-slate-400"
                  variant="light"
                  onPress={onCloseModal}
                >
                  {tAdmin("cancel")}
                </Button>
                <Button
                  className="font-black px-8 h-12 rounded-xl shadow-xl shadow-primary/25 text-xs tracking-widest"
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
