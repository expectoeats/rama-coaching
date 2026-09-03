"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Target,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Monitor,
  FileCheck,
  Code2,
  Globe,
  Smartphone,
  Layers,
} from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import type { MockTest } from "@/data/types";

const HERO_BG = "https://i0.wp.com/gyanxp.com/wp-content/uploads/2025/02/page-banner-1.webp?fit=1523%2C269&ssl=1";
const CHECK_ICON = "https://gyanxp.com/wp-content/themes/gyanxp/assets/img/Check%20Mark.png";
const CHOOSE_US_IMG = "https://gyanxp.com/wp-content/themes/gyanxp/assets/img/choose-us.svg";

export default function MockTestListPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mock-tests?public=1&limit=50", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setTests(j.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const groupedBySubject = useMemo(() => {
    const map = new Map<string, MockTest[]>();
    for (const t of tests) {
      const key = (t.subject || "General").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).map(([subject, items]) => ({ subject, items }));
  }, [tests]);

  return (
    <>
      <SiteNav />

      {/* ── HERO — pure banner image, no overlay, text on right side ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-6">
        <div
          className="relative overflow-hidden rounded-2xl border border-[#DED8C9] shadow-sm"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* decorative corner borders like reference */}
          <span className="pointer-events-none absolute left-3 top-3 h-28 w-28 rounded-tl-2xl border-l-2 border-t-2 border-white/90 hidden sm:block" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-20 w-36 rounded-br-2xl border-b-2 border-r-2 border-white/90 hidden sm:block" />

          <div className="relative flex items-center justify-end px-4 sm:px-6 lg:px-10 py-10 sm:py-12 min-h-[170px]">
            {/* text pushed to right side */}
            <div className="w-full sm:w-auto sm:ml-auto max-w-[640px] text-left sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black tracking-wide text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                ONLINE TEST
              </h1>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-white text-xs sm:text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                <span className="flex items-center gap-2">
                  <img src={CHECK_ICON} alt="" className="h-5 w-5 shrink-0" />
                  Recorded Classes
                </span>
                <span className="flex items-center gap-2">
                  <img src={CHECK_ICON} alt="" className="h-5 w-5 shrink-0" />
                  Full length Mock Tests and Quizes
                </span>
                <span className="flex items-center gap-2">
                  <img src={CHECK_ICON} alt="" className="h-5 w-5 shrink-0" />
                  100% Core Content &amp; Relevant Lectures to cover full syllabus
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE EXAMS BY SUBJECT — only admin-created active exams ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#DED8C9] bg-white p-5 sm:p-6 shadow-sm">
                <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((__, j) => (
                    <div key={j} className="animate-pulse rounded-xl border-2 border-[#DED8C9] bg-slate-50 p-4 h-36" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groupedBySubject.length === 0 ? (
          <div className="rounded-2xl border border-[#DED8C9] bg-white p-10 text-center shadow-sm">
            <ClipboardList className="h-10 w-10 text-[#DED8C9] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#5C574C]">No active exams yet</p>
            <p className="text-xs text-[#5C574C]/60 mt-1">Admin panel se exam create karne par yahan show hoga</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupedBySubject.map(({ subject, items }) => (
              <div key={subject} className="rounded-2xl border border-[#DED8C9] bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-[15px] font-black tracking-wide text-[#23211C] uppercase">{subject}</h2>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.slice(0, 6).map((t, idx) => (
                    <MiniCard key={t.id} icon={getIconForTest(t, idx)} title={shortTitle(t)} href={`/mock-test/${t.id}`} />
                  ))}
                </div>
                {items.length > 6 && (
                  <div className="mt-6 flex justify-center">
                    <a
                      href="#tests"
                      className="inline-flex min-w-[150px] justify-center rounded-md bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-6 py-2.5 transition-colors shadow-sm"
                    >
                      View All
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Your Path to Exam Excellence ── */}
      <section className="bg-white border-y border-[#DED8C9] mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#23211C] leading-tight">
                Your Path to Exam Excellence Starts Here
              </h2>
              <p className="mt-4 text-sm sm:text-[14.5px] leading-7 text-[#5C574C]">
                We&apos;re dedicated to making exam prep efficient, engaging, and effective. Our platform offers expertly curated study
                materials, interactive practice questions, and personalized learning paths tailored to your strengths and areas for
                improvement. With real-time progress tracking, detailed explanations, and 24/7 support, we empower you to study smarter,
                not harder. Join thousands of successful students who trust us to boost their confidence, sharpen their skills, and
                achieve top scores on their exams. Choose us for a seamless path to success!
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 ml-1 align-middle rounded-full bg-[#1F3354] hover:bg-[#16233B] text-white text-xs font-semibold px-3 py-1.5 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  CCC Video Lecture
                </Link>
              </p>
            </div>
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <img src={CHOOSE_US_IMG} alt="Students studying" className="w-full max-w-[420px] object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works strip ── */}
      <section className="border-b border-[#DED8C9] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#DED8C9]">
            {[
              { n: "1", title: "Pick a Test", desc: "Choose from our curated subject-wise mock tests." },
              { n: "2", title: "Answer Questions", desc: "Select from 4 options per question within the time limit." },
              { n: "3", title: "See Your Score", desc: "Get instant results with correct answers and explanations." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3 px-6 py-4 sm:py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b91c1c] text-xs font-medium text-white mt-0.5">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#23211C]">{s.title}</p>
                  <p className="mt-0.5 text-xs text-[#5C574C] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Mock Tests Listing ── */}
      <section id="tests" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c] mb-1">Start Practising</p>
              <h2 className="text-2xl lg:text-3xl font-black text-[#23211C]">Available Mock Tests</h2>
            </div>
            {tests.length > 0 && (
              <span className="text-sm text-[#5C574C] shrink-0">
                {tests.length} test{tests.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-[#DED8C9] bg-white p-6 h-64" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#DED8C9] bg-white py-20 text-center">
              <ClipboardList className="h-12 w-12 text-[#DED8C9]" />
              <p className="text-lg font-semibold text-[#5C574C]">No tests available yet</p>
              <p className="text-sm text-[#5C574C]/70">Check back soon — new tests are added regularly.</p>
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

function MiniCard({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-white bg-[#FBEFE6]/90 p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:bg-white transition-all min-h-[132px]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-[#DED8C9]/50">
        {icon}
      </div>
      <span className="text-[13px] font-semibold leading-tight text-[#2563EB] group-hover:text-[#1F3354] line-clamp-2">
        {title}
      </span>
    </Link>
  );
}

function shortTitle(t: MockTest) {
  if (t.title.length > 32) return t.title.slice(0, 32) + "…";
  return t.title;
}

function getIconForTest(t: MockTest, idx: number) {
  const s = t.subject.toLowerCase() + " " + t.title.toLowerCase();
  if (s.includes("ccc") && s.includes("100")) return <Monitor className="h-8 w-8 text-[#1F3354]" />;
  if (s.includes("ccc")) return <FileCheck className="h-8 w-8 text-[#9A7B3F]" />;
  if (s.includes("m1") || s.includes("it tools")) return <Monitor className="h-8 w-8 text-[#1F3354]" />;
  if (s.includes("m2") || s.includes("web")) return <Globe className="h-8 w-8 text-[#1A7F64]" />;
  if (s.includes("m3") || s.includes("python")) return <Code2 className="h-8 w-8 text-[#1F3354]" />;
  if (s.includes("m4") || s.includes("iot")) return <Smartphone className="h-8 w-8 text-[#b91c1c]" />;
  const fallback = [<Layers key="0" className="h-8 w-8 text-[#1F3354]" />, <BookOpen key="1" className="h-8 w-8 text-[#9A7B3F]" />, <FileCheck key="2" className="h-8 w-8 text-[#1F3354]" />];
  return fallback[idx % fallback.length];
}

function TestCard({ test }: { test: MockTest }) {
  const qCount = test.questions?.length ?? 0;
  const canStart = qCount > 0;
  const passPercent = test.totalMarks > 0 ? Math.round((test.passingMarks / test.totalMarks) * 100) : 0;

  return (
    <div className="group flex flex-col rounded-xl bg-white border border-[#DED8C9] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="bg-[#1F3354] px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/80">
          <BookOpen className="h-3 w-3" />
          {test.subject}
        </span>
        <h3 className="mt-2 text-sm font-semibold text-white leading-snug line-clamp-2">{test.title}</h3>
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        <p className="text-sm text-[#5C574C] leading-relaxed line-clamp-2">{test.description}</p>

        <div className="mt-4 flex items-center gap-5 text-xs text-[#5C574C]">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#9A7B3F]" />
            {test.duration} min
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-[#9A7B3F]" />
            {qCount} {qCount === 1 ? "question" : "questions"}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-[#9A7B3F]" />
            {test.totalMarks} marks
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-[#5C574C] mb-1.5">
            <span>Passing score</span>
            <span className="font-semibold text-[#23211C]">
              {test.passingMarks}/{test.totalMarks}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-[#9A7B3F]" style={{ width: `${passPercent}%` }} />
          </div>
        </div>

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
            <div className="flex items-center justify-center w-full rounded border border-dashed border-[#DED8C9] px-4 py-2.5 text-sm text-[#5C574C]/60">
              Questions coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
