"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  BookOpen,
  Clock,
  IndianRupee,
  Tag,
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SearchInput, SelectInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, TextInput, TextArea, SelectField } from "@/components/ui/Field";
import { EmptyState, Spinner } from "@/components/ui/EmptyState";
import { courseStatusVariant } from "@/lib/status";

import { courses as seedCourses } from "@/data/courses";
import type { Course } from "@/data/types";

type CourseDraft = Omit<Course, "id">;

const emptyDraft: CourseDraft = {
  name: "",
  description: "",
  duration: "",
  fees: "",
  category: "",
  accent: "#1F3354",
  status: "active",
};

export default function CoursesAdminPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [viewItem, setViewItem] = useState<Course | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(seedCourses);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(c: Course) {
    setEditingId(c.id);
    setDraft({
      name: c.name,
      description: c.description,
      duration: c.duration,
      fees: c.fees,
      category: c.category,
      accent: c.accent,
      status: c.status,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!draft.name.trim()) e.name = "Name is required";
    if (!draft.description.trim()) e.description = "Description is required";
    if (!draft.duration.trim()) e.duration = "Duration is required";
    if (!draft.fees.trim()) e.fees = "Fees is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function save() {
    if (!validate()) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...draft } : c)),
      );
    } else {
      const newCourse: Course = { id: `cr-${Date.now()}`, ...draft };
      setItems((prev) => [newCourse, ...prev]);
    }
    setModalOpen(false);
  }

  function askDelete(id: string) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    if (deleteId) setItems((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        subtitle="Manage course catalog, fees and availability"
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" /> Add Course
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name, description or category..."
          />
        </div>
        <SelectInput
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      {loading ? (
        <Spinner label="Loading courses..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try a different search or add a new course to get started."
          action={
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" /> Add Course
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                style={{ backgroundColor: c.accent }}
                className="h-2"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {c.name}
                  </h3>
                  <Badge variant={courseStatusVariant[c.status]}>
                    {c.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="info">
                    <Tag className="h-3 w-3" /> {c.category}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" /> {c.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                    <IndianRupee className="h-4 w-4 text-slate-400" /> {c.fees}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                  {c.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewItem(c)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => askDelete(c.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Course" : "Add Course"}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              {editingId ? "Save Changes" : "Create Course"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Course Name" required error={errors.name}>
            <TextInput
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. ADCA — Advanced Diploma"
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <TextArea
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="Short overview of the course"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Duration" required error={errors.duration}>
              <TextInput
                value={draft.duration}
                onChange={(e) =>
                  setDraft({ ...draft, duration: e.target.value })
                }
                placeholder="e.g. 6 Months"
              />
            </Field>
            <Field label="Fees" required error={errors.fees}>
              <TextInput
                value={draft.fees}
                onChange={(e) => setDraft({ ...draft, fees: e.target.value })}
                placeholder="e.g. ₹9,500"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category">
              <TextInput
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
                placeholder="e.g. Diploma"
              />
            </Field>
            <Field label="Status">
              <SelectField
                value={draft.status}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    status: e.target.value as CourseDraft["status"],
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SelectField>
            </Field>
          </div>

          <Field label="Accent Color">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draft.accent}
                onChange={(e) =>
                  setDraft({ ...draft, accent: e.target.value })
                }
                className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300"
              />
              <TextInput
                value={draft.accent}
                onChange={(e) =>
                  setDraft({ ...draft, accent: e.target.value })
                }
                placeholder="#1F3354"
              />
            </div>
          </Field>
        </div>
      </Modal>

      <Modal
        open={viewItem !== null}
        onClose={() => setViewItem(null)}
        title="Course Details"
        size="lg"
        footer={
          <button
            type="button"
            onClick={() => setViewItem(null)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        }
      >
        {viewItem ? (
          <div className="space-y-4">
            <div
              style={{ backgroundColor: viewItem.accent }}
              className="h-2 rounded-full"
            />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {viewItem.name}
              </h3>
              <Badge variant={courseStatusVariant[viewItem.status]}>
                {viewItem.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{viewItem.category}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-xs uppercase text-slate-400">Duration</p>
                <p className="font-medium text-slate-700">
                  {viewItem.duration}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Fees</p>
                <p className="font-medium text-slate-700">{viewItem.fees}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{viewItem.description}</p>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        message="This action cannot be undone. Are you sure you want to delete this course?"
        confirmText="Delete"
      />
    </div>
  );
}
