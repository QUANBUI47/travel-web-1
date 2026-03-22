import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Xóa cookie trên bản Web Server
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
      data: null
    }, { status: 200 });

  } catch (error: any) {
    console.error("[POST /api/v1/auth/logout] Lỗi đăng xuất:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi đăng xuất", error: error.message },
      { status: 500 }
    );
  }
}
