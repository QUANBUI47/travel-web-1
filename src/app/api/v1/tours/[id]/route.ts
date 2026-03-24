import { NextResponse } from "next/server";
import { TourService } from "@/services/tour.service";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await TourService.delete(id);
    return NextResponse.json({ success: true, message: "Đã xóa tour thành công" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
