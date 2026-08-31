"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import {
  SearchInput,
  SelectInput,
} from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Spinner } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { Field, TextInput, SelectField } from "@/components/ui/Field";

import { students as seedStudents, studentCourses } from "@/data/students";
import { studentStatusVariant, titleCase } from "@/lib/status";
import type { Student, StudentStatus } from "@/data/types";

const STATUS_OPTIONS: StudentStatus[] = [
  "active",
  "completed",
  "pending",
  "inactive",
];

const PAGE_SIZE = 6;

interface FormState {
  fullName: string;
  rollNumber: string;
  email: string;
  phone: string;
  course: string;
  courseFree: string;
  batch: string;
  admissionDate: string;
  status: StudentStatus;
}

const emptyForm: FormState = {
  fullName: "",
  rollNumber: "",
  email: "",
  phone: "",
  course: "",
  courseFree: "",
  batch: "",
  admissionDate: "",
  status: "active",
};

export default function StudentsPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Student[]>(seedStudents);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const [viewOpen, setViewOpen] = useState(false);
  const [viewing, setViewing] = useState<Student | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((s) => {
      const matchesSearch =
        q === "" ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q);
      const matchesCourse = courseFilter === "" || s.course === courseFilter;
      const matchesStatus = statusFilter === "" || s.status === (statusFilter as StudentStatus);
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [list, search, courseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const courseOptions = studentCourses.map((c) => ({ value: c, label: c }));
  const statusOptions = STATUS_OPTIONS.map((s) => ({ value: s, label: titleCase(s) }));

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({
      fullName: s.fullName,
      rollNumber: s.rollNumber,
      email: s.email,
      phone: s.phone,
      course: studentCourses.includes(s.course) ? s.course : "other",
      courseFree: studentCourses.includes(s.course) ? "" : s.course,
      batch: s.batch,
      admissionDate: s.admissionDate,
      status: s.status,
    });
    setErrors({});
    setFormOpen(true);
  }

  function openView(s: Student) {
    setViewing(s);
    setViewOpen(true);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.rollNumber.trim()) e.rollNumber = "Roll number is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    const courseValue = form.course === "other" ? form.courseFree.trim() : form.course;
    if (!courseValue) e.course = "Course is required.";
    if (!form.batch.trim()) e.batch = "Batch is required.";
    if (!form.admissionDate.trim()) e.admissionDate = "Admission date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const courseValue =
      form.course === "other" ? form.courseFree.trim() : form.course;
    const payload = {
      fullName: form.fullName.trim(),
      rollNumber: form.rollNumber.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      course: courseValue,
      batch: form.batch.trim(),
      admissionDate: form.admissionDate.trim(),
      status: form.status,
    };

    if (editing) {
      setList((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? { ...s, ...payload, avatarColor: editing.avatarColor }
            : s
        )
      );
    } else {
      const palette = [
        "#1F3354",
        "#b91c1c",
        "#0f766e",
        "#7c3aed",
        "#c2410c",
        "#0369a1",
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];
      setList((prev) => [
        { id: `st-${Date.now()}`, avatarColor: color, ...payload },
        ...prev,
      ]);
    }
    setFormOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  if (loading) {
    return <Spinner label="Loading students..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle="Manage student records, admissions, and enrollment status."
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by name, email, roll or phone..."
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SelectInput
            value={courseFilter}
            onChange={(v) => {
              setCourseFilter(v);
              setPage(1);
            }}
            options={courseOptions}
            placeholder="All Courses"
          />
          <SelectInput
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            options={statusOptions}
            placeholder="All Status"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try adjusting your search or filters."
          action={
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" />
              Add Student
            </button>
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Roll Number</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Admission</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.fullName} color={s.avatarColor} size={36} />
                      <span className="font-medium text-slate-800">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.rollNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{s.email}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{s.course}</td>
                  <td className="px-4 py-3 text-slate-600">{s.batch}</td>
                  <td className="px-4 py-3 text-slate-600">{s.admissionDate}</td>
                  <td className="px-4 py-3">
                    <Badge variant={studentStatusVariant[s.status]}>
                      {titleCase(s.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openView(s)}
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                        aria-label="View student"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                        aria-label="Edit student"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        aria-label="Delete student"
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
      )}

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Student" : "Add Student"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              {editing ? "Save Changes" : "Add Student"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <Field label="Full Name" required error={errors.fullName}>
              <TextInput
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Rahul Kumar"
              />
            </Field>
          </div>
          <div className="sm:col-span-1">
            <Field label="Roll Number" required error={errors.rollNumber}>
              <TextInput
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                placeholder="e.g. RCC/2026/001"
              />
            </Field>
          </div>
          <div className="sm:col-span-1">
            <Field label="Email" required error={errors.email}>
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
              />
            </Field>
          </div>
          <div className="sm:col-span-1">
            <Field label="Phone" required error={errors.phone}>
              <TextInput
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210"
              />
            </Field>
          </div>
          <div className="sm:col-span-1">
            <Field label="Course" required error={errors.course}>
              <SelectField
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                <option value="">Select course</option>
                {studentCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="other">Other (type below)</option>
              </SelectField>
            </Field>
          </div>
          {form.course === "other" ? (
            <div className="sm:col-span-1">
              <Field label="Course Name" required>
                <TextInput
                  value={form.courseFree}
                  onChange={(e) => setForm({ ...form, courseFree: e.target.value })}
                  placeholder="Enter course name"
                />
              </Field>
            </div>
          ) : null}
          <div className="sm:col-span-1">
            <Field label="Batch" required error={errors.batch}>
              <TextInput
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                placeholder="e.g. Morning-A"
              />
            </Field>
          </div>
          <div className="sm:col-span-1">
            <Field label="Admission Date" required error={errors.admissionDate}>
              <TextInput
                type="date"
                value={form.admissionDate}
                onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-1">
            <Field label="Status" required>
              <SelectField
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as StudentStatus })
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {titleCase(s)}
                  </option>
                ))}
              </SelectField>
            </Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Student Details"
        size="md"
      >
        {viewing ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar name={viewing.fullName} color={viewing.avatarColor} size={56} />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {viewing.fullName}
                </h3>
                <Badge variant={studentStatusVariant[viewing.status]}>
                  {titleCase(viewing.status)}
                </Badge>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <Detail label="Roll Number" value={viewing.rollNumber} />
              <Detail label="Email" value={viewing.email} />
              <Detail label="Phone" value={viewing.phone} />
              <Detail label="Course" value={viewing.course} />
              <Detail label="Batch" value={viewing.batch} />
              <Detail label="Admission Date" value={viewing.admissionDate} />
            </dl>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.fullName}"? This action cannot be undone.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-700">{value}</dd>
    </div>
  );
}
