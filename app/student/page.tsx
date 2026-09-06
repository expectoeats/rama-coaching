"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award, FileText, Eye, Printer, User, BookOpen, Calendar,
  NotebookText, ClipboardList, Clock, HelpCircle, ArrowRight,
  Lock, ChevronRight, Globe,
} from "lucide-react";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import type { CertificateData } from "@/types/certificate";
import { SAMPLE_CERTIFICATE, DEFAULT_SUBJECTS } from "@/lib/defaults";
import { Modal } from "@/components/ui/Modal";
import type { MockTest } from "@/data/types";
import { printCertificateDirectly } from "@/lib/printUtils";

interface ENote {
  id: string; title: string; description: string;
  courseCategory: string; accessType: string; fileUrl: string; content: string;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [certs,   setCerts]   = useState<any[]>([]);
  const [marks,   setMarks]   = useState<any[]>([]);
  const [tests,   setTests]   = useState<MockTest[]>([]);
  const [enotes,  setEnotes]  = useState<ENote[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<CertificateData | null>(null);
  const [activeSection, setActiveSection] = useState<"certs" | "marks" | "tests" | "notes">("certs");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [meRes, cRes, mRes] = await Promise.all([
          fetch("/api/student/me", { cache: "no-store" }),
          fetch("/api/student/certificates?type=excellence", { cache: "no-store" }),
          fetch("/api/student/certificates?type=marksheet", { cache: "no-store" }),
        ]);
        const meJ = await meRes.json();
        const cJ  = await cRes.json();
        const mJ  = await mRes.json();
        if (meJ.success) {
          setStudent(meJ.data);
          const courseName = meJ.data?.course || meJ.data?.courseName || "";
          const [tRes, nRes] = await Promise.all([
            fetch(`/api/mock-tests?public=1&limit=20&category=${encodeURIComponent(courseName)}`, { cache: "no-store" }).then(r => r.json()),
            // Use authenticated student enotes API — shows enrolled + free notes
            fetch(`/api/student/enotes`, { cache: "no-store" }).then(r => r.json()),
          ]);
          if (tRes.success) setTests(tRes.data);
          if (nRes.success) setEnotes(nRes.data);
        }
        if (cJ.success) setCerts(cJ.data);
        if (mJ.success) setMarks(mJ.data);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  function toPreview(rec: any): CertificateData {
    const docType = rec.type || rec.documentType || "excellence";
    return {
      ...SAMPLE_CERTIFICATE,
      subjects: (rec.subjects?.length ? rec.subjects : DEFAULT_SUBJECTS).map((s: any) => ({ ...s })),
      documentType: docType,
      certificateNumber: rec.certificateNumber || "",
      studentName: student?.fullName || rec.studentName || "",
      fatherName: rec.fatherName || "",
      motherName: rec.motherName || student?.motherName || "",
      rollNo: rec.rollNo || student?.rollNumber || rec.rollNumber || "",
      enrollmentNo: rec.enrollmentNo || student?.rollNumber || "",
      courseName: rec.courseName || student?.course || "",
      courseCode: rec.courseCode || "",
      centerCode: rec.centerCode || "",
      performance: rec.performance || "",
      courseDuration: rec.courseDuration || "",
      photoUrl: student?.photoUrl || "",
      slNo: rec.slNo || rec.certificateNumber?.slice(-3) || "001",
      trainingCenter: rec.trainingCenter || "Rama Coaching Center, Main Branch",
      completionDate: rec.completionDate
        ? new Date(rec.completionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : rec.issueDate || "",
      dated: rec.dated || rec.issueDate || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      place: rec.place || "Fatehpur",
    };
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const SECTIONS = [
    { id: "certs",  label: "Certificates", icon: Award,         count: certs.length,  color: "text-amber-600" },
    { id: "marks",  label: "Marksheets",   icon: FileText,      count: marks.length,  color: "text-blue-600"  },
    { id: "tests",  label: "Mock Tests",   icon: ClipboardList, count: tests.length,  color: "text-red-600"   },
    { id: "notes",  label: "E-Notes",      icon: NotebookText,  count: enotes.length, color: "text-violet-600"},
  ] as const;

  return (
    <div className="space-y-6">

      {/* ── Welcome card ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-deep to-navy p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {student?.photoUrl
          ? <img src={student.photoUrl} alt={student.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
          : <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{student?.fullName?.split(" ").map((p:string) => p[0]).slice(0,2).join("")}</div>}
        <div className="flex-1">
          <h1 className="text-xl font-bold">Welcome, {student?.fullName}</h1>
          <p className="text-sm text-white/80 mt-1">{student?.rollNumber} • {student?.course} • {student?.batch}</p>
          <p className="text-xs text-white/60 mt-1">{student?.email} • {student?.phone}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-lg">
          <BookOpen className="w-4 h-4" /> {student?.course}
        </div>
      </div>

      {/* ── Section tabs + counts ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SECTIONS.map(s => (
          <button key={s.id} type="button" onClick={() => setActiveSection(s.id as any)}
            className={`rounded-xl border p-4 text-left transition-all ${activeSection === s.id ? "border-navy bg-navy text-white shadow-md" : "bg-white border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${activeSection === s.id ? "text-white" : s.color}`} />
              <span className={`text-xs font-medium ${activeSection === s.id ? "text-white/80" : "text-slate-500"}`}>{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${activeSection === s.id ? "text-white" : "text-slate-800"}`}>{s.count}</p>
          </button>
        ))}
      </div>

      {/* ── Certificates ─────────────────────────────────────────────── */}
      {activeSection === "certs" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> My Certificates</h3>
            <span className="text-xs text-slate-500">{certs.filter((c:any) => c.isSentToStudent).length} sent</span>
          </div>
          {certs.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">No certificates yet. Contact admin.</p> : (
            <div className="divide-y divide-slate-100">
              {certs.map((c) => (
                <div key={c.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${!c.isSentToStudent ? "bg-amber-50/40" : ""}`}>
                  <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.isSentToStudent ? "bg-amber-50 text-amber-600" : "bg-amber-100 text-amber-700 border border-amber-200"}`}><Award className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.courseName} — {c.certificateNumber}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2"><Calendar className="w-3 h-3" />{c.issueDate} • {c.status}
                      {c.isSentToStudent ? <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Sent</span>
                        : <span className="ml-2 bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Pending</span>}
                    </p>
                  </div>
                  <button onClick={() => setPreview(toPreview(c))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Marksheets ───────────────────────────────────────────────── */}
      {activeSection === "marks" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> My Marksheets</h3>
            <span className="text-xs text-slate-500">{marks.filter((m:any) => m.isSentToStudent).length} sent</span>
          </div>
          {marks.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">No marksheets yet.</p> : (
            <div className="divide-y divide-slate-100">
              {marks.map((m) => (
                <div key={m.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${!m.isSentToStudent ? "bg-blue-50/40" : ""}`}>
                  <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.isSentToStudent ? "bg-blue-50 text-blue-600" : "bg-amber-100 text-amber-700 border border-amber-200"}`}><FileText className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{m.courseName} — {m.certificateNumber}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2"><Calendar className="w-3 h-3" />{m.issueDate} • {m.status}
                      {m.isSentToStudent ? <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Sent</span>
                        : <span className="ml-2 bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Pending</span>}
                    </p>
                  </div>
                  <button onClick={() => setPreview(toPreview(m))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Mock Tests ───────────────────────────────────────────────── */}
      {activeSection === "tests" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-red-600" />
              Mock Tests — {student?.course}
            </h3>
            <Link href="/mock-test" className="text-xs text-red-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {tests.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-3">No mock tests for {student?.course} yet.</p>
              <Link href="/mock-test" className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline">
                Browse all tests <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tests.map(t => {
                const qCount = t.questions?.length ?? 0;
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}m</span>
                        <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" />{qCount} questions</span>
                      </p>
                    </div>
                    {qCount > 0 ? (
                      <Link href={`/mock-test/${t.id}`}
                        className="shrink-0 inline-flex items-center gap-1 rounded border border-[#1F3354] px-3 py-1.5 text-xs text-[#1F3354] hover:bg-[#1F3354] hover:text-white transition-colors">
                        Start <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">Coming soon</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── E-Notes ──────────────────────────────────────────────────── */}
      {activeSection === "notes" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <NotebookText className="w-4 h-4 text-violet-600" />
              Study Notes — {student?.course}
            </h3>
            <span className="text-xs text-slate-500">{enotes.length} resources</span>
          </div>
          {enotes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <NotebookText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No study notes for {student?.course} yet.</p>
              <p className="text-xs text-slate-400 mt-1">Check back soon — we add new material regularly.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {enotes.map(n => (
                <div key={n.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${n.accessType === "free" ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                    {n.accessType === "free" ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.description}</p>
                    <span className={`inline-block mt-1 text-[10px] rounded-full px-2 py-0.5 font-semibold ${n.accessType === "free" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                      {n.accessType === "free" ? "Free" : "Enrolled"}
                    </span>
                  </div>
                  {n.fileUrl ? (
                    <a href={n.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 rounded border border-violet-200 px-3 py-1.5 text-xs text-violet-700 hover:bg-violet-600 hover:text-white transition-colors">
                      Open <ArrowRight className="w-3 h-3" />
                    </a>
                  ) : n.content ? (
                    <span className="shrink-0 text-xs text-slate-400">Inline note</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificate/Marksheet preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Document Preview" size="xl">
        {preview && (
          <>
            <div style={{ height: "70vh", overflowY: "auto", overflowX: "hidden" }}>
              <CertificatePreview data={preview} hideToolbar />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-500">
                Single-page A4 format ready for printing or saving as PDF
              </span>
              <button
                type="button"
                onClick={() => {
                  const docName = `RCCACE_${preview.documentType === "marksheet" ? "Marksheet" : "Certificate"}_${preview.studentName?.replace(/\s+/g, "_") || "Student"}`;
                  printCertificateDirectly(docName);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
