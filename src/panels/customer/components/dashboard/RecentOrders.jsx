import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderRow from "./OrderRow";
import { ChevronRight } from "../icons/Icons";
import customerApi from "../../../../shared/api/customerApi";
import { useTenant } from "../../../../shared/context/TenantContext";

export default function RecentOrders() {
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    customerApi
      .getOrders({ page: 1, limit: 5, sort: "createdAt" })
      .then((res) => {
        console.log("API response for recent orders:", res);
        const list = res.data?.data ?? [];
        setOrders(list);
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.card}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes roFadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ro-card { animation: roFadeUp 0.4s ease both; }

        .ro-view-all-btn {
          transition: all 0.18s ease;
        }
        .ro-view-all-btn:hover {
          gap: 8px !important;
          color: #0369a1 !important;
        }

        @keyframes roPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ro-skeleton {
          animation: roPulse 1.4s ease infinite;
          background: linear-gradient(90deg, #f1f5f9, #e9f0f8, #f1f5f9);
          background-size: 400% 100%;
          border-radius: 12px;
          height: 64px;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Recent Orders</h2>
          <p style={styles.subtitle}>Your latest water deliveries</p>
        </div>
        <button
          style={styles.viewAll}
          className="ro-view-all-btn"
          onClick={() => navigate(`/${tenantId}/customer/my-orders`)}
        >
          View All <ChevronRight />
        </button>
      </div>

      <div style={styles.list}>
        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="ro-skeleton" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </>
        )}

        {error && (
          <div style={styles.errorState}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={styles.emptyState}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="1.5"/>
              <path d="M8 12l2 2 4-4" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight: 700, color: "#475569", fontSize: 15 }}>No orders yet</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Your order history will appear here</span>
          </div>
        )}

        {!loading && !error && orders.map((order, i) => (
          <div
            key={order._id || order.id}
            style={{ animation: `roFadeUp 0.35s ${i * 60}ms ease both` }}
          >
            <OrderRow order={order} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "22px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: "1px solid #f1f5f9",
  },
  title: {
    fontSize: 17,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 2px",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    margin: 0,
    fontWeight: 500,
  },
  viewAll: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    border: "none",
    background: "transparent",
    color: "#0ea5e9",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "36px 0",
    color: "#94a3b8",
    fontSize: 13,
  },
  errorState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "24px 0",
    color: "#ef4444",
    fontSize: 13,
    fontWeight: 600,
  },
};