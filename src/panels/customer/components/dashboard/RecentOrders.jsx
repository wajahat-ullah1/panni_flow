import { useState, useEffect, useCallback } from "react";
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
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [reorderingOrderId, setReorderingOrderId] = useState(null);
  const [reorderError, setReorderError] = useState(null);
  const [reorderMessage, setReorderMessage] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    customerApi
      .getOrders({ page: 1, limit: 5, sort: "createdAt" })
      .then((res) => {
        const list = res.data?.data ?? [];
        setOrders(list);
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, reloadKey]);

  const handleReorder = useCallback(async (order) => {
    if (!order) return;

    const payload = {
      customerId: order.customerId?._id || order.customerId || "",
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
      deliveryAddress: {
        label: order.deliveryAddress?.label || "",
        street: order.deliveryAddress?.street || "",
        landmark: order.deliveryAddress?.landmark || "",
        city: order.deliveryAddress?.city || "",
        state: order.deliveryAddress?.state || "",
        postalCode: order.deliveryAddress?.postalCode || "",
        coordinates: order.deliveryAddress?.coordinates || {},
      },
      items: (order.items || []).map((item) => ({
        productId: item.productId?._id || item.productId,
        productName: item.productName || item.name || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      paymentMethod: order.paymentMethod || "cod",
      notes: order.notes || "",
      scheduledDate: order.scheduledDate,
      scheduledTimeSlot: order.scheduledTimeSlot,
    };

    if (!payload.customerId || payload.items.length === 0) {
      setReorderError("Unable to create reorder from this order. Missing required order details.");
      return;
    }

    setReorderError(null);
    setReorderMessage(null);
    setReorderingOrderId(order._id || order.id);

    try {
      const response = await customerApi.placeOrder(payload);
      setReorderMessage(
        response?.orderNumber
          ? `Reorder placed successfully! New order: ${response.orderNumber}`
          : "Reorder placed successfully!"
      );
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      setReorderError(
        err?.response?.data?.message || err?.message || "Failed to place reorder. Please try again."
      );
    } finally {
      setReorderingOrderId(null);
      setConfirmOrder(null);
    }
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
            <OrderRow
              order={order}
              isReordering={reorderingOrderId === (order._id || order.id)}
              onRequestConfirm={setConfirmOrder}
            />
          </div>
        ))}

        {confirmOrder && (
          <div>
            <div style={styles.modalOverlay} onClick={() => setConfirmOrder(null)} />
            <div style={styles.modalWrapper}>
              <div style={styles.modalBox}>
                <div style={styles.modalHeader}>Confirm Reorder</div>
                <div style={styles.modalBody}>
                  <p style={styles.modalText}>
                    Reorder <strong>{confirmOrder.orderNumber || confirmOrder._id || confirmOrder.id}</strong> with the same items and delivery address?
                  </p>
                </div>
                <div style={styles.modalFooter}>
                  <button style={styles.modalCancelBtn} onClick={() => setConfirmOrder(null)}>
                    Cancel
                  </button>
                  <button style={styles.modalConfirmBtn} onClick={() => handleReorder(confirmOrder)}>
                    Confirm Reorder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    zIndex: 99,
  },
  modalWrapper: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 100,
    pointerEvents: "none",
  },
  modalBox: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 18,
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
    padding: 24,
    pointerEvents: "auto",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 14,
  },
  modalBody: {
    marginBottom: 22,
  },
  modalText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 1.6,
    margin: 0,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalCancelBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#475569",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  modalConfirmBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};