"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  ClipboardList,
  Clock,
  Target,
  BookOpen,
  HelpCircle,
  ChevronLeft,
  CheckCircle2,
  Circle,
  GripVertical,
  AlertCircle,
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SearchInput, SelectInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, TextInput, TextArea, SelectField } from "@/components/ui/Field";
import { EmptyState, Spinner } from "@/components/ui/EmptyState";
import { mockTestStatusVariant } from "@/lib/status";
import type { MockTest, MockTestQuestion } from "@/data/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestDraft = Omit<MockTest, "id" | "questions">;
type QuestionDraft = Omit<MockTestQuestion, "id">;

const emptyTestDraft: TestDraft = {
  title: "",
  description: "",
  subject: "",
  duration: 30,
  totalMarks: 10,
  passingMarks: 5,
  status: "active",
  attemptLimit: 10,
};

const emptyQDraft: QuestionDraft = {
  questionText: "",
  questionTextHi: "",
  options: ["", "", "", ""],
  optionsHi: ["", "", "", ""],
  correctOption: 0,
  explanation: "",
  marks: 1,
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "tests" | "questions";

// ═══════════════════════════════════════════════════════════════════════════════
export default function MockTestsAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tests");
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);

  function openQuestions(test: MockTest) {
    setSelectedTest(test);
    setActiveTab("questions");
  }

  function backToTests() {
    setActiveTab("tests");
    setSelectedTest(null);
  }

  return (
    <div className="space-y-6">
      {/* Tab header */}
      <div className="flex items-center gap-3">
        {activeTab === "questions" && (
          <button
            type="button"
            onClick={backToTests}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Tests
          </button>
        )}
        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "tests"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Mock Tests
          </button>
          <button
            type="button"
            onClick={() => activeTab === "tests" && setActiveTab("questions")}
            disabled={!selectedTest && activeTab === "tests"}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "questions"
                ? "bg-navy text-white shadow-sm"
                : selectedTest
                ? "text-slate-600 hover:bg-slate-50"
                : "cursor-not-allowed text-slate-300"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            Questions
            {selectedTest && (
              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-semibold">
                {activeTab === "questions"
                  ? selectedTest.questions.length
                  : ""}
              </span>
            )}
          </button>
        </div>
        {activeTab === "questions" && selectedTest && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Managing questions for:</span>
            <span className="rounded-lg bg-navy/10 px-3 py-1 text-sm font-semibold text-navy">
              {selectedTest.title}
            </span>
          </div>
        )}
      </div>

      {activeTab === "tests" ? (
        <TestsTab onManageQuestions={openQuestions} />
      ) : (
        <QuestionsTab
          test={selectedTest!}
          onTestUpdate={setSelectedTest}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Tests Tab
// ═══════════════════════════════════════════════════════════════════════════════

function TestsTab({ onManageQuestions }: { onManageQuestions: (t: MockTest) => void }) {
  const [items, setItems] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TestDraft>(emptyTestDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [viewItem, setViewItem] = useState<MockTest | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch("/api/mock-tests?" + params.toString(), { cache: "no-store" });
      const j = await res.json();
      if (j.success) setItems(j.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);
  useEffect(() => { fetchList(); }, [query, statusFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((t) => {
      const matchQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      const matchS = statusFilter === "all" || t.status === statusFilter;
      return matchQ && matchS;
    });
  }, [items, query, statusFilter]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyTestDraft);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(t: MockTest) {
    setEditingId(t.id);
    setDraft({
      title: t.title,
      description: t.description,
      subject: t.subject,
      duration: t.duration,
      totalMarks: t.totalMarks,
      passingMarks: t.passingMarks,
      status: t.status,
      attemptLimit: t.attemptLimit,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!draft.title.trim()) e.title = "Title is required";
    if (!draft.description.trim()) e.description = "Description is required";
    if (!draft.subject.trim()) e.subject = "Subject is required";
    if (!draft.duration || draft.duration < 1) e.duration = "Duration must be at least 1 min";
    if (!draft.totalMarks || draft.totalMarks < 1) e.totalMarks = "Total marks required";
    if (draft.passingMarks > draft.totalMarks) e.passingMarks = "Cannot exceed total marks";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!validate()) return;
    try {
      const url = editingId ? `/api/mock-tests/${editingId}` : "/api/mock-tests";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const j = await res.json();
      if (!j.success) { setErrors({ title: j.error || "Failed to save" }); return; }
      await fetchList();
      setModalOpen(false);
    } catch { setErrors({ title: "Network error" }); }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/mock-tests/${deleteId}`, { method: "DELETE" });
      const j = await r.json();
      if (j.success) await fetchList();
    } catch {}
    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Mock Tests"
        subtitle="Create and manage free mock tests for students"
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" /> Add Mock Test
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by title, subject..." />
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
        <Spinner label="Loading mock tests..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No mock tests found"
          description="Create your first mock test and add questions to get started."
          action={
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" /> Add Mock Test
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TestCard
              key={t.id}
              test={t}
              onView={() => setViewItem(t)}
              onEdit={() => openEdit(t)}
              onDelete={() => { setDeleteId(t.id); setConfirmOpen(true); }}
              onManageQuestions={() => onManageQuestions(t)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Mock Test" : "Add Mock Test"}
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
              {editingId ? "Save Changes" : "Create Test"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Test Title" required error={errors.title}>
            <TextInput
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. General Knowledge Mock Test #1"
            />
          </Field>

          <Field label="Subject / Category" required error={errors.subject}>
            <TextInput
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="e.g. Computer Science, GK, Mathematics"
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <TextArea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Brief overview of what this test covers..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (minutes)" required error={errors.duration}>
              <TextInput
                type="number"
                min={1}
                value={draft.duration}
                onChange={(e) => setDraft({ ...draft, duration: Number(e.target.value) })}
              />
            </Field>
            <Field label="Attempt Limit" error={errors.attemptLimit}>
              <TextInput
                type="number"
                min={1}
                value={draft.attemptLimit}
                onChange={(e) => setDraft({ ...draft, attemptLimit: Number(e.target.value) })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Total Marks" required error={errors.totalMarks}>
              <TextInput
                type="number"
                min={1}
                value={draft.totalMarks}
                onChange={(e) => setDraft({ ...draft, totalMarks: Number(e.target.value) })}
              />
            </Field>
            <Field label="Passing Marks" required error={errors.passingMarks}>
              <TextInput
                type="number"
                min={0}
                value={draft.passingMarks}
                onChange={(e) => setDraft({ ...draft, passingMarks: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Status">
            <SelectField
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as "active" | "inactive" })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectField>
          </Field>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Mock Test Details"
        size="md"
      >
        {viewItem && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</p>
              <p className="mt-0.5 text-sm text-slate-800">{viewItem.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subject</p>
              <p className="mt-0.5 text-sm text-slate-800">{viewItem.subject}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
              <p className="mt-0.5 text-sm text-slate-600">{viewItem.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-navy">{viewItem.duration}</p>
                <p className="text-xs text-slate-500">Minutes</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-navy">{viewItem.totalMarks}</p>
                <p className="text-xs text-slate-500">Total Marks</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-navy">{viewItem.passingMarks}</p>
                <p className="text-xs text-slate-500">Passing Marks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={mockTestStatusVariant[viewItem.status]}>
                {viewItem.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-slate-500">{viewItem.questions.length} questions</span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Mock Test"
        message="This will permanently delete the test and all its questions. This action cannot be undone."
        confirmText="Delete Test"
      />
    </>
  );
}

// ─── Test Card ─────────────────────────────────────────────────────────────────

function TestCard({
  test,
  onView,
  onEdit,
  onDelete,
  onManageQuestions,
}: {
  test: MockTest;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onManageQuestions: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="h-1.5 bg-gradient-to-r from-navy to-navy-deep" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug">{test.title}</h3>
          <Badge variant={mockTestStatusVariant[test.status]}>
            {test.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>

        <p className="mt-1 text-xs font-medium text-navy/70">{test.subject}</p>
        <p className="mt-2 line-clamp-2 text-xs text-slate-500">{test.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{test.duration}m</span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <Target className="h-3 w-3" />
              <span className="text-xs">{test.totalMarks} marks</span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500">
              <HelpCircle className="h-3 w-3" />
              <span className="text-xs">{test.questions.length} Qs</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onManageQuestions}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Manage Questions
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Questions Tab
// ═══════════════════════════════════════════════════════════════════════════════

function QuestionsTab({
  test,
  onTestUpdate,
}: {
  test: MockTest;
  onTestUpdate: (t: MockTest) => void;
}) {
  const [questions, setQuestions] = useState<MockTestQuestion[]>(test.questions);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<QuestionDraft>(emptyQDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  // Sync questions from prop when test changes
  useEffect(() => { setQuestions(test.questions); }, [test.id]);

  async function persistQuestions(updated: MockTestQuestion[]) {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(`/api/mock-tests/${test.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: updated }),
      });
      const j = await res.json();
      if (j.success) {
        setQuestions(j.data.questions);
        onTestUpdate({ ...test, questions: j.data.questions });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
    setSaving(false);
  }

  function openAdd() {
    setEditingIdx(null);
    setDraft(emptyQDraft);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(idx: number) {
    const q = questions[idx];
    setEditingIdx(idx);
    setDraft({
      questionText: q.questionText,
      questionTextHi: q.questionTextHi || "",
      options: [...q.options],
      optionsHi: q.optionsHi ? [...q.optionsHi] : ["", "", "", ""],
      correctOption: q.correctOption,
      explanation: q.explanation,
      marks: q.marks,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validateQ(): boolean {
    const e: Record<string, string> = {};
    if (!draft.questionText.trim()) e.questionText = "Question text is required";
    draft.options.forEach((opt, i) => {
      if (!opt.trim()) e[`option_${i}`] = `Option ${String.fromCharCode(65 + i)} is required`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function saveQuestion() {
    if (!validateQ()) return;
    const newQ: MockTestQuestion = {
      id: editingIdx !== null ? questions[editingIdx].id : "",
      questionText: draft.questionText.trim(),
      questionTextHi: draft.questionTextHi?.trim() || undefined,
      options: draft.options.map((o) => o.trim()),
      optionsHi: draft.optionsHi?.every((o) => o.trim()) ? draft.optionsHi.map((o) => o.trim()) : undefined,
      correctOption: draft.correctOption,
      explanation: draft.explanation.trim(),
      marks: draft.marks,
    };

    let updated: MockTestQuestion[];
    if (editingIdx !== null) {
      updated = questions.map((q, i) => (i === editingIdx ? newQ : q));
    } else {
      updated = [...questions, newQ];
    }
    setModalOpen(false);
    await persistQuestions(updated);
  }

  async function deleteQuestion() {
    if (deleteIdx === null) return;
    const updated = questions.filter((_, i) => i !== deleteIdx);
    setDeleteIdx(null);
    await persistQuestions(updated);
  }

  const totalCalculatedMarks = questions.reduce((s, q) => s + q.marks, 0);

  return (
    <>
      <PageHeader
        title={`Questions — ${test.title}`}
        subtitle={`${questions.length} question${questions.length !== 1 ? "s" : ""} · ${totalCalculatedMarks} total marks`}
        actions={
          <div className="flex items-center gap-3">
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1 text-sm font-medium text-red-600">
                <AlertCircle className="h-4 w-4" /> Save failed
              </span>
            )}
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" /> Add Question
            </button>
          </div>
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Questions", value: questions.length, icon: HelpCircle, color: "text-navy" },
          { label: "Total Marks", value: totalCalculatedMarks, icon: Target, color: "text-emerald-600" },
          { label: "Duration", value: `${test.duration}m`, icon: Clock, color: "text-amber-600" },
          { label: "Pass Marks", value: test.passingMarks, icon: CheckCircle2, color: "text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <s.icon className={`h-8 w-8 ${s.color}`} />
            <div>
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No questions yet"
          description="Add questions with 4 options and mark the correct answer."
          action={
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" /> Add First Question
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id || idx}
              question={q}
              index={idx}
              onEdit={() => openEdit(idx)}
              onDelete={() => { setDeleteIdx(idx); setConfirmOpen(true); }}
              saving={saving}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIdx !== null ? `Edit Question ${editingIdx + 1}` : "Add New Question"}
        size="xl"
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
              onClick={saveQuestion}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              {editingIdx !== null ? "Update Question" : "Add Question"}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Question text */}
          <Field label="Question (English)" required error={errors.questionText}>
            <TextArea
              rows={3}
              value={draft.questionText}
              onChange={(e) => setDraft({ ...draft, questionText: e.target.value })}
              placeholder="Type your question here..."
            />
          </Field>

          {/* Question text Hindi */}
          <Field label="Question (Hindi — हिंदी में प्रश्न)" error={errors.questionTextHi}>
            <TextArea
              rows={3}
              value={draft.questionTextHi || ""}
              onChange={(e) => setDraft({ ...draft, questionTextHi: e.target.value })}
              placeholder="यहाँ प्रश्न हिंदी में लिखें..."
            />
          </Field>

          {/* Options */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Answer Options <span className="text-red-500">*</span>
              <span className="ml-2 text-xs font-normal text-slate-400">(Select the correct answer)</span>
            </p>
            <div className="space-y-3">
              {draft.options.map((opt, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    {/* Correct answer selector */}
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, correctOption: i })}
                      className="shrink-0"
                      title={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                    >
                      {draft.correctOption === i ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 hover:text-green-400" />
                      )}
                    </button>
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        draft.correctOption === i
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <TextInput
                        value={opt}
                        onChange={(e) => {
                          const opts = [...draft.options];
                          opts[i] = e.target.value;
                          setDraft({ ...draft, options: opts });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)} (English)`}
                        error={errors[`option_${i}`]}
                      />
                    </div>
                  </div>
                  {/* Hindi option input */}
                  <div className="ml-[60px]">
                    <TextInput
                      value={(draft.optionsHi || [])[i] || ""}
                      onChange={(e) => {
                        const opts = [...(draft.optionsHi || ["", "", "", ""])];
                        opts[i] = e.target.value;
                        setDraft({ ...draft, optionsHi: opts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)} हिंदी में`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Click the circle next to an option to mark it as the correct answer. Hindi options are optional but recommended for bilingual exam display.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Marks for this question">
              <TextInput
                type="number"
                min={1}
                value={draft.marks}
                onChange={(e) => setDraft({ ...draft, marks: Number(e.target.value) })}
              />
            </Field>
            <Field label="Explanation (optional)">
              <TextInput
                value={draft.explanation}
                onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
                placeholder="Why is this the correct answer?"
              />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteQuestion}
        title="Delete Question"
        message="This will permanently remove the question. This action cannot be undone."
        confirmText="Delete Question"
      />
    </>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  onEdit,
  onDelete,
  saving,
}: {
  question: MockTestQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  saving: boolean;
}) {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        {/* Drag handle placeholder + index */}
        <div className="flex flex-col items-center gap-1">
          <GripVertical className="h-4 w-4 text-slate-300" />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
            {index + 1}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 leading-relaxed">{question.questionText}</p>
          {question.questionTextHi && (
            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{question.questionTextHi}</p>
          )}

          <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  i === question.correctOption
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    i === question.correctOption
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {optionLabels[i]}
                </span>
                <span className="truncate">{opt}</span>
                {i === question.correctOption && (
                  <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-green-500" />
                )}
              </div>
            ))}
          </div>

          {question.explanation && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
              <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-700">{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-semibold text-navy">
            {question.marks} {question.marks === 1 ? "mark" : "marks"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              disabled={saving}
              className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              title="Edit question"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={saving}
              className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
              title="Delete question"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
