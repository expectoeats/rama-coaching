"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertTriangle,
  BookOpen,
  Target,
  HelpCircle,
  Send,
  RotateCcw,
  ArrowLeft,
  Circle,
  ClipboardList,
} from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PublicQuestion {
  id: string;
  questionText: string;
  options: string[];
  marks: number;
}

interface TestMeta {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  questions: PublicQuestion[];
}

interface BreakdownItem {
  questionId: string;
  questionText: string;
  options: string[];
  selectedOption: number;
  correctOption: number;
  explanation: string;
  isCorrect: boolean;
  marks: number;
  marksEarned: number;
}

interface TestResult {
  score: number;
  totalMarks: number;
  passingMarks: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  passed: boolean;
  percentage: number;
  breakdown: BreakdownItem[];
}

type Phase = "instructions" | "test" | "submitting" | "result";

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function MockTestPage() {
  const params = useParams();
  const testId = params.id as string;

  const [test, setTest] = useState<TestMeta | null>(null);
  const [loadError, setLoadError] = useState("");
  const [phase, setPhase] = useState<Phase>("instructions");

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [result, setResult] = useState<TestResult | null>(null);
  const [resultTab, setResultTab] = useState<"summary" | "review">("summary");

  useEffect(() => {
    fetch(`/api/mock-tests?public=1&limit=100`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          const found = j.data.find((t: TestMeta) => t.id === testId);
          if (found) { setTest(found); setTimeLeft(found.duration * 60); }
          else setLoadError("Test not found or unavailable.");
        } else setLoadError("Failed to load test.");
      })
      .catch(() => setLoadError("Network error. Please try again."));
  }, [testId]);

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) { clearInterval(timerRef.current!); submitTest(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  function startTest() {
    setAnswers({});
    setCurrentQ(0);
    setTimeLeft((test?.duration ?? 30) * 60);
    setPhase("test");
  }

  async function submitTest(auto = false) {
    if (!test) return;
    if (!auto) {
      const unanswered = test.questions.length - Object.keys(answers).length;
      if (unanswered > 0 && !window.confirm(`${unanswered} question${unanswered > 1 ? "s" : ""} unanswered. Submit anyway?`)) return;
    }
    clearInterval(timerRef.current!);
    setPhase("submitting");
    try {
      const res = await fetch(`/api/mock-tests/${testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const j = await res.json();
      if (j.success) { setResult(j.result); setPhase("result"); setResultTab("summary"); }
      else { alert("Submission failed. Please try again."); setPhase("test"); }
    } catch { alert("Network error."); setPhase("test"); }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!test && !loadError) {
    return (
      <>
        <SiteNav />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-red-600" />
          <p className="text-sm text-slate-500">Loading test…</p>
        </div>
        <SiteFooter />
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <SiteNav />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-400" />
          <p className="text-base font-semibold text-slate-700">{loadError}</p>
          <Link href="/mock-test" className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
            <ArrowLeft className="h-4 w-4" /> Back to Tests
          </Link>
        </div>
        <SiteFooter />
      </>
    );
  }

  // ── Instructions ──────────────────────────────────────────────────────────────
  if (phase === "instructions") {
    return (
      <>
        <SiteNav />
        <div className="min-h-screen bg-slate-50">
          {/* Breadcrumb */}
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-3xl px-6 py-3 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/mock-test" className="hover:text-red-600 transition-colors">Mock Tests</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-800 font-medium truncate">{test!.title}</span>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 py-10">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

              {/* Header */}
              <div className="bg-[#1F3354] px-8 py-8 text-white">
                <span className="inline-block rounded-md bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 mb-3">
                  {test!.subject}
                </span>
                <h1 className="text-2xl font-black leading-tight">{test!.title}</h1>
                <p className="mt-2 text-sm text-slate-300 max-w-lg">{test!.description}</p>
              </div>

              <div className="px-8 py-7">
                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                  {[
                    { icon: Clock, label: "Duration", value: `${test!.duration} min` },
                    { icon: HelpCircle, label: "Questions", value: test!.questions.length },
                    { icon: Target, label: "Total Marks", value: test!.totalMarks },
                    { icon: Trophy, label: "Pass Mark", value: test!.passingMarks },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <s.icon className="h-4 w-4 text-red-600" />
                      <p className="text-xl font-black text-slate-800">{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Rules */}
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Instructions</p>
                  <div className="space-y-2.5">
                    {[
                      "Each question has 4 answer choices — select the one you think is correct.",
                      "Use the question navigator to jump between questions.",
                      "The timer starts immediately when you click Start Test.",
                      "The test submits automatically when time expires.",
                      "Correct answers and explanations are shown after submission.",
                    ].map((r, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600 mt-0.5">
                          {i + 1}
                        </span>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                {test!.questions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
                    <HelpCircle className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-sm text-slate-400">No questions have been added to this test yet.</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startTest}
                    className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Start Test →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  // ── Test in progress ──────────────────────────────────────────────────────────
  if (phase === "test") {
    const q = test!.questions[currentQ];
    const total = test!.questions.length;
    const answered = Object.keys(answers).length;
    const warn = timeLeft <= 60;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <ClipboardList className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-800 truncate">{test!.title}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">Progress</span>
                <span className="text-xs font-bold text-slate-700">{answered}/{total} answered</span>
              </div>
              <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums ${
                warn ? "bg-red-100 text-red-700 animate-pulse" : "bg-slate-100 text-slate-700"
              }`}>
                <Clock className="h-3.5 w-3.5" />
                {fmt(timeLeft)}
              </div>
            </div>
          </div>
          {/* Progress fill */}
          <div className="h-0.5 bg-slate-100">
            <div
              className="h-full bg-red-600 transition-all duration-500"
              style={{ width: `${((currentQ + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 py-8">
          <div className="mx-auto max-w-3xl px-4 space-y-5">

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-semibold text-slate-500">
                  Question <span className="text-slate-800">{currentQ + 1}</span> of {total}
                </span>
                <span className="text-xs font-semibold text-[#1F3354] bg-[#1F3354]/8 px-2.5 py-1 rounded-md">
                  {q.marks} {q.marks === 1 ? "mark" : "marks"}
                </span>
              </div>

              <div className="px-6 py-6">
                <p className="text-base font-semibold leading-relaxed text-slate-800">{q.questionText}</p>

                <div className="mt-6 space-y-2.5">
                  {q.options.map((opt, i) => {
                    const sel = answers[q.id] === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [q.id]: i })}
                        className={`w-full flex items-center gap-4 rounded-xl border text-left px-4 py-3.5 text-sm transition-all ${
                          sel
                            ? "border-red-500 bg-red-50 text-red-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          sel ? "bg-red-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {sel && <CheckCircle2 className="h-4 w-4 shrink-0 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigator */}
            <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Question Navigator</p>
              <div className="flex flex-wrap gap-1.5">
                {test!.questions.map((qq, i) => {
                  const isAnswered = answers[qq.id] !== undefined;
                  const isCurrent = i === currentQ;
                  return (
                    <button
                      key={qq.id}
                      type="button"
                      onClick={() => setCurrentQ(i)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-[#1F3354] text-white ring-2 ring-[#1F3354]/30 ring-offset-1"
                          : isAnswered
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#1F3354] inline-block" /> Current</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500 inline-block" /> Answered ({answered})</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-slate-200 inline-block" /> Skipped ({total - answered})</span>
              </div>
            </div>

            {/* Prev / Next / Submit */}
            <div className="flex items-center justify-between gap-3 pb-10">
              <button
                type="button"
                onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                disabled={currentQ === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              {currentQ < total - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQ((p) => Math.min(total - 1, p + 1))}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1F3354] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#25406a] transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submitTest(false)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
                >
                  <Send className="h-4 w-4" /> Submit Test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Submitting ────────────────────────────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <>
        <SiteNav />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-red-600" />
          <p className="text-sm font-medium text-slate-600">Evaluating your answers…</p>
        </div>
        <SiteFooter />
      </>
    );
  }

  // ── Result ────────────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const pct = result.percentage;
    const circ = 2 * Math.PI * 40;
    const offset = circ - (pct / 100) * circ;

    return (
      <>
        <SiteNav />
        <div className="min-h-screen bg-slate-50 py-10">
          <div className="mx-auto max-w-3xl px-4 space-y-5">

            {/* Result banner */}
            <div className={`rounded-2xl overflow-hidden shadow-sm ${result.passed ? "bg-emerald-600" : "bg-[#1F3354]"}`}>
              <div className="px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
                <div>
                  <p className="text-sm font-semibold opacity-75 mb-1">{test!.title}</p>
                  <h2 className="text-3xl font-black">
                    {result.passed ? "Well Done!" : "Keep Going!"}
                  </h2>
                  <p className="mt-1 text-sm opacity-80">
                    {result.passed
                      ? `You passed with ${pct}% — great work.`
                      : `You scored ${pct}%. You need ${result.passingMarks} to pass.`}
                  </p>
                </div>
                {/* SVG ring */}
                <div className="relative h-28 w-28 shrink-0">
                  <svg className="-rotate-90 absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="9"
                      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{pct}%</span>
                    <span className="text-[11px] opacity-75">{result.score}/{result.totalMarks}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Score", val: `${result.score}/${result.totalMarks}`, col: "text-slate-800" },
                { label: "Correct", val: result.correct, col: "text-emerald-600" },
                { label: "Wrong", val: result.attempted - result.correct, col: "text-red-600" },
                { label: "Skipped", val: result.totalQuestions - result.attempted, col: "text-slate-500" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className={`text-2xl font-black ${s.col}`}>{s.val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {(["summary", "review"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setResultTab(tab)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    resultTab === tab ? "bg-[#1F3354] text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab === "summary" ? "Summary" : `Review Answers (${result.breakdown.length})`}
                </button>
              ))}
            </div>

            {resultTab === "summary" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-800">Performance Breakdown</h3>
                {[
                  { label: "Your Score", value: result.score, max: result.totalMarks, color: result.passed ? "bg-emerald-500" : "bg-red-500" },
                  { label: "Passing Mark", value: result.passingMarks, max: result.totalMarks, color: "bg-amber-400" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>{bar.label}</span>
                      <span className="font-semibold text-slate-700">{bar.value}/{bar.max}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color}`}
                        style={{ width: `${bar.max > 0 ? (bar.value / bar.max) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="rounded-xl bg-emerald-50 p-4 text-center">
                    <p className="text-2xl font-black text-emerald-600">{result.correct}</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Correct</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-4 text-center">
                    <p className="text-2xl font-black text-red-600">{result.attempted - result.correct}</p>
                    <p className="text-xs text-red-700 mt-0.5">Wrong</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4 text-center">
                    <p className="text-2xl font-black text-slate-600">{result.totalQuestions - result.attempted}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Skipped</p>
                  </div>
                </div>
              </div>
            )}

            {resultTab === "review" && (
              <div className="space-y-3">
                {result.breakdown.map((item, idx) => (
                  <ReviewCard key={item.questionId} item={item} index={idx} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pb-10">
              <button
                type="button"
                onClick={() => { setResult(null); setAnswers({}); setCurrentQ(0); setPhase("instructions"); }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-[#1F3354] px-5 py-3 text-sm font-bold text-[#1F3354] hover:bg-[#1F3354] hover:text-white transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Retake Test
              </button>
              <Link
                href="/mock-test"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> All Mock Tests
              </Link>
            </div>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  return null;
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ item, index }: { item: BreakdownItem; index: number }) {
  const labels = ["A", "B", "C", "D"];
  const skipped = item.selectedOption === -1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Status strip */}
      <div className={`flex items-center justify-between px-5 py-2.5 text-xs font-semibold ${
        skipped ? "bg-slate-50 text-slate-500 border-b border-slate-100"
          : item.isCorrect ? "bg-emerald-50 text-emerald-700 border-b border-emerald-100"
          : "bg-red-50 text-red-700 border-b border-red-100"
      }`}>
        <span className="flex items-center gap-1.5">
          {skipped ? <Circle className="h-3.5 w-3.5" />
            : item.isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" />
            : <XCircle className="h-3.5 w-3.5" />}
          Q{index + 1} — {skipped ? "Skipped" : item.isCorrect ? "Correct" : "Incorrect"}
        </span>
        <span>{item.marks} {item.marks === 1 ? "mark" : "marks"}</span>
      </div>

      <div className="px-5 py-5">
        <p className="text-sm font-semibold leading-relaxed text-slate-800 mb-4">{item.questionText}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {item.options.map((opt, i) => {
            const correct = i === item.correctOption;
            const wrongPick = i === item.selectedOption && !correct;
            return (
              <div key={i} className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-xs ${
                correct ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : wrongPick ? "border-red-200 bg-red-50 text-red-800"
                  : "border-slate-100 bg-slate-50 text-slate-600"
              }`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                  correct ? "bg-emerald-500 text-white"
                    : wrongPick ? "bg-red-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}>{labels[i]}</span>
                <span className="flex-1 leading-snug">{opt}</span>
                {correct && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
                {wrongPick && <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />}
              </div>
            );
          })}
        </div>

        {item.explanation && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Explanation: </span>{item.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
