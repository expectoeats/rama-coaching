"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Megaphone, ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SearchInput, SelectInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { EmptyState, Spinner } from "@/components/ui/EmptyState";
import { boolStatusVariant } from "@/lib/status";

import { banners as seedBanners } from "@/data/banners";
import type { Banner } from "@/data/types";

type BannerDraft = Omit<Banner, "id">;

const emptyDraft: BannerDraft = {
  heading: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  active: true,
  accent: "#1F3354",
};

export default function BannersAdminPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BannerDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(seedBanners);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((b) => {
      const matchesQuery =
        !q ||
        b.heading.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      const matchesStatus =
        activeFilter === "all"
          ? true
          : activeFilter === "active"
            ? b.active
            : !b.active;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, activeFilter]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(b: Banner) {
    setEditingId(b.id);
    setDraft({
      heading: b.heading,
      description: b.description,
      buttonText: b.buttonText,
      buttonLink: b.buttonLink,
      active: b.active,
      accent: b.accent,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!draft.heading.trim()) e.heading = "Heading is required";
    if (!draft.description.trim()) e.description = "Description is required";
    if (!draft.buttonText.trim()) e.buttonText = "Button text is required";
    if (!draft.buttonLink.trim()) e.buttonLink = "Button link is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function save() {
    if (!validate()) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...draft } : b)),
      );
    } else {
      const newItem: Banner = { id: `b-${Date.now()}`, ...draft };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  }

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)),
    );
  }

  function askDelete(id: string) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    if (deleteId) setItems((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        subtitle="Manage hero banners and call-to-action sections"
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Plus className="h-4 w-4" /> Add Banner
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by heading or description..."
          />
        </div>
        <SelectInput
          value={activeFilter}
          onChange={setActiveFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      {loading ? (
        <Spinner label="Loading banners..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No banners found"
          description="Try a different search or create a new banner."
          action={
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Plus className="h-4 w-4" /> Add Banner
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                style={{ backgroundColor: b.accent }}
                className="h-2"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {b.heading}
                  </h3>
                  <Badge variant={boolStatusVariant(b.active)}>
                    {b.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {b.description}
                </p>

                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1 font-medium text-navy">
                    <ExternalLink className="h-3.5 w-3.5" /> {b.buttonText}
                  </span>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {b.buttonLink}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(b.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {b.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => askDelete(b.id)}
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
        title={editingId ? "Edit Banner" : "Add Banner"}
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
              {editingId ? "Save Changes" : "Create Banner"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Heading" required error={errors.heading}>
            <TextInput
              value={draft.heading}
              onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
              placeholder="e.g. Build Your Career in Computers"
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <TextArea
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="Short banner message"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Button Text" required error={errors.buttonText}>
              <TextInput
                value={draft.buttonText}
                onChange={(e) =>
                  setDraft({ ...draft, buttonText: e.target.value })
                }
                placeholder="e.g. Explore Courses"
              />
            </Field>
            <Field label="Button Link" required error={errors.buttonLink}>
              <TextInput
                value={draft.buttonLink}
                onChange={(e) =>
                  setDraft({ ...draft, buttonLink: e.target.value })
                }
                placeholder="e.g. /courses"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Active">
              <select
                value={draft.active ? "yes" : "no"}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.value === "yes" })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
              >
                <option value="yes">Active</option>
                <option value="no">Inactive</option>
              </select>
            </Field>
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
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        message="This action cannot be undone. Are you sure you want to delete this banner?"
        confirmText="Delete"
      />
    </div>
  );
}
