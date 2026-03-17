import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import NextLink from "next/link";

export const metadata = {
  title: "Quản lý SEO",
  description: "Cấu hình meta title, description và Open Graph cho từng trang.",
};

export default function AdminSeoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý SEO</h1>
        <Button as={NextLink} href="/admin/seo/new" color="primary">
          Thêm trang SEO
        </Button>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Danh sách trang SEO</h2>
        </CardHeader>
        <CardBody>
          <p className="text-default-600 text-sm mb-4">
            Dữ liệu lấy từ bảng <code>seo_pages</code> (Prisma). Mỗi bản ghi
            gồm: slug, meta_title, meta_description, og_image, no_index.
          </p>
          <div className="rounded-lg border border-default-200 p-4 text-center text-default-500">
            Chưa có bản ghi. Chạy migration và thêm dữ liệu qua form &quot;Thêm
            trang SEO&quot; hoặc seed.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
