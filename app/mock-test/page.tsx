"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Target,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import type { MockTest } from "@/data/types";

export default function MockTestListPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mock-tests?public=1&limit=50", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { if (j.success) setTests(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SiteNav />

      {/* ── Hero — banner image with right-side overlay ──────────────────────── */}
      <section className="relative w-full">
        <img
          src="/test-bg.png"
          alt="Free Mock Test"
          className="w-full object-cover"
        />
        {/* Right-side overlay — semi-transparent card over the device/quiz area */}
        <div className="absolute inset-y-0 right-0 flex w-[46%] items-center justify-center px-6 lg:px-14">
          <div className="w-full rounded-xl border border-white/20 bg-black/40 px-6 py-7 text-right backdrop-blur-sm shadow-lg lg:px-8 lg:py-9">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/50 mb-2 hidden sm:block">
              Rama Coaching Centre
            </p>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white leading-snug">
              Test Yourself.<br />
              <span className="text-yellow-400">Know Where You Stand.</span>
            </h2>
            <p className="mt-3 text-[11px] sm:text-sm text-white/70 leading-relaxed hidden sm:block">
              Free mock tests · Real exam patterns<br />
              No registration · No fees
            </p>
            <div className="mt-5 flex justify-end">
              <a
                href="#tests"
                className="inline-flex items-center gap-2 rounded bg-red-600 hover:bg-red-700 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors"
              >
                Browse Tests →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works — compact strip ─────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {[
              { n: "1", title: "Pick a Test", desc: "Choose from our curated subject-wise mock tests." },
              { n: "2", title: "Answer Questions", desc: "Select from 4 options per question within the time limit." },
              { n: "3", title: "See Your Score", desc: "Get instant results with correct answers and explanations." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4 px-6 py-4 sm:py-2 first:pl-0 last:pr-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{s.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Test Listing ──────────────────────────────────────────────────────── */}
      <section id="tests" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-1">Start Practising</p>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900">Available Mock Tests</h2>
            </div>
            {tests.length > 0 && (
              <span className="text-sm text-slate-500 shrink-0">{tests.length} test{tests.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-6 h-64" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
              <ClipboardList className="h-12 w-12 text-slate-300" />
              <p className="text-lg font-semibold text-slate-500">No tests available yet</p>
              <p className="text-sm text-slate-400">Check back soon — new tests are added regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

// ─── Test Card — clean & professional ────────────────────────────────────────
function TestCard({ test }: { test: MockTest }) {
  const qCount = test.questions?.length ?? 0;
  const canStart = qCount > 0;
  const passPercent = test.totalMarks > 0
    ? Math.round((test.passingMarks / test.totalMarks) * 100)
    : 0;

  return (
    <div className="group flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

      {/* Card header */}
      <div className="bg-[#1F3354] px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/70">
          <BookOpen className="h-3 w-3" />
          {test.subject}
        </span>
        <h3 className="mt-2 text-sm font-semibold text-white leading-snug line-clamp-2">
          {test.title}
        </h3>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {test.description}
        </p>

        {/* Meta row */}
        <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {test.duration} min
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            {qCount} {qCount === 1 ? "question" : "questions"}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-slate-400" />
            {test.totalMarks} marks
          </span>
        </div>

        {/* Pass score bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Passing score</span>
            <span className="font-semibold text-slate-600">{test.passingMarks}/{test.totalMarks}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${passPercent}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5">
          {canStart ? (
            <Link
              href={`/mock-test/${test.id}`}
              className="flex items-center justify-between w-full rounded border border-[#1F3354] bg-white px-4 py-2.5 text-sm text-[#1F3354] hover:bg-[#1F3354] hover:text-white transition-colors group/btn"
            >
              <span>Start Test</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          ) : (
            <div className="flex items-center justify-center w-full rounded border border-dashed border-slate-200 px-4 py-2.5 text-sm text-slate-400">
              Questions coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
