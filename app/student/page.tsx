"use client";
import { useEffect, useState } from "react";
import { Award, FileText, Eye, Printer, User, BookOpen, Calendar } from "lucide-react";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import type { CertificateData } from "@/types/certificate";
import { SAMPLE_CERTIFICATE, DEFAULT_SUBJECTS } from "@/lib/defaults";
import { Modal } from "@/components/ui/Modal";

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [certs, setCerts] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<CertificateData | null>(null);

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
        const cJ = await cRes.json();
        const mJ = await mRes.json();
        if (meJ.success) setStudent(meJ.data);
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-deep to-navy p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {student?.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-white/30" /> : <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{student?.fullName?.split(" ").map((p:string)=>p[0]).slice(0,2).join("")}</div>}
        <div className="flex-1">
          <h1 className="text-xl font-bold">Welcome, {student?.fullName}</h1>
          <p className="text-sm text-white/80 mt-1">{student?.rollNumber} • {student?.course} • {student?.batch}</p>
          <p className="text-xs text-white/60 mt-1">{student?.email} • {student?.phone}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-lg">
          <BookOpen className="w-4 h-4" /> {student?.course}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-slate-200 p-5"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Award className="w-5 h-5" /></span><div><p className="text-2xl font-bold text-slate-800">{certs.length}</p><p className="text-xs text-slate-500">Certificates</p></div></div></div>
        <div className="rounded-xl bg-white border border-slate-200 p-5"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FileText className="w-5 h-5" /></span><div><p className="text-2xl font-bold text-slate-800">{marks.length}</p><p className="text-xs text-slate-500">Marksheets</p></div></div></div>
        <div className="rounded-xl bg-white border border-slate-200 p-5 col-span-2 sm:col-span-1"><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><User className="w-5 h-5" /></span><div><p className="text-sm font-semibold text-slate-800">Status</p><p className="text-xs text-emerald-600 font-medium capitalize">{student?.status}</p></div></div></div>
      </div>

      {/* Certificates */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><h3 className="font-semibold text-slate-800 flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> My Certificates</h3><span className="text-xs text-slate-500">{certs.filter((c:any)=>c.isSentToStudent).length} sent • {certs.filter((c:any)=>!c.isSentToStudent).length} pending</span></div>
        {certs.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">No certificates yet. Contact admin.</p> : (
          <div className="divide-y divide-slate-100">
            {certs.map((c) => (
              <div key={c.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${!c.isSentToStudent ? "bg-amber-50/40" : ""}`}>
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.isSentToStudent ? "bg-amber-50 text-amber-600" : "bg-amber-100 text-amber-700 border border-amber-200"}`}><Award className="w-5 h-5" /></span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{c.courseName} — {c.certificateNumber}</p><p className="text-xs text-slate-500 flex items-center gap-2"><Calendar className="w-3 h-3" />{c.issueDate} • {c.status} {c.isSentToStudent ? <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Sent</span> : <span className="ml-2 bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Pending</span>}</p></div>
                <button onClick={()=>setPreview(toPreview(c))} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"><Eye className="w-3.5 h-3.5" /> View</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marksheets */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> My Marksheets</h3><span className="text-xs text-slate-500">{marks.filter((m:any)=>m.isSentToStudent).length} sent • {marks.filter((m:any)=>!m.isSentToStudent).length} pending</span></div>
        {marks.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">No marksheets yet.</p> : (
          <div className="divide-y divide-slate-100">
            {marks.map((m) => (
              <div key={m.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${!m.isSentToStudent ? "bg-blue-50/40" : ""}`}>
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.isSentToStudent ? "bg-blue-50 text-blue-600" : "bg-amber-100 text-amber-700 border border-amber-200"}`}><FileText className="w-5 h-5" /></span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{m.courseName} — {m.certificateNumber}</p><p className="text-xs text-slate-500 flex items-center gap-2"><Calendar className="w-3 h-3" />{m.issueDate} • {m.status} {m.isSentToStudent ? <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Sent</span> : <span className="ml-2 bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Pending</span>}</p></div>
                <button onClick={()=>setPreview(toPreview(m))} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"><Eye className="w-3.5 h-3.5" /> View</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!preview} onClose={()=>setPreview(null)} title="Document Preview" size="xl">
        {preview && (
          <>
            {/* Fixed 70vh container with inner scroll so full doc is reachable */}
            <div style={{ height: "70vh", overflowY: "auto", overflowX: "hidden" }}>
              <CertificatePreview data={preview} />
            </div>
            <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
