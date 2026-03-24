import { NextResponse } from "next/server";
import { TourService } from "@/services/tour.service";

export async function GET() {
  try {
    const tours = await TourService.getAll();
    return NextResponse.json({ success: true, data: tours });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
