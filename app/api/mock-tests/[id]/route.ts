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

// GET single test (admin — includes answers)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const doc = await MockTest.findOne({ _id: params.id, deletedAt: { $exists: false } }).lean();
    if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: serialize(doc) });
  } catch (err) {
    console.error("[GET mock-test]", err);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

// PUT — update test meta + questions
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const update: any = {};

    for (const k of ["title", "description", "subject", "status"]) {
      if (body[k] !== undefined) update[k] = typeof body[k] === "string" ? body[k].trim() : body[k];
    }
    for (const k of ["duration", "totalMarks", "passingMarks", "attemptLimit"]) {
      if (body[k] !== undefined) update[k] = Number(body[k]);
    }

    // If questions array sent, validate and replace
    if (Array.isArray(body.questions)) {
      for (const q of body.questions) {
        if (!q.questionText?.trim()) {
          return NextResponse.json({ success: false, error: "Each question must have questionText" }, { status: 400 });
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          return NextResponse.json({ success: false, error: "Each question must have exactly 4 options" }, { status: 400 });
        }
        if (q.correctOption == null || q.correctOption < 0 || q.correctOption > 3) {
          return NextResponse.json({ success: false, error: "correctOption must be 0–3" }, { status: 400 });
        }
      }
      update.questions = body.questions.map((q: any) => ({
        questionText: q.questionText.trim(),
        options: q.options.map((o: string) => o.trim()),
        correctOption: Number(q.correctOption),
        explanation: q.explanation?.trim() ?? "",
        marks: Number(q.marks) || 1,
      }));
    }

    const doc = await MockTest.findOneAndUpdate(
      { _id: params.id, deletedAt: { $exists: false } },
      update,
      { new: true, runValidators: true }
    );
    if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: serialize(doc) });
  } catch (err) {
    console.error("[PUT mock-test]", err);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

// DELETE — soft delete
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const doc = await MockTest.findOneAndUpdate(
      { _id: params.id, deletedAt: { $exists: false } },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("[DELETE mock-test]", err);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
