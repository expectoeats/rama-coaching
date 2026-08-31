"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Plus,
  Eye,
  RefreshCw,
  Trash2,
  FilePlus2,
  Search,
  Printer,
} from "lucide-react";
import { certificates as seedCertificates } from "@/data/certificates";
import type { CertificateRecord } from "@/data/types";
import { students } from "@/data/students";
import type { Student } from "@/data/types";
import type { CertificateType } from "@/data/types";
import type { CertificateData } from "@/types/certificate";
import { SAMPLE_CERTIFICATE, DEFAULT_SUBJECTS } from "@/lib/defaults";
import { CertificateForm } from "@/components/forms/CertificateForm";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/PageHeader";
import { SearchInput, SelectInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Spinner } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { certificateStatusVariant, titleCase } from "@/lib/status";

const PAGE_SIZE = 6;

function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildCertData(
  student: Student | undefined,
  type: CertificateType,
  certNumber: string
): CertificateData {
  const base: CertificateData = {
    ...SAMPLE_CERTIFICATE,
    subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s })),
  };
  const today = todayLabel();
  if (!student) {
    return {
      ...base,
      documentType: type,
      rollNo: certNumber,
      slNo: (certNumber.match(/\d+/g)?.pop() ?? "001").padStart(3, "0"),
      dated: today,
      completionDate: today,
    };
  }
  return {
    ...base,
    documentType: type,
    studentName: student.fullName,
    rollNo: student.rollNumber,
    enrollmentNo: student.id.toUpperCase(),
    courseName: student.course.toUpperCase(),
    courseCode: student.course.replace(/\s+/g, "").toUpperCase() + "-2026",
    slNo: student.rollNumber.replace(/\D/g, "").slice(-3).padStart(3, "0") || "001",
    trainingCenter: "Rama Coaching Center, Main Branch",
    centerCode: "RCC-001",
    completionDate: today,
    dated: today,
    place: "Fatehpur",
  };
}

function recordToCertData(rec: CertificateRecord): CertificateData {
  const student = students.find((s) => s.rollNumber === rec.rollNumber);
  if (student) return buildCertData(student, rec.type, rec.certificateNumber);
  const base: CertificateData = {
    ...SAMPLE_CERTIFICATE,
    subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s })),
  };
  return {
    ...base,
    documentType: rec.type,
    studentName: rec.studentName,
    rollNo: rec.rollNumber,
    courseName: rec.course.toUpperCase(),
    slNo: rec.certificateNumber.slice(-3),
    trainingCenter: "Rama Coaching Center, Main Branch",
  };
}

export default function CertificatesPage() {
  const [list, setList] = useState<CertificateRecord[]>(seedCertificates);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const [viewRecord, setViewRecord] = useState<CertificateRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<CertificateRecord | null>(null);

  const [issueOpen, setIssueOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedType, setSelectedType] = useState<CertificateType>("excellence");
  const [generatorKey, setGeneratorKey] = useState(0);
  const [issueInitial, setIssueInitial] = useState<CertificateData | null>(null);
  const [generated, setGenerated] = useState<CertificateData | null>(null);
  const [issuedNumber, setIssuedNumber] = useState("");

  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const courseOptions = useMemo(
    () => Array.from(new Set(list.map((c) => c.course))).sort(),
    [list]
  );

  const nextNumber = `RCC-2026-${String(list.length + 1).padStart(4, "0")}`;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((c) => {
      const matchQ =
        !q ||
        c.studentName.toLowerCase().includes(q) ||
        c.certificateNumber.toLowerCase().includes(q) ||
        c.rollNumber.toLowerCase().includes(q);
      const matchType = !typeFilter || c.type === typeFilter;
      const matchCourse = !courseFilter || c.course === courseFilter;
      return matchQ && matchType && matchCourse;
    });
  }, [list, search, typeFilter, courseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function loadGenerator() {
    const student = students.find((s) => s.id === selectedStudentId);
    const num = nextNumber;
    setIssuedNumber(num);
    setIssueInitial(buildCertData(student, selectedType, num));
    setGenerated(null);
    setGeneratorKey((k) => k + 1);
  }

  function saveRecord() {
    if (!generated) return;
    const rec: CertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: issuedNumber,
      studentName: generated.studentName,
      rollNumber: generated.rollNo,
      course: generated.courseName,
      type: generated.documentType,
      issueDate: generated.dated || todayLabel(),
      status: "issued",
    };
    setList((prev) => [rec, ...prev]);
    setIssueOpen(false);
    setGenerated(null);
    setIssueInitial(null);
  }

  function confirmDelete() {
    if (!deleteRecord) return;
    setList((prev) => prev.filter((c) => c.id !== deleteRecord.id));
    setDeleteRecord(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        subtitle="Issue, view, print and manage student certificates"
        actions={
          <button
            type="button"
            onClick={() => {
              setIssueOpen((v) => !v);
              setGenerated(null);
              setIssueInitial(null);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" />
            Issue Certificate
          </button>
        }
      />

      {issueOpen ? (
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FilePlus2 className="h-4 w-4 text-navy" />
            Issue New Certificate
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Student</label>
              <SelectInput
                value={selectedStudentId}
                onChange={setSelectedStudentId}
                placeholder="Select student"
                options={students.map((s) => ({ value: s.id, label: `${s.fullName} (${s.rollNumber})` }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Certificate Type</label>
              <SelectInput
                value={selectedType}
                onChange={(v) => setSelectedType(v as CertificateType)}
                options={[
                  { value: "excellence", label: "Certificate of Excellence" },
                  { value: "marksheet", label: "Marksheet" },
                ]}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadGenerator}
                disabled={!selectedStudentId}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Load Generator
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Certificate Number: <span className="font-semibold text-slate-700">{nextNumber}</span> (auto-generated, demo)
          </p>

          {issueInitial ? (
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <CertificateForm key={generatorKey} initialData={issueInitial} onGenerate={setGenerated} />
              <div className="lg:sticky lg:top-20 lg:self-start">
                <CertificatePreview data={generated} />
                {generated ? (
                  <button
                    type="button"
                    onClick={saveRecord}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-navy bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
                  >
                    <Printer className="h-4 w-4" />
                    Save to Records
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      <Card className="p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name / number / roll..." />
          <SelectInput
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v); setPage(1); }}
            placeholder="All Types"
            options={[
              { value: "excellence", label: "Certificate of Excellence" },
              { value: "marksheet", label: "Marksheet" },
            ]}
          />
          <SelectInput
            value={courseFilter}
            onChange={(v) => { setCourseFilter(v); setPage(1); }}
            placeholder="All Courses"
            options={courseOptions.map((c) => ({ value: c, label: c }))}
          />
        </div>
      </Card>

      {loading ? (
        <Spinner label="Loading certificates..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates found"
          description="Try adjusting your search or filters, or issue a new certificate."
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Certificate No.</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Roll No.</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Issue Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{c.certificateNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{c.studentName}</td>
                    <td className="px-4 py-3 text-slate-500">{c.rollNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{c.course}</td>
                    <td className="px-4 py-3 text-slate-500">{c.issueDate}</td>
                    <td className="px-4 py-3">
                      <Badge variant={certificateStatusVariant[c.status]}>{titleCase(c.status)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewRecord(c)}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(
                              students.find((s) => s.rollNumber === c.rollNumber)?.id ?? ""
                            );
                            setSelectedType(c.type);
                            setIssuedNumber(c.certificateNumber);
                            setIssueInitial(recordToCertData(c));
                            setGenerated(null);
                            setGeneratorKey((k) => k + 1);
                            setIssueOpen(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                          title="Regenerate"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteRecord(c)}
                          className="rounded-md p-2 text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </Card>
      )}

      <Modal open={!!viewRecord} onClose={() => setViewRecord(null)} title="Certificate Preview" size="xl">
        {viewRecord ? (
          <div>
            <CertificatePreview data={recordToCertData(viewRecord)} />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
              >
                <Printer className="h-4 w-4" />
                Print / Save as PDF
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={!!deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onConfirm={confirmDelete}
        title="Delete certificate?"
        message={`Are you sure you want to delete certificate ${deleteRecord?.certificateNumber}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
