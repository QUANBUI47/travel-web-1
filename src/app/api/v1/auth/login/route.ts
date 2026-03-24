import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu", data: null },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !authData || !authData.user || !authData.session) {
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không chính xác", data: null },
        { status: 401 }
      );
    }

    // Kiểm tra vai trò từ CSDL hiện tại
    const profile = await prisma.profile.findUnique({
      where: { id: authData.user.id },
    }) as UserProfile | null;

    // Trả về luồng Token JWT chuẩn xác cho Mobile App lưu trữ (AsyncStorage/Keychain)
    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profile?.role || "USER",
          profile: profile,
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
          expires_in: authData.session.expires_in,
        }
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("[POST /api/v1/auth/login] Lỗi đăng nhập:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi đăng nhập", error: error.message },
      { status: 500 }
    );
  }
}
