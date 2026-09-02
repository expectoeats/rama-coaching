export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MockTest from "@/models/MockTest";

// POST /api/mock-tests/[id]/submit
// Body: { answers: { [questionId]: number } }  (selectedOption index 0-3)
// Returns: score, totalMarks, passingMarks, passed, breakdown[]
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const doc = await MockTest.findOne({ _id: params.id, deletedAt: { $exists: false }, status: "active" }).lean();
    if (!doc) return NextResponse.json({ success: false, error: "Test not found" }, { status: 404 });

    const body = await req.json();
    const answers: Record<string, number> = body.answers ?? {};

    let score = 0;
    const breakdown = (doc as any).questions.map((q: any) => {
      const qid = String(q._id);
      const selected = answers[qid] ?? -1; // -1 = skipped
      const correct = q.correctOption;
      const isCorrect = selected === correct;
      if (isCorrect) score += q.marks;
      return {
        questionId: qid,
        questionText: q.questionText,
        options: q.options,
        selectedOption: selected,
        correctOption: correct,
        explanation: q.explanation ?? "",
        isCorrect,
        marks: q.marks,
        marksEarned: isCorrect ? q.marks : 0,
      };
    });

    const passed = score >= (doc as any).passingMarks;

    return NextResponse.json({
      success: true,
      result: {
        score,
        totalMarks: (doc as any).totalMarks,
        passingMarks: (doc as any).passingMarks,
        totalQuestions: (doc as any).questions.length,
        attempted: Object.keys(answers).length,
        correct: breakdown.filter((b: any) => b.isCorrect).length,
        passed,
        percentage: (doc as any).totalMarks > 0 ? Math.round((score / (doc as any).totalMarks) * 100) : 0,
        breakdown,
      },
    });
  } catch (err) {
    console.error("[POST mock-test submit]", err);
    return NextResponse.json({ success: false, error: "Failed to evaluate test" }, { status: 500 });
  }
}
