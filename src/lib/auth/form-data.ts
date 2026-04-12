/**
 * Next.js có thể serialize FormData từ client → server với key dạng `1_email`.
 * Chuẩn hóa về tên field gốc trước khi validate.
 */
export function parseAuthFormData(formData: FormData): Record<string, string> {
  const result: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (typeof value !== "string") return;

    const field = key.replace(/^\d+_/, "");

    result[field] = value;
  });

  return result;
}
