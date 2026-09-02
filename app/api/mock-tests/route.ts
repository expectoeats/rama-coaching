export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MockTest from "@/models/MockTest";

function serialize(doc: any) {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description,
    subject: doc.subject,
    duration: doc.duration,
    totalMarks: doc.totalMarks,
    passingMarks: doc.passingMarks,
    status: doc.status,
    attemptLimit: doc.attemptLimit,
    questions: (doc.questions ?? []).map((q: any) => ({
      id: String(q._id),
      questionText: q.questionText,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation ?? "",
      marks: q.marks,
    })),
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "";
    const publicOnly = searchParams.get("public") === "1"; // public: strip answers
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: { $exists: false } };
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter["$or"] = [{ title: regex }, { subject: regex }, { description: regex }];
    }
    if (status && status !== "all") filter.status = status;
    // Public page only sees active tests
    if (publicOnly) filter.status = "active";

    const [items, total] = await Promise.all([
      MockTest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MockTest.countDocuments(filter),
    ]);

    const data = items.map((doc) => {
      const s = serialize(doc);
      if (publicOnly) {
        // Strip correctOption and explanation from each question for public listing
        return {
          ...s,
          questions: s.questions.map(({ correctOption: _c, explanation: _e, ...rest }: { correctOption: number; explanation: string; [key: string]: unknown }) => rest),
        };
      }
      return s;
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET mock-tests]", err);
    return NextResponse.json({ success: false, error: "Failed to fetch mock tests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, subject, duration, totalMarks, passingMarks, status, attemptLimit } = body;

    if (!title?.trim() || !description?.trim() || !subject?.trim()) {
      return NextResponse.json({ success: false, error: "Title, description and subject are required" }, { status: 400 });
    }

    const doc = await MockTest.create({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      duration: Number(duration) || 30,
      totalMarks: Number(totalMarks) || 10,
      passingMarks: Number(passingMarks) || 5,
      status: status || "active",
      attemptLimit: Number(attemptLimit) || 10,
      questions: [],
    });

    return NextResponse.json({ success: true, data: serialize(doc) }, { status: 201 });
  } catch (err) {
    console.error("[POST mock-tests]", err);
    return NextResponse.json({ success: false, error: "Failed to create mock test" }, { status: 500 });
  }
}
