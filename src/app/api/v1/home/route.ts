import { NextResponse } from "next/server";
import { HomeService } from "@/services/home.service";

export async function GET() {
  try {
    // Tái sử dụng HomeService đã tạo
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
