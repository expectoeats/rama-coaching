export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: { $exists: false } };
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter["$or"] = [{ name: regex }, { description: regex }, { category: regex }];
    }
    if (status && status !== "all") filter["status"] = status;

    const [items, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Course.countDocuments(filter),
    ]);

    const data = items.map((c: any) => ({
      id: String(c["_id"]),
      name: c["name"],
      description: c["description"],
      duration: c["duration"],
      fees: c["fees"],
      category: c["category"],
      accent: c["accent"],
      imageUrl: c["imageUrl"] ?? "",
      status: c["status"],
    }));

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[GET courses]", err);
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description, duration, fees, category, accent, status } = body;
    if (!name?.trim() || !description?.trim() || !duration?.trim() || !fees?.trim()) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    const doc = await Course.create({
      name: name.trim(),
      description: description.trim(),
      duration: duration.trim(),
      fees: fees.trim(),
      category: category?.trim() || "General",
      accent: accent || "#1F3354",
      imageUrl: body.imageUrl?.trim() || "",
      status: status || "active",
    });
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("duplicate key") || msg.includes("E11000")) {
      return NextResponse.json({ success: false, error: "Course name already exists" }, { status: 409 });
    }
    console.error("[POST courses]", err);
    return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 });
  }
}

