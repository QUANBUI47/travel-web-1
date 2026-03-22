import { NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

export async function GET() {
  try {
    const destinations = await DestinationService.getAll();
    return NextResponse.json({ success: true, data: destinations });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const destination = await DestinationService.create(body);
    return NextResponse.json({ success: true, data: destination });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
