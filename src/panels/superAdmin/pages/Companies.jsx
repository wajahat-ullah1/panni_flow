import { useState } from "react";

const initialCompanies = [
  {
    id: 1,
    initials: "PF",
    color: "#3b82f6",
    name: "Panni Flow",
    admin: "Ahmed Hassan",
    email: "ahmed@panniflow.com",
    plan: "Premium",
    status: "Active",
    created: "2026-01-15",
  },
  {
    id: 2,
    initials: "AF",
    color: "#06b6d4",
    name: "Aqua Fresh Ltd",
    admin: "Sara Ahmed",
    email: "sara@aquafresh.com",
    plan: "Standard",
    status: "Active",
    created: "2026-02-20",
  },
  {
    id: 3,
    initials: "CW",
    color: "#0ea5e9",
    name: "Crystal Waters",
    admin: "Mohamed Ali",
    email: "mohamed@crystalwaters.com",
    plan: "Basic",
    status: "Active",
    created: "2026-03-10",
  },
  {
    id: 4,
    initials: "PD",
    color: "#6366f1",
    name: "Pure Drop Co.",
    admin: "Fatima Noor",
    email: "fatima@puredrop.com",
    plan: "Premium",
    status: "Suspended",
    created: "2025-12-05",
  },
];

const planStyle = {
  Premium: { bg: "#f3e8ff", color: "#7c3aed" },
  Standard: { bg: "#e0f2fe", color: "#0369a1" },
  Basic: { bg: "#f1f5f9", color: "#475569" },
};

const statusStyle = {
  Active: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Suspended: { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
};

function Badge({ label, styles }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      background: styles.bg,
      color: styles.color,
      border: styles.border ? `1px solid ${styles.border}` : "none",
    }}>
      {label}
    </span>
  );
}



export default function Companies({ setActive }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState("");

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.admin.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>

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

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#f1f5f9", borderRadius: 10, padding: "9px 16px", width: 240,
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: 13, color: "#475569", width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        <div style={{ position: "relative", cursor: "pointer" }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ position: "absolute", top: -3, right: -3, width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }}/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#fff" opacity=".9"/>
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#fff" opacity=".7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>Super Admin</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>admin@system.com</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px" }}>
        <div style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid #e8edf3",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          {/* Table Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Companies</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Manage all registered water delivery companies
              </div>
            </div>
            <button
              onClick={() => setActive("Register Company")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Register New Company
            </button>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Company", "Admin", "Email", "Plan", "Status", "Created"].map(h => (
                  <th key={h} style={{
                    padding: "12px 24px", textAlign: "left",
                    fontSize: 12, fontWeight: 600, color: "#64748b",
                    borderBottom: "1px solid #f1f5f9", letterSpacing: "0.02em",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                    No companies found
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Company */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: c.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
                        }}>
                          {c.initials}
                        </div>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{c.name}</span>
                      </div>
                    </td>
                    {/* Admin */}
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "#374151" }}>{c.admin}</td>
                    {/* Email */}
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "#6b7280" }}>{c.email}</td>
                    {/* Plan */}
                    <td style={{ padding: "16px 24px" }}>
                      <Badge label={c.plan} styles={planStyle[c.plan] || planStyle.Basic} />
                    </td>
                    {/* Status */}
                    <td style={{ padding: "16px 24px" }}>
                      <Badge label={c.status} styles={statusStyle[c.status]} />
                    </td>
                    {/* Created */}
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "#6b7280" }}>{c.created}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
