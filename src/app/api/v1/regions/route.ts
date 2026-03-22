import { NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

export async function GET() {
  try {
    const regions = await DestinationService.getRegions();
    return NextResponse.json({ success: true, data: regions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
