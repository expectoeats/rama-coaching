"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Field, TextInput } from "@/components/ui/Field";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  lastLoginAt: string | null;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Name form
  const [name, setName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setProfile(j.data);
          setName(j.data.name);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Save Name ──────────────────────────────────────────────
  async function saveName() {
    if (!name.trim()) return;
    setNameSaving(true);
    setNameMsg(null);
    try {
      const r = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const j = await r.json();
      if (j.success) {
        setProfile((p) => p ? { ...p, name: j.data.name } : p);
        setNameMsg({ type: "ok", text: "Name updated successfully!" });
      } else {
        setNameMsg({ type: "err", text: j.error || "Failed to update name" });
      }
    } catch {
      setNameMsg({ type: "err", text: "Network error" });
    }
    setNameSaving(false);
    setTimeout(() => setNameMsg(null), 3000);
  }

  // ── Save Password ──────────────────────────────────────────
  async function savePassword() {
    setPwMsg(null);
    if (!currentPw || !newPw || !confirmPw) {
      setPwMsg({ type: "err", text: "All password fields are required" });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "err", text: "New passwords do not match" });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: "err", text: "Password must be at least 6 characters" });
      return;
    }
    setPwSaving(true);
    try {
      const r = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const j = await r.json();
      if (j.success) {
        setPwMsg({ type: "ok", text: "Password changed successfully!" });
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } else {
        setPwMsg({ type: "err", text: j.error || "Failed to change password" });
      }
    } catch {
      setPwMsg({ type: "err", text: "Network error" });
    }
    setPwSaving(false);
    setTimeout(() => setPwMsg(null), 4000);
  }

  // ── Upload Avatar ──────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        setAvatarMsg({ type: "err", text: uploadJson.error || "Upload failed" });
        setAvatarUploading(false);
        return;
      }
      const avatarUrl = uploadJson.data.url;
      const r = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      const j = await r.json();
      if (j.success) {
        setProfile((p) => p ? { ...p, avatarUrl: j.data.avatarUrl } : p);
        setAvatarMsg({ type: "ok", text: "Profile picture updated!" });
      } else {
        setAvatarMsg({ type: "err", text: j.error || "Failed to save avatar" });
      }
    } catch {
      setAvatarMsg({ type: "err", text: "Network error during upload" });
    }
    setAvatarUploading(false);
    setTimeout(() => setAvatarMsg(null), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-navy" />
      </div>
    );
  }

  const initials = (profile?.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Update your admin name, password and profile picture"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Left: Avatar + Info ── */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-slate-100 shadow"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-navy flex items-center justify-center border-4 border-slate-100 shadow">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#b91c1c] flex items-center justify-center text-white shadow-lg hover:bg-[#991b1b] transition-colors disabled:opacity-60"
                title="Change profile picture"
              >
                {avatarUploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Avatar message */}
            {avatarMsg && (
              <div className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${avatarMsg.type === "ok" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                {avatarMsg.type === "ok" ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                {avatarMsg.text}
              </div>
            )}

            <div className="text-center">
              <p className="text-base font-semibold text-slate-800">{profile?.name}</p>
              <p className="text-sm text-slate-500 mt-0.5">{profile?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy capitalize">
                {profile?.role}
              </span>
            </div>

            {/* Meta info */}
            <div className="w-full border-t border-slate-100 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>Role: {profile?.role}</span>
              </div>
              {profile?.lastLoginAt && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>Last login: {new Date(profile.lastLoginAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Click the camera icon to change your profile picture (max 2MB)
            </p>
          </div>
        </div>

        {/* ── Right: Forms ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Update Name */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <User className="h-5 w-5 text-navy" />
              <h2 className="text-base font-semibold text-slate-800">Update Display Name</h2>
            </div>
            <div className="space-y-4">
              <Field label="Display Name" required>
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </Field>
              <Field label="Email" >
                <TextInput
                  value={profile?.email || ""}
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                  placeholder=""
                />
              </Field>

              {nameMsg && (
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${nameMsg.type === "ok" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                  {nameMsg.type === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {nameMsg.text}
                </div>
              )}

              <button
                type="button"
                onClick={saveName}
                disabled={nameSaving || !name.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50 transition-colors"
              >
                {nameSaving ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Saving…</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Save Name</>
                )}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="h-5 w-5 text-navy" />
              <h2 className="text-base font-semibold text-slate-800">Change Password</h2>
            </div>
            <div className="space-y-4">
              {/* Current password */}
              <Field label="Current Password" required>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                  />
                  <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              {/* New password */}
              <Field label="New Password" required>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                  />
                  <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPw && (
                  <div className="mt-2 flex items-center gap-2">
                    {[4, 6, 8].map((min, i) => (
                      <div key={min} className={`flex-1 h-1.5 rounded-full ${newPw.length >= min ? ["bg-red-400", "bg-amber-400", "bg-emerald-500"][i] : "bg-slate-200"}`} />
                    ))}
                    <span className="text-xs text-slate-400">
                      {newPw.length < 4 ? "Too short" : newPw.length < 6 ? "Weak" : newPw.length < 8 ? "Fair" : "Strong"}
                    </span>
                  </div>
                )}
              </Field>

              {/* Confirm */}
              <Field label="Confirm New Password" required>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Repeat new password"
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 ${confirmPw && confirmPw !== newPw ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-navy focus:ring-navy/20"}`}
                  />
                  {confirmPw && confirmPw === newPw && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  )}
                </div>
                {confirmPw && confirmPw !== newPw && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </Field>

              {pwMsg && (
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${pwMsg.type === "ok" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                  {pwMsg.type === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {pwMsg.text}
                </div>
              )}

              <button
                type="button"
                onClick={savePassword}
                disabled={pwSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#b91c1c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#991b1b] disabled:opacity-50 transition-colors"
              >
                {pwSaving ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Changing…</>
                ) : (
                  <><Lock className="h-4 w-4" /> Change Password</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
