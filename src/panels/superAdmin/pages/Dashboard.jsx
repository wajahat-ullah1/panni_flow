import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { getSuperAdminDashboard } from "../../../shared/api/superAdminApi";

const notifications = [
  // {
  //   id: 1,
  //   type: "success",
  //   message: "New company registered: Aqua Fresh Ltd",
  //   time: "5 min ago",
  //   dotColor: "#22c55e",
  //   bg: "#f0fdf4",
  //   border: "#bbf7d0",
  // },
  // {
  //   id: 2,
  //   type: "warning",
  //   message: "Subscription expiring for Panni Flow in 3 days",
  //   time: "1 hour ago",
  //   dotColor: "#f97316",
  //   bg: "#fff7ed",
  //   border: "#fed7aa",
  // },
  // {
  //   id: 3,
  //   type: "error",
  //   message: "Payment failed for Crystal Waters",
  //   time: "2 hours ago",
  //   dotColor: "#ef4444",
  //   bg: "#fef2f2",
  //   border: "#fecaca",
  // },
  // {
  //   id: 4,
  //   type: "info",
  //   message: "High system usage detected",
  //   time: "3 hours ago",
  //   dotColor: "#3b82f6",
  //   bg: "#eff6ff",
  //   border: "#bfdbfe",
  // },
];

const statCards = [
  {
    label: "Total Companies",
    value: "32",
    change: "+12.5% from last month",
    iconBg: "#2563eb",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3 21h18M9 21v-5h6v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="7" width="2" height="2" rx=".5" fill="#fff"/>
        <rect x="13" y="7" width="2" height="2" rx=".5" fill="#fff"/>
        <rect x="9" y="11" width="2" height="2" rx=".5" fill="#fff"/>
        <rect x="13" y="11" width="2" height="2" rx=".5" fill="#fff"/>
      </svg>
    ),
  },
  {
    label: "Active Companies",
    value: "28",
    change: "+8.3% from last month",
    iconBg: "#0d9488",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Total Users",
    value: "950",
    change: "+18.7% from last month",
    iconBg: "#16a34a",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="1.8"/>
        <path d="M1 21c0-4 3.582-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="19" cy="7" r="3" stroke="#fff" strokeWidth="1.6"/>
        <path d="M23 21c0-3-1.791-5.5-4-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Platform Revenue",
    value: "$58.6K",
    change: "+24.5% from last month",
    iconBg: "#ea580c",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8"/>
        <path d="M12 6v1.5M12 16.5V18M9 9.5C9 8.1 10.3 7 12 7s3 1.1 3 2.5c0 1.7-1.5 2.5-3 2.5s-3 .8-3 2.5c0 1.4 1.3 2.5 3 2.5s3-1.1 3-2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function StatCard({ card }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e8edf3",
      padding: "22px 24px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flex: 1,
      minWidth: 0,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"}
    >
      <div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{card.label}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.1 }}>
          {card.value}
        </div>
        <div style={{ fontSize: 12, color: "#22c55e", marginTop: 8, fontWeight: 500 }}>{card.change}</div>
      </div>
      <div style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: card.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {card.icon}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const superAdminUser = JSON.parse(localStorage.getItem("superAdminUser") || "{}");

  useEffect(() => {
    getSuperAdminDashboard()
      .then((res) => {
        setDashData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  const stats = dashData?.stats ?? {};
  const growthData = (dashData?.companyGrowth ?? []).map((d) => ({
    month: d.month,
    Companies: d.companies,
    Users: d.users,
  }));
  const revenueData = (dashData?.monthlyRevenue ?? []).map((d) => ({
    month: d.month,
    Revenue: d.revenue,
  }));

  const liveStatCards = [
    {
      label: "Total Companies",
      value: loading ? "–" : String(stats.totalCompanies ?? 0),
      change: loading ? "" : `${stats.totalCompaniesChange >= 0 ? "+" : ""}${stats.totalCompaniesChange ?? 0}% from last month`,
      iconBg: "#2563eb",
      icon: statCards[0].icon,
    },
    {
      label: "Active Companies",
      value: loading ? "–" : String(stats.activeCompanies ?? 0),
      change: loading ? "" : `${stats.activeCompaniesChange >= 0 ? "+" : ""}${stats.activeCompaniesChange ?? 0}% from last month`,
      iconBg: "#0d9488",
      icon: statCards[1].icon,
    },
    {
      label: "Suspended",
      value: loading ? "–" : String(stats.suspendedCompanies ?? 0),
      change: "",
      iconBg: "#dc2626",
      icon: statCards[2].icon,
    },
    {
      label: "Trial Companies",
      value: loading ? "–" : String(stats.trialCompanies ?? 0),
      change: "",
      iconBg: "#ea580c",
      icon: statCards[3].icon,
    },
  ];

  if (loading) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#f8fafc", fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh", gap: 16,
      }}>
        <div style={{
          width: 44, height: 44,
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
          Loading dashboard…
        </span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e8edf3",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>
            Super Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0", fontWeight: 400 }}>
            Manage companies, users, and platform operations
          </p>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#f1f5f9", borderRadius: 10, padding: "9px 16px",
          width: 240,
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            placeholder="Search..."
            style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: 13, color: "#475569", width: "100%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{
            position: "absolute", top: -3, right: -3,
            width: 9, height: 9, borderRadius: "50%",
            background: "#ef4444", border: "2px solid #fff",
          }}/>
        </div>

        {/* Avatar */}
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
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>
              {superAdminUser?.fullName || "Super Admin"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              {superAdminUser?.email || "admin@system.com"}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "28px 32px" }}>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 10, padding: "12px 18px", marginBottom: 20,
            color: "#dc2626", fontSize: 13, fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
          {liveStatCards.map((card) => <StatCard key={card.label} card={card} />)}
        </div>

        {/* Charts Row */}
        <div style={{ display: "flex", gap: 18, marginBottom: 24 }}>
          {/* Growth Chart */}
          <div style={{
            flex: 1, background: "#fff", borderRadius: 14,
            border: "1px solid #e8edf3", padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ color: "#2563eb", fontSize: 16 }}>↗</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Company Growth Over Time</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  itemStyle={{ color: "#475569" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>}
                />
                <Line type="monotone" dataKey="Companies" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: "#2563eb" }} />
                <Line type="monotone" dataKey="Users" stroke="#0d9488" strokeWidth={2} dot={{ r: 4, fill: "#0d9488" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div style={{
            flex: 1, background: "#fff", borderRadius: 14,
            border: "1px solid #e8edf3", padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ color: "#16a34a", fontSize: 16 }}>$</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Monthly Platform Revenue</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="Revenue" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Notifications */}
        <div style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid #e8edf3", padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="#f97316" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>System Notifications</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{
                background: n.bg,
                border: `1px solid ${n.border}`,
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                cursor: "default",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateX(3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: n.dotColor, flexShrink: 0, marginTop: 4,
                }}/>
                <div>
                  <div style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 500 }}>{n.message}</div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
