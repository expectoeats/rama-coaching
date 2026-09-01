"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Clock,
} from "lucide-react";
import { PageHeader, Card } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SearchInput, SelectInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Spinner } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { franchiseStatusVariant, titleCase } from "@/lib/status";
import type { FranchiseApplication, FranchiseStatus } from "@/data/types";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_META: Record<
  FranchiseStatus,
  { icon: typeof Clock; className: string }
> = {
  pending: { icon: Clock, className: "border-amber-300 text-amber-700 hover:bg-amber-50" },
  contacted: { icon: PhoneCall, className: "border-blue-300 text-blue-700 hover:bg-blue-50" },
  approved: { icon: CheckCircle2, className: "border-green-300 text-green-700 hover:bg-green-50" },
  rejected: { icon: XCircle, className: "border-red-300 text-red-700 hover:bg-red-50" },
};

const PAGE_SIZE = 6;

export default function FranchisePage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<FranchiseApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [viewItem, setViewItem] = useState<FranchiseApplication | null>(null);
  const [statusItem, setStatusItem] = useState<FranchiseApplication | null>(null);
  const [pendingStatus, setPendingStatus] = useState<FranchiseStatus>("pending");
  const [deleteItem, setDeleteItem] = useState<FranchiseApplication | null>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/franchise", { cache: "no-store" });
      const j = await res.json();
      if (j.success) setApplications(j.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchList(); }, []);

  const pendingCount = useMemo(
    () => applications.filter((a) => a.status === "pending").length,
    [applications]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.state.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  function openStatus(item: FranchiseApplication) {
    setPendingStatus(item.status);
    setStatusItem(item);
  }

  async function saveStatus() {
    if (!statusItem) return;
    try {
      const res = await fetch(`/api/franchise/${statusItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: pendingStatus }) });
      const j = await res.json();
      if (!j.success) { alert(j.error || "Failed to update status"); return; }
      await fetchList();
      setStatusItem(null);
    } catch { alert("Network error while updating status"); }
  }

  async function setQuickStatus(item: FranchiseApplication, status: FranchiseStatus) {
    try {
      const res = await fetch(`/api/franchise/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const j = await res.json();
      if (!j.success) { alert(j.error || "Failed to update status"); return; }
      await fetchList();
      setStatusItem(null);
    } catch { alert("Network error while updating status"); }
  }

  async function confirmDelete() {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/franchise/${deleteItem.id}`, { method: "DELETE" });
      const j = await res.json();
      if (!j.success) { alert(j.error || "Failed to delete"); return; }
      await fetchList();
    } catch { alert("Network error while deleting application"); }
    setDeleteItem(null);
  }

  return (
    <div>
      <PageHeader
        title="Franchise Applications"
        subtitle={
          loading
            ? "Loading applications..."
            : `${pendingCount} pending application${pendingCount === 1 ? "" : "s"} · ${applications.length} total`
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, city or state..."
          />
        </div>
        <SelectInput
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
        />
      </div>

      {loading ? (
        <Card>
          <Spinner label="Loading franchise applications..." />
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="No applications found"
          description="Try adjusting your search or status filter to see more results."
        />
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="px-4 py-3 text-slate-600">{a.email}</td>
                    <td className="px-4 py-3 text-slate-600">{a.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{a.city}</td>
                    <td className="px-4 py-3 text-slate-600">{a.state}</td>
                    <td className="px-4 py-3 text-slate-500">{a.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={franchiseStatusVariant[a.status]}>
                        {titleCase(a.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewItem(a)}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openStatus(a)}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                          title="Change Status"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteItem(a)}
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

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* View Modal */}
      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Application Details"
        size="md"
      >
        {viewItem ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={franchiseStatusVariant[viewItem.status]}>
                {titleCase(viewItem.status)}
              </Badge>
              <span className="text-xs text-slate-400">Applied on {viewItem.date}</span>
            </div>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail label="Name" value={viewItem.name} />
              <Detail label="Phone" value={viewItem.phone} />
              <Detail label="Email" value={viewItem.email} />
              <Detail label="City" value={viewItem.city} />
              <Detail label="State" value={viewItem.state} />
              <Detail label="Application ID" value={viewItem.id} />
            </dl>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Message</p>
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {viewItem.message}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Change Status Modal */}
      <Modal
        open={!!statusItem}
        onClose={() => setStatusItem(null)}
        title="Change Application Status"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setStatusItem(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveStatus}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Save Status
            </button>
          </>
        }
      >
        {statusItem ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Update status for <span className="font-medium text-slate-800">{statusItem.name}</span>.
            </p>
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value as FranchiseStatus)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
            >
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Quick set</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_META) as FranchiseStatus[]).map((s) => {
                  const meta = STATUS_META[s];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuickStatus(statusItem, s)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium ${meta.className}`}
                    >
                      <Icon className="h-4 w-4" />
                      {titleCase(s)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Delete Application"
        message={
          deleteItem
            ? `Are you sure you want to delete the application from ${deleteItem.name}? This action cannot be undone.`
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
      <dt className="text-xs font-semibold uppercase text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-700">{value}</dd>
    </div>
  );
}
