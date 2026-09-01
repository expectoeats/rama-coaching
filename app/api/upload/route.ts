export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ success: false, error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Only images allowed" }, { status: 400 });
    }
    if (buffer.length > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Max 2MB" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, name);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, data: { url: `/uploads/${name}` } });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
