"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import * as LucideIcons from "lucide-react";
import axios from "axios";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { addToast } from "@heroui/toast";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState<any>({
        id: null,
        nameVi: "",
        nameEn: "",
        slug: "",
        regionId: "",
        imageUrl: "",
        description: "",
        sortOrder: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [destRes, regRes] = await Promise.all([
                axios.get("/api/v1/destinations"),
                axios.get("/api/v1/regions")
            ]);
            if (destRes.data.success) setDestinations(destRes.data.data);
            if (regRes.data.success) setRegions(regRes.data.data);
        } catch (error) {
            console.error(error);
            addToast({ title: "Lỗi tải dữ liệu", color: "danger" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (dest: any) => {
        setFormData({
            id: dest.id,
            nameVi: dest.nameVi,
            nameEn: dest.nameEn || "",
            slug: dest.slug,
            regionId: dest.regionId,
            imageUrl: dest.imageUrl || "",
            description: dest.description || "",
            sortOrder: dest.sortOrder || 0
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
            description: "",
            sortOrder: 0
        });
        onOpen();
    };

    const handleSave = async () => {
        if (!formData.nameVi || !formData.regionId || !formData.slug) {
            addToast({ title: "Vui lòng nhập đầy đủ thông tin bắt buộc", color: "warning" });
            return;
        }

        setIsSaving(true);
        try {
            if (formData.id) {
                await axios.put(`/api/v1/destinations/${formData.id}`, formData);
                addToast({ title: "Cập nhật thành công", color: "success" });
            } else {
                await axios.post("/api/v1/destinations", formData);
                addToast({ title: "Tạo mới thành công", color: "success" });
            }
            fetchData();
            onClose();
        } catch (error: any) {
            addToast({ title: "Lỗi lưu dữ liệu", description: error.response?.data?.message, color: "danger" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa điểm đến này?")) return;
        try {
            await axios.delete(`/api/v1/destinations/${id}`);
            addToast({ title: "Đã xóa", color: "success" });
            fetchData();
        } catch (error) {
            addToast({ title: "Lỗi khi xóa", color: "danger" });
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Quản lý Điểm đến</h1>
                    <p className="text-xs text-slate-500 font-medium">Quản lý danh lục địa điểm du lịch trên toàn hệ thống</p>
                </div>
                <Button 
                    color="primary" 
                    onPress={handleAddNew} 
                    startContent={<LucideIcons.Plus size={18} />}
                    className="font-black text-xs uppercase tracking-widest px-6 h-12 rounded-2xl shadow-xl shadow-primary/25"
                >
                    Thêm điểm đến mới
                </Button>
            </div>

            <Table 
                aria-label="Danh sách điểm đến"
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100"
                classNames={{
                    th: "bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px] py-4",
                    td: "py-4"
                }}
            >
                <TableHeader>
                    <TableColumn>ĐIỂM ĐẾN</TableColumn>
                    <TableColumn>VÙNG MIỀN</TableColumn>
                    <TableColumn>SLUG</TableColumn>
                    <TableColumn>THỨ TỰ</TableColumn>
                    <TableColumn align="center">HÀNH ĐỘNG</TableColumn>
                </TableHeader>
                <TableBody isLoading={isLoading} emptyContent="Chưa có dữ liệu điểm đến nào">
                    {destinations.map((dest) => (
                        <TableRow key={dest.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ src: dest.imageUrl, radius: "lg", size: "lg" }}
                                    description={dest.nameEn}
                                    name={dest.nameVi}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color="primary" className="font-bold">
                                    {dest.region?.nameVi || "N/A"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <code className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-mono">
                                    {dest.slug}
                                </code>
                            </TableCell>
                            <TableCell>
                                <span className="font-bold text-slate-400">{dest.sortOrder}</span>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-center gap-2">
                                    <Tooltip content="Chỉnh sửa">
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(dest)} className="text-primary hover:bg-primary/10">
                                            <LucideIcons.Edit3 size={18} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Xóa">
                                        <Button isIconOnly size="sm" variant="light" onPress={() => handleDelete(dest.id)} className="text-danger hover:bg-danger/10">
                                            <LucideIcons.Trash2 size={18} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                size="3xl"
                scrollBehavior="inside"
                classNames={{
                    base: "rounded-3xl border border-slate-100 shadow-2xl overflow-hidden",
                    header: "border-b border-slate-100 p-6",
                    body: "p-6",
                    footer: "border-t border-slate-100 p-6"
                }}
            >
                <ModalContent>
                    {(onClose: () => void) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-xl font-black uppercase tracking-tight">
                                    {formData.id ? "Cập nhật Điểm đến" : "Thêm Điểm đến Mới"}
                                </h2>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Cấu hình thông tin địa điểm</p>
                            </ModalHeader>
                            <ModalBody className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <BilingualInput 
                                        label="Tên Điểm đến"
                                        name="name"
                                        value={{ vi: formData.nameVi, en: formData.nameEn }}
                                        onValueChange={(val) => {
                                            setFormData({ 
                                                ...formData, 
                                                nameVi: val.vi, 
                                                nameEn: val.en,
                                                slug: formData.id ? formData.slug : slugify(val.vi)
                                            });
                                        }}
                                        isRequired
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">Đường dẫn (Slug)</label>
                                        <Input 
                                            value={formData.slug}
                                            onValueChange={(v: string) => setFormData({ ...formData, slug: v })}
                                            placeholder="ha-long-bay"
                                            variant="bordered"
                                            classNames={{ inputWrapper: "rounded-2xl h-11" }}
                                            isRequired
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">Vùng miền</label>
                                        <Select 
                                            label="Chọn vùng miền"
                                            selectedKeys={formData.regionId ? [formData.regionId] : []}
                                            onSelectionChange={(keys: any) => setFormData({ ...formData, regionId: Array.from(keys)[0] as string })}
                                            variant="bordered"
                                            classNames={{ trigger: "rounded-2xl h-11 border-default-200" }}
                                            isRequired
                                        >
                                            {regions.map((reg) => (
                                                <SelectItem key={reg.id}>
                                                    {reg.nameVi}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">Thứ tự ưu tiên</label>
                                        <Input 
                                            type="number"
                                            value={formData.sortOrder.toString()}
                                            onValueChange={(v: string) => setFormData({ ...formData, sortOrder: parseInt(v) || 0 })}
                                            variant="bordered"
                                            classNames={{ inputWrapper: "rounded-2xl h-11" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">Hình ảnh đại diện</label>
                                    <ImageUploader 
                                        value={formData.imageUrl ? [formData.imageUrl] : []}
                                        onChange={(urls) => setFormData({ ...formData, imageUrl: urls[0] || "" })}
                                        maxFiles={1}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-default-500 ml-1">Mô tả ngắn</label>
                                    <Textarea 
                                        value={formData.description}
                                        onValueChange={(v: string) => setFormData({ ...formData, description: v })}
                                        placeholder="Nhập mô tả về điểm đến..."
                                        variant="bordered"
                                        classNames={{ inputWrapper: "rounded-2xl" }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} className="font-bold text-slate-400">
                                    Hủy bỏ
                                </Button>
                                <Button 
                                    color="primary" 
                                    onPress={handleSave} 
                                    isLoading={isSaving}
                                    className="font-black px-8 h-12 rounded-xl shadow-xl shadow-primary/25 text-xs tracking-widest"
                                >
                                    LƯU THÔNG TIN
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
