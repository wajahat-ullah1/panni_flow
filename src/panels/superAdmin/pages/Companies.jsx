import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTenants, updateTenant, updateTenantStatus, deleteTenant, uploadTenantLogo } from "../../../shared/api/superAdminApi";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1")
  .replace(/\/api\/v\d+\/?$/, "");

const APP_BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;

// ── helpers ────────────────────────────────────────────────────────────────────
const PALETTE = ["#3b82f6","#06b6d4","#0ea5e9","#6366f1","#8b5cf6","#ec4899","#14b8a6","#f97316"];
const colorFor = (str) => PALETTE[(str || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
const initials = (name) => (name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const fmtDate  = (iso) => iso ? new Date(iso).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "-";

const statusStyle = {
  active:    { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Active"    },
  suspended: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3", label: "Suspended" },
  trial:     { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa", label: "Trial"     },
};

function Badge({ label, styles }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 500,
      background: styles.bg, color: styles.color,
      border: styles.border ? `1px solid ${styles.border}` : "none",
    }}>
      {label}
    </span>
  );
}

function EditModal({ tenant, onClose, onSaved }) {
  const logoInputRef = useRef();
  const [form, setForm] = useState({
    name:    tenant.name    || "",
    email:   tenant.email   || "",
    phone:   tenant.phone   || "",
    street:  tenant.address?.street  || "",
    city:    tenant.address?.city    || "",
    state:   tenant.address?.state   || "",
    country: tenant.address?.country || "",
    currency:    tenant.settings?.currency    || "",
    timezone:    tenant.settings?.timezone    || "",
    orderPrefix: tenant.settings?.orderPrefix || "",
  });
  const [logoFile, setLogoFile]       = useState(null);   // File to upload
  const [logoPreview, setLogoPreview] = useState(        // preview URL
    tenant.logo ? `${API_ORIGIN}${tenant.logo}` : null
  );
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState("");

  const inp = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setApiError("Name and email are required.");
      return;
    }
    setSaving(true);
    setApiError("");
    try {
      const res = await updateTenant(tenant._id, {
        name:  form.name,
        email: form.email,
        phone: form.phone || undefined,
        address: { street: form.street || undefined, city: form.city || undefined, state: form.state || undefined, country: form.country || undefined },
        settings: { currency: form.currency || undefined, timezone: form.timezone || undefined, orderPrefix: form.orderPrefix || undefined },
      });
      let updated = res?.data ?? res;
      if (logoFile) {
        const logoRes = await uploadTenantLogo(tenant._id, logoFile);
        updated = { ...updated, ...(logoRes?.data ?? logoRes) };
      }
      onSaved(updated);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, placeholder, type = "text") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={inp(key)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#0f172a", background: "#f8fafc", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "#2563eb"}
        onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", width: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Edit Company</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 12 }}>COMPANY INFO</div>

        {/* Logo upload */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Company Logo</label>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, flexShrink: 0,
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#cbd5e1" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#cbd5e1"/><path d="M21 15l-5-5L5 21" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </div>
            <div>
              <button
                type="button"
                onClick={() => logoInputRef.current.click()}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {logoPreview ? "Change Logo" : "Upload Logo"}
              </button>
              <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: "none" }} onChange={handleLogoChange} />
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "5px 0 0" }}>JPG, PNG, GIF, WEBP · max 2 MB</p>
            </div>
          </div>
        </div>

        {field("Company Name *", "name", "e.g., Acme Water")}
        {field("Email *", "email", "contact@company.com", "email")}
        {field("Phone", "phone", "+1 555 000 0000")}

        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", margin: "18px 0 12px" }}>ADDRESS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>{field("Street", "street", "123 Main St")}</div>
          <div>{field("City", "city", "Dubai")}</div>
          <div>{field("State", "state", "Dubai")}</div>
          <div>{field("Country", "country", "UAE")}</div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", margin: "18px 0 12px" }}>SETTINGS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>{field("Currency", "currency", "PKR")}</div>
          <div>{field("Timezone", "timezone", "Asia/Dubai")}</div>
          <div>{field("Order Prefix", "orderPrefix", "ORD")}</div>
        </div>

        {apiError && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 10, marginBottom: 0 }}>{apiError}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 1, padding: "11px 0", background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: saving ? 0.75 : 1 }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            style={{ padding: "11px 22px", background: "#fff", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ color, title, children, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: "50%",
        border: `1.5px solid ${color}`,
        background: hov ? color + "18" : "transparent",
        color, cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s", flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // tenant id to confirm
  const [editTarget, setEditTarget]       = useState(null); // tenant object to edit
  const [copiedSlug, setCopiedSlug]         = useState(null); // slug whose link was just copied

  const copyAppLink = (slug) => {
    const link = `${APP_BASE_URL}/${slug}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTenants({ limit: 100 });
      setCompanies(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch {
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const handleToggleStatus = async (tenant) => {
    const next = tenant.status === "suspended" ? "active" : "suspended";
    setActionLoading(tenant._id);
    try {
      await updateTenantStatus(tenant._id, next);
      setCompanies((prev) => prev.map((t) => t._id === tenant._id ? { ...t, status: next } : t));
    } catch {
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    setConfirmDelete(null);
    try {
      await deleteTenant(id);
      setCompanies((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete company");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = companies.filter((c) =>
    (c.name  || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.slug  || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSaved = (updated) => {
    if (updated?._id) {
      setCompanies(prev => prev.map(t => t._id === updated._id ? { ...t, ...updated } : t));
    }
    setEditTarget(null);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Edit modal */}
      {editTarget && <EditModal tenant={editTarget} onClose={() => setEditTarget(null)} onSaved={handleSaved} />}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: 28, width: 360,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 16, color: "#0f172a" }}>Delete Company?</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>
              This action is irreversible. The company and all its data will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: "10px 0", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8edf3",
        padding: "18px 32px", display: "flex", alignItems: "center", gap: 20,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>
            Companies
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
            Manage all registered water delivery companies
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 10, padding: "9px 16px", width: 240 }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf3", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>

          {/* Table Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>All Companies</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{companies.length} registered</div>
            </div>
            <button
              onClick={() => navigate("/super-admin/register-company")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Register New Company
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading companies…</div>
          ) : error ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ color: "#ef4444", marginBottom: 12 }}>{error}</p>
              <button onClick={fetchCompanies} style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Retry</button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Company", "Slug / App Link", "Email", "Status", "Created", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #f1f5f9", letterSpacing: "0.02em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No companies found</td></tr>
                ) : (
                  filtered.map((c, i) => {
                    const ss = statusStyle[c.status] || statusStyle.trial;
                    const isActing = actionLoading === c._id;
                    return (
                      <tr
                        key={c._id}
                        style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Company */}
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: colorFor(c._id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                              {c.logo
                                ? <img src={`${API_ORIGIN}${c.logo}`} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                : initials(c.name)
                              }
                            </div>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{c.name}</span>
                          </div>
                        </td>
                        {/* Slug + copy link */}
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{c.slug}</span>
                            <button
                              title={`Copy app link: ${APP_BASE_URL}/${c.slug}`}
                              onClick={() => copyAppLink(c.slug)}
                              style={{
                                border: `1px solid ${copiedSlug === c.slug ? "#bbf7d0" : "#e2e8f0"}`,
                                borderRadius: 6,
                                background: copiedSlug === c.slug ? "#f0fdf4" : "#fff",
                                cursor: "pointer",
                                padding: "3px 7px",
                                display: "flex", alignItems: "center", gap: 4,
                                color: copiedSlug === c.slug ? "#16a34a" : "#94a3b8",
                                fontSize: 11, fontWeight: 600,
                                fontFamily: "'DM Sans', sans-serif",
                                transition: "all 0.15s",
                                flexShrink: 0,
                              }}
                            >
                              {copiedSlug === c.slug ? (
                                <>
                                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                                    <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                  </svg>
                                  Copy Link
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                        {/* Email */}
                        <td style={{ padding: "16px 24px", fontSize: 13, color: "#6b7280" }}>{c.email}</td>
                        {/* Status */}
                        <td style={{ padding: "16px 24px" }}>
                          <Badge label={ss.label} styles={ss} />
                        </td>
                        {/* Created */}
                        <td style={{ padding: "16px 24px", fontSize: 13, color: "#6b7280" }}>{fmtDate(c.createdAt)}</td>
                        {/* Actions */}
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <ActionBtn
                              color="#2563eb"
                              title="Edit"
                              onClick={() => setEditTarget(c)}
                              disabled={isActing}
                            >
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </ActionBtn>
                            <ActionBtn
                              color={c.status === "suspended" ? "#16a34a" : "#f97316"}
                              title={c.status === "suspended" ? "Activate" : "Suspend"}
                              onClick={() => handleToggleStatus(c)}
                              disabled={isActing}
                            >
                              {c.status === "suspended" ? (
                                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              ) : (
                                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M10 9v6m4-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                              )}
                            </ActionBtn>
                            <ActionBtn
                              color="#ef4444"
                              title="Delete"
                              onClick={() => setConfirmDelete(c._id)}
                              disabled={isActing}
                            >
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </ActionBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

