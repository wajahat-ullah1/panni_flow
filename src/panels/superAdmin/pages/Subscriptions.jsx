import { useState } from "react";

const initialSubs = [
  {
    id: 1,
    company: "Panni Flow",
    plan: "Premium",
    amount: "$399/mo",
    paymentStatus: "Active",
    billingDate: "2026-04-01",
    expiryDate: "2026-05-01",
    expiringSoon: false,
  },
  {
    id: 2,
    company: "Aqua Fresh Ltd",
    plan: "Standard",
    amount: "$199/mo",
    paymentStatus: "Active",
    billingDate: "2026-04-15",
    expiryDate: "2026-05-15",
    expiringSoon: false,
  },
  {
    id: 3,
    company: "Crystal Waters",
    plan: "Basic",
    amount: "$99/mo",
    paymentStatus: "Failed",
    billingDate: "2026-04-10",
    expiryDate: "2026-04-28",
    expiringSoon: true,
  },
  {
    id: 4,
    company: "Pure Drop Co.",
    plan: "Premium",
    amount: "$399/mo",
    paymentStatus: "Pending",
    billingDate: "2026-04-20",
    expiryDate: "2026-05-20",
    expiringSoon: false,
  },
];

const planStyle = {
  Premium: { bg: "#f3e8ff", color: "#7c3aed" },
  Standard: { bg: "#e0f2fe", color: "#0369a1" },
  Basic: { bg: "#f1f5f9", color: "#475569" },
};

const paymentStyle = {
  Active: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Failed: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
  Pending: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
};

function Badge({ label, styles }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: 20,
      fontSize: 12.5,
      fontWeight: 500,
      background: styles.bg,
      color: styles.color,
      border: `1px solid ${styles.border || "transparent"}`,
    }}>
      {label}
    </span>
  );
}

function ActionBtn({ color, title, children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        background: hov ? color + "18" : "transparent",
        color, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ iconBg, icon, title, value, sub, subColor }) {
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e8edf3",
      padding: "22px 24px",
      display: "flex",
      alignItems: "flex-start",
      gap: 18,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: subColor || "#22c55e", marginTop: 6, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
}

function InvoiceModal({ sub, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28, width: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Invoice</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub.company}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#475569" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {[
          ["Company", sub.company],
          ["Plan", sub.plan],
          ["Amount", sub.amount],
          ["Payment Status", sub.paymentStatus],
          ["Billing Date", sub.billingDate],
          ["Expiry Date", sub.expiryDate],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{k}</span>
            <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Close</button>
          <button style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}

export default function Subscriptions() {
  const [subs, setSubs] = useState(initialSubs);
  const [search, setSearch] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const handleUpgrade = (id) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.plan === "Basic" ? "Standard" : s.plan === "Standard" ? "Premium" : "Premium";
      const amounts = { Basic: "$99/mo", Standard: "$199/mo", Premium: "$399/mo" };
      if (s.plan === "Premium") { showToast("Already on highest plan", "#f97316"); return s; }
      showToast(`${s.company} upgraded to ${next}`);
      return { ...s, plan: next, amount: amounts[next] };
    }));
  };

  const handleDowngrade = (id) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.plan === "Premium" ? "Standard" : s.plan === "Standard" ? "Basic" : "Basic";
      const amounts = { Basic: "$99/mo", Standard: "$199/mo", Premium: "$399/mo" };
      if (s.plan === "Basic") { showToast("Already on lowest plan", "#f97316"); return s; }
      showToast(`${s.company} downgraded to ${next}`, "#f97316");
      return { ...s, plan: next, amount: amounts[next] };
    }));
  };

  const filtered = subs.filter(s =>
    s.company.toLowerCase().includes(search.toLowerCase()) ||
    s.plan.toLowerCase().includes(search.toLowerCase()) ||
    s.paymentStatus.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = subs.reduce((sum, s) => sum + parseInt(s.amount.replace(/\D/g, "")), 0);
  const failedCount = subs.filter(s => s.paymentStatus === "Failed").length;
  const expiringCount = subs.filter(s => s.expiringSoon).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      {invoice && <InvoiceModal sub={invoice} onClose={() => setInvoice(null)} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 200,
          background: "#fff", borderRadius: 10,
          border: `1px solid ${toast.color}30`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 13, fontWeight: 600, color: toast.color,
          animation: "slideIn 0.25s ease",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: toast.color }} />
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes slideIn { from { transform: translateX(30px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8edf3",
        padding: "18px 32px", display: "flex", alignItems: "center", gap: 20,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>
            Subscription & Billing
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
            Manage company subscriptions and payment status
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 10, padding: "9px 16px", width: 240 }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/><path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div style={{ position: "absolute", top: -3, right: -3, width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#fff" opacity=".9"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#fff" opacity=".7"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>Super Admin</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>admin@system.com</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Subscription & Billing</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>Manage company subscriptions and payment status</div>
        </div>

        {/* Table Card */}
        <div style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid #e8edf3",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden", marginBottom: 20,
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Company", "Plan", "Amount", "Payment Status", "Billing Date", "Expiry Date", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "14px 20px", textAlign: "left",
                    fontSize: 12, fontWeight: 700, color: "#64748b",
                    borderBottom: "1px solid #f1f5f9", letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                    No subscriptions found
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "18px 20px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                    {s.company}
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <Badge label={s.plan} styles={planStyle[s.plan] || planStyle.Basic} />
                  </td>
                  <td style={{ padding: "18px 20px", fontSize: 14, color: "#374151", fontWeight: 500 }}>
                    {s.amount}
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <Badge label={s.paymentStatus} styles={paymentStyle[s.paymentStatus]} />
                  </td>
                  <td style={{ padding: "18px 20px", fontSize: 13, color: "#6b7280" }}>
                    {s.billingDate}
                  </td>
                  <td style={{ padding: "18px 20px", fontSize: 13, fontWeight: s.expiringSoon ? 700 : 400, color: s.expiringSoon ? "#e11d48" : "#6b7280" }}>
                    {s.expiryDate}
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {/* Upgrade */}
                      <ActionBtn color="#16a34a" title="Upgrade Plan" onClick={() => handleUpgrade(s.id)}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                          <path d="M12 16V8M8 12l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </ActionBtn>
                      {/* Downgrade */}
                      <ActionBtn color="#ea580c" title="Downgrade Plan" onClick={() => handleDowngrade(s.id)}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                          <path d="M12 8v8M8 12l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </ActionBtn>
                      {/* Invoice */}
                      <ActionBtn color="#2563eb" title="View Invoice" onClick={() => setInvoice(s)}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 18 }}>
          <StatCard
            iconBg="linear-gradient(135deg, #16a34a, #22c55e)"
            icon={
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/>
                <path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
            title="Total MRR"
            value={`$${totalMRR.toLocaleString()}`}
            sub="+15.3% from last month"
            subColor="#16a34a"
          />
          <StatCard
            iconBg="linear-gradient(135deg, #ea580c, #f97316)"
            icon={
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/>
                <path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
            title="Failed Payments"
            value={failedCount}
            sub="Requires attention"
            subColor="#ea580c"
          />
          <StatCard
            iconBg="linear-gradient(135deg, #2563eb, #3b82f6)"
            icon={
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/>
                <path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
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
