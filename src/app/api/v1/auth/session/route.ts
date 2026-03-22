import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function GET() {
  try {
    const { user, profile } = await AuthService.getCurrentSession();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Chưa đăng nhập",
        data: null
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Thành công",
      data: {
        id: user.id,
        email: user.email,
        profile: profile
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Lỗi hệ thống",
    }, { status: 500 });
  }
}
