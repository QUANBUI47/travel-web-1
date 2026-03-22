import { NextResponse } from "next/server";
import { HomeService } from "@/services/home.service";

export async function GET() {
  try {
    const settings = await HomeService.getSettings();
    
    return NextResponse.json({
      success: true,
      data: settings,
      message: "Lấy cấu hình trang chủ thành công"
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Lỗi hệ thống",
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { AuthService } = await import("@/services/auth.service");
    const { user, profile } = await AuthService.getCurrentSession();
    
    if (!user || profile?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Không có quyền" }, { status: 403 });
    }

    const body = await request.json();
    await HomeService.updateSettings(body);

    return NextResponse.json({ success: true, message: "Đã lưu cài đặt" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
