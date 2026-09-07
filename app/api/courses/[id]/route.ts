import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const doc = await Course.findOne({ _id: params.id, deletedAt: { $exists: false } }).lean();
    if (!doc) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: { id: String((doc as any)["_id"]), ...doc } });
  } catch (err) {
    console.error("[GET course]", err);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const update: any = {};
    for (const k of ["name", "description", "duration", "fees", "category", "accent", "status", "imageUrl"]) {
      if (body[k] !== undefined) update[k] = typeof body[k] === "string" ? body[k].trim() : body[k];
    }
    const doc = await Course.findOneAndUpdate({ _id: params.id, deletedAt: { $exists: false } }, update, { new: true, runValidators: true });
    if (!doc) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: doc });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("duplicate key")) return NextResponse.json({ success: false, error: "Course name exists" }, { status: 409 });
    console.error("[PUT course]", err);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const doc = await Course.findOneAndUpdate({ _id: params.id, deletedAt: { $exists: false } }, { deletedAt: new Date() }, { new: true });
    if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("[DELETE course]", err);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
