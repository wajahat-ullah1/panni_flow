import { useState, useEffect, useCallback } from "react";
import {
  getSubscriptions,
  updateSubscription,
  updatePaymentStatus,
  cancelSubscription,
  renewSubscription,
} from "../../../shared/api/superAdminApi";

// helpers
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const fmtAmount = (n) =>
  typeof n === "number" ? `PKR ${n.toLocaleString()}` : "—";

const PLAN_LABEL = { basic: "Basic", standard: "Standard", premium: "Premium" };
const PLAN_UP    = { basic: "standard", standard: "premium" };
const PLAN_DOWN  = { premium: "standard", standard: "basic" };

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const planStyle = {
  premium:  { bg: "#f3e8ff", color: "#7c3aed" },
  standard: { bg: "#e0f2fe", color: "#0369a1" },
  basic:    { bg: "#f1f5f9", color: "#475569" },
};

const paymentStyle = {
  paid:     { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Paid"     },
  pending:  { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa", label: "Pending"  },
  failed:   { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3", label: "Failed"   },
  refunded: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe", label: "Refunded" },
};

const subStatusStyle = {
  active:    { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Active"    },
  expired:   { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3", label: "Expired"   },
  cancelled: { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0", label: "Cancelled" },
  suspended: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa", label: "Suspended" },
};

function Badge({ label, styles }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 500,
      background: styles.bg, color: styles.color,
      border: `1px solid ${styles.border || "transparent"}`,
    }}>
      {label}
    </span>
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
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ iconBg, icon, title, value, sub, subColor }) {
  return (
    <div style={{
      flex: 1, background: "#fff", borderRadius: 14,
      border: "1px solid #e8edf3", padding: "22px 24px",
      display: "flex", alignItems: "flex-start", gap: 18,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: subColor || "#22c55e", marginTop: 6, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
}

function InvoiceModal({ sub, onClose }) {
  const tenantName = sub.tenantId?.name ?? sub.tenantId ?? "—";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Subscription Details</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{tenantName}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#475569" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {[
          ["Company",        tenantName],
          ["Plan",           PLAN_LABEL[sub.plan] ?? sub.plan],
          ["Billing Cycle",  sub.billingCycle],
          ["Amount",         fmtAmount(sub.amount)],
          ["Payment Status", paymentStyle[sub.paymentStatus]?.label ?? sub.paymentStatus],
          ["Sub Status",     subStatusStyle[sub.status]?.label ?? sub.status],
          ["Billing Date",   fmtDate(sub.billingDate)],
          ["Expiry Date",    fmtDate(sub.expiryDate)],
          ...(sub.paymentReference ? [["Reference", sub.paymentReference]] : []),
          ...(sub.notes           ? [["Notes",     sub.notes]]            : []),
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{k}</span>
            <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 20 }}>
          <button onClick={onClose} style={{ width: "100%", padding: "10px 0", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ sub, onClose, onSaved }) {
  const [status, setStatus] = useState(sub.paymentStatus);
  const [ref, setRef]       = useState(sub.paymentReference || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");

  const handleSave = async () => {
    setSaving(true); setErr("");
    try {
      const res = await updatePaymentStatus(sub._id, status, ref ? { paymentReference: ref } : {});
      onSaved(res?.data ?? res);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update payment status.");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Update Payment Status</h3>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Payment Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", background: "#f8fafc" }}>
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Payment Reference <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
          <input value={ref} onChange={e => setRef(e.target.value)} placeholder="Transaction ID" style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", boxSizing: "border-box" }} />
        </div>
        {err && <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 10 }}>{err}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: saving ? 0.75 : 1 }}>{saving ? "Saving…" : "Save"}</button>
          <button onClick={onClose} style={{ padding: "10px 18px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Subscriptions() {
  const [subs, setSubs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [invoice, setInvoice]   = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [acting, setActing]     = useState(null);
  const [toast, setToast]       = useState(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await getSubscriptions({ limit: 20 });
      setSubs(Array.isArray(res?.data?.data) ? res.data?.data : []);
    } catch {
      setError("Failed to load subscriptions.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const patchSub = (updated) => {
    if (updated?._id) setSubs(prev => prev.map(s => s._id === updated._id ? { ...s, ...updated, tenantId: s.tenantId } : s));
  };

  const handleUpgrade = async (sub) => {
    const next = PLAN_UP[sub.plan];
    if (!next) { showToast("Already on highest plan.", "#f97316"); return; }
    setActing(sub._id);
    try {
      const res = await updateSubscription(sub._id, { plan: next });
      patchSub(res?.data ?? res);
      showToast(`Upgraded to ${PLAN_LABEL[next]}.`);
    } catch (e) {
      showToast(e?.response?.data?.message || "Upgrade failed.", "#ef4444");
    } finally { setActing(null); }
  };

  const handleDowngrade = async (sub) => {
    const next = PLAN_DOWN[sub.plan];
    if (!next) { showToast("Already on lowest plan.", "#f97316"); return; }
    setActing(sub._id);
    try {
      const res = await updateSubscription(sub._id, { plan: next });
      patchSub(res?.data ?? res);
      showToast(`Downgraded to ${PLAN_LABEL[next]}.`, "#f97316");
    } catch (e) {
      showToast(e?.response?.data?.message || "Downgrade failed.", "#ef4444");
    } finally { setActing(null); }
  };

  const handleCancel = async (sub) => {
    const name = sub.tenantId?.name ?? "this company";
    if (!window.confirm(`Cancel subscription for ${name}?`)) return;
    setActing(sub._id);
    try {
      const res = await cancelSubscription(sub._id);
      patchSub(res?.data ?? res);
      showToast("Subscription cancelled.", "#64748b");
    } catch (e) {
      showToast(e?.response?.data?.message || "Cancel failed.", "#ef4444");
    } finally { setActing(null); }
  };

  const handleRenew = async (sub) => {
    setActing(sub._id);
    try {
      const res = await renewSubscription(sub._id);
      patchSub(res?.data ?? res);
      showToast("Subscription renewed.");
    } catch (e) {
      showToast(e?.response?.data?.message || "Renewal failed.", "#ef4444");
    } finally { setActing(null); }
  };

  const filtered = subs.filter(s => {
    const name = (s.tenantId?.name ?? "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || s.plan.includes(q) || s.paymentStatus.includes(q) || s.status.includes(q);
  });

  const totalMRR      = subs.filter(s => s.status === "active").reduce((n, s) => n + (s.amount || 0), 0);
  const failedCount   = subs.filter(s => s.paymentStatus === "failed").length;
  const expiringCount = subs.filter(s => {
    if (!s.expiryDate) return false;
    const diff = new Date(s.expiryDate) - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(30px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>

      {invoice  && <InvoiceModal sub={invoice}  onClose={() => setInvoice(null)} />}
      {payModal && <PaymentModal sub={payModal} onClose={() => setPayModal(null)} onSaved={(u) => { patchSub(u); setPayModal(null); showToast("Payment status updated."); }} />}

      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 200, background: "#fff", borderRadius: 10, border: `1px solid ${toast.color}30`, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, color: toast.color, animation: "slideIn 0.25s ease" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: toast.color }} />
          {toast.msg}
        </div>
      )}

      <div style={{ background: "#fff", borderBottom: "1px solid #e8edf3", padding: "18px 32px", display: "flex", alignItems: "center", gap: 20, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>Subscription & Billing</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>Manage company subscriptions and payment status</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 10, padding: "9px 16px", width: 240 }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/><path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
          <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf3", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>All Subscriptions</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{subs.length} total</div>
            </div>
            <button onClick={fetchSubs} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 9, background: "#fff", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.86-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Refresh
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Company","Plan","Billing Cycle","Amount","Payment","Status","Billing Date","Expiry Date","Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #f1f5f9", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading subscriptions…</td></tr>
              ) : error ? (
                <tr><td colSpan={9} style={{ padding: "40px 24px", textAlign: "center" }}>
                  <p style={{ color: "#ef4444", marginBottom: 10 }}>{error}</p>
                  <button onClick={fetchSubs} style={{ padding: "8px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Retry</button>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No subscriptions found</td></tr>
              ) : filtered.map((s, i) => {
                const isActing   = acting === s._id;
                const ps         = paymentStyle[s.paymentStatus] ?? paymentStyle.pending;
                const ss         = subStatusStyle[s.status]      ?? subStatusStyle.active;
                const pl         = planStyle[s.plan]             ?? planStyle.basic;
                const tenantName = s.tenantId?.name ?? "—";
                const expiringSoon = (() => {
                  if (!s.expiryDate) return false;
                  const diff = new Date(s.expiryDate) - Date.now();
                  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
                })();
                return (
                  <tr key={s._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "15px 16px", fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{tenantName}</td>
                    <td style={{ padding: "15px 16px" }}><Badge label={PLAN_LABEL[s.plan] ?? s.plan} styles={pl} /></td>
                    <td style={{ padding: "15px 16px", fontSize: 12, color: "#6b7280", textTransform: "capitalize" }}>{s.billingCycle}</td>
                    <td style={{ padding: "15px 16px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{fmtAmount(s.amount)}</td>
                    <td style={{ padding: "15px 16px" }}><Badge label={ps.label} styles={ps} /></td>
                    <td style={{ padding: "15px 16px" }}><Badge label={ss.label} styles={ss} /></td>
                    <td style={{ padding: "15px 16px", fontSize: 12, color: "#6b7280" }}>{fmtDate(s.billingDate)}</td>
                    <td style={{ padding: "15px 16px", fontSize: 12, fontWeight: expiringSoon ? 700 : 400, color: expiringSoon ? "#e11d48" : "#6b7280" }}>
                      {fmtDate(s.expiryDate)}
                      {expiringSoon && <span style={{ marginLeft: 6, fontSize: 10, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, padding: "1px 5px" }}>Soon</span>}
                    </td>
                    <td style={{ padding: "15px 16px" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <ActionBtn color="#16a34a" title="Upgrade Plan" onClick={() => handleUpgrade(s)} disabled={isActing || !PLAN_UP[s.plan]}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </ActionBtn>
                        <ActionBtn color="#ea580c" title="Downgrade Plan" onClick={() => handleDowngrade(s)} disabled={isActing || !PLAN_DOWN[s.plan]}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </ActionBtn>
                        <ActionBtn color="#2563eb" title="Update Payment Status" onClick={() => setPayModal(s)} disabled={isActing}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20M6 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </ActionBtn>
                        {(s.status === "expired" || s.status === "cancelled") && (
                          <ActionBtn color="#0d9488" title="Renew" onClick={() => handleRenew(s)} disabled={isActing}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.86-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </ActionBtn>
                        )}
                        {s.status === "active" && (
                          <ActionBtn color="#ef4444" title="Cancel Subscription" onClick={() => handleCancel(s)} disabled={isActing}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </ActionBtn>
                        )}
                        <ActionBtn color="#7c3aed" title="View Details" onClick={() => setInvoice(s)} disabled={isActing}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          <StatCard
            iconBg="linear-gradient(135deg,#16a34a,#22c55e)"
            icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
            title="Total Active MRR"
            value={fmtAmount(totalMRR)}
            sub="Active subscriptions only"
            subColor="#16a34a"
          />
          <StatCard
            iconBg="linear-gradient(135deg,#ea580c,#f97316)"
            icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
            title="Failed Payments"
            value={failedCount}
            sub="Requires attention"
            subColor="#ea580c"
          />
          <StatCard
            iconBg="linear-gradient(135deg,#2563eb,#3b82f6)"
            icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
            title="Expiring Soon"
            value={expiringCount}
            sub="Within 7 days"
            subColor="#ea580c"
          />
        </div>
      </div>
    </div>
  );
}
