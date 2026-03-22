import { NextResponse } from "next/server";
import { DestinationService } from "@/services/destination.service";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const destination = await DestinationService.getByIds([params.id]);
    if (destination.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: destination[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const destination = await DestinationService.update(params.id, body);
    return NextResponse.json({ success: true, data: destination });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await DestinationService.delete(params.id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
