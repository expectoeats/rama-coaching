export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ENote from "@/models/ENote";

function serialize(doc: any) {
  return {
    id:             String(doc._id),
    title:          doc.title,
    description:    doc.description,
    courseCategory: doc.courseCategory,
    accessType:     doc.accessType,
    imageUrl:       doc.imageUrl ?? "",
    fileUrl:        doc.fileUrl  ?? "",
    content:        doc.content  ?? "",
    order:          doc.order    ?? 0,
    status:         doc.status,
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const access   = searchParams.get("access")   || "";   // "free" | "enrolled"
    const status   = searchParams.get("status")   || "";
    const publicOnly = searchParams.get("public") === "1";

    const filter: any = { deletedAt: { $exists: false } };
    if (publicOnly) filter.status = "active";
    else if (status && status !== "all") filter.status = status;
    if (category && category !== "all") filter.courseCategory = category;
    if (access && access !== "all") filter.accessType = access;

    const docs = await ENote.find(filter)
      .sort({ courseCategory: 1, order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: docs.map(serialize) });
  } catch (err) {
    console.error("[GET enotes]", err);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, courseCategory, accessType, fileUrl, content, order, status } = body;
    if (!title?.trim() || !description?.trim() || !courseCategory) {
      return NextResponse.json({ success: false, error: "Title, description and category required" }, { status: 400 });
    }
    const doc = await ENote.create({
      title: title.trim(), description: description.trim(),
      courseCategory, accessType: accessType || "enrolled",
      imageUrl: body.imageUrl?.trim() || "",
      fileUrl: fileUrl?.trim() || "", content: content?.trim() || "",
      order: Number(order) || 0, status: status || "active",
    });
    return NextResponse.json({ success: true, data: serialize(doc) }, { status: 201 });
  } catch (err) {
    console.error("[POST enotes]", err);
    return NextResponse.json({ success: false, error: "Failed to create" }, { status: 500 });
  }
}
