"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginSchema } from "@/lib/schemas";
import { AuthService } from "@/services/auth.service";

export async function loginAdmin(formData: FormData) {
  // Validate bằng Zod
  const rawData = Object.fromEntries(formData.entries());
  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    // Admin không cần đa ngôn ngữ, dùng text cứng tiếng Việt
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  const { email, password } = validated.data;
  const supabase = await createClient();

  // Đăng nhập qua Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Email hoặc mật khẩu không chính xác." };
  }

  // Kiểm tra role ADMIN qua Service Layer
  const isAdmin = await AuthService.validateAdminRole(data.user.id);

  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Tài khoản không có quyền truy cập quản trị viên." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/admin/login");
}
