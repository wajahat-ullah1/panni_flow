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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .orders-card { animation: fadeIn 0.4s ease both; }
        .view-all-btn { transition: all 0.18s ease; }
        .view-all-btn:hover { gap: 8px !important; color: #0284c7 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton-row { animation: pulse 1.4s ease infinite; background: linear-gradient(90deg,#f1f5f9,#e9f0f8,#f1f5f9); background-size:400% 100%; border-radius:12px; height:64px; }
      `}</style>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>Recent Orders</div>
          <div style={styles.subtitle}>Your latest water deliveries</div>
        </div>
        <button style={styles.viewAll} className="view-all-btn" onClick={() => navigate(`/${tenantId}/customer/my-orders`)}>
          View All <ChevronRight />
        </button>
      </div>

      <div style={styles.list}>
        {loading && (
          <>
            {[1,2,3].map(i => <div key={i} className="skeleton-row" style={{ animationDelay: `${i*120}ms` }} />)}
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
            <span style={{ fontSize: 32 }}>📦</span>
            <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>No orders yet</span>
            <span style={{ fontSize: 12 }}>Your order history will appear here</span>
          </div>
        )}
        {!loading && !error && orders.map((order, i) => (
          <div key={order._id || order.id} style={{ animation: `fadeIn 0.35s ${i * 60}ms ease both` }}>
            <OrderRow order={order} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 20,
    padding: "24px",
    boxShadow: "0 2px 16px rgba(15,23,42,0.07), 0 0 0 1px rgba(226,232,240,0.8)",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 16,
    borderBottom: "1px solid #f1f5f9",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 12, color: "#94a3b8", marginTop: 3 },
  viewAll: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    border: "none",
    background: "transparent",
    color: "#0ea5e9",
    fontWeight: 600,
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
    gap: 6,
    padding: "32px 0",
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
    fontWeight: 500,
  },
};