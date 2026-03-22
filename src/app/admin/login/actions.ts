"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Thông tin xác thực không chính xác." };
  }

  // Kiểm tra role ADMIN trong database
  const profile = await prisma.profile.findUnique({
    where: { id: data.user.id },
    select: { role: true },
  });

  if (!profile || profile.role !== "ADMIN") {
    // Không phải admin -> Logout ngay lập tức
    await supabase.auth.signOut();
    return { error: "Tài khoản của bạn không có quyền truy cập hệ thống quản trị." };
  }

  // Thành công -> Chuyển hướng về trang dashboard admin
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
