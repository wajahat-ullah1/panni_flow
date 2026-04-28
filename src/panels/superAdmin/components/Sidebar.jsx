import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
      </svg>
    ),
  },
  {
    label: "Companies",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3 21h18M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7h2v2H9zM13 7h2v2h-2zM9 11h2v2H9zM13 11h2v2h-2z" fill="currentColor" opacity=".7"/>
      </svg>
    ),
  },
  {
    label: "Register Company",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 20c0-4 3.582-7 8-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M18 14v6M15 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Subscriptions",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M6 15h4M14 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside style={{
      width: 260,
      minHeight: "100vh",
      background: "#ffffff",
      borderRight: "1px solid #e8edf3",
      display: "flex",
      flexDirection: "column",
      padding: "28px 0 24px",
      flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8 2 5 8 5 12s3 8 7 8c2 0 4-1 5.5-3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 7c0 2-1.5 4-3 5l1 4h-4l1-4c-1.5-1-3-3-3-5a4 4 0 018 0z" fill="#ffffff80" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", letterSpacing: "-0.3px" }}>
              Mineral Water
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: isActive ? "#eff6ff" : "transparent",
                color: isActive ? "#2563eb" : "#475569",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                textAlign: "left",
                marginBottom: 2,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 12px 0" }}>
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#64748b",
            fontWeight: 500,
            fontSize: 14,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
