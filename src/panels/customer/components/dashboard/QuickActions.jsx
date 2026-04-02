import { DropIcon, TruckIcon, DollarIcon, SubscriptionIcon } from "../icons/Icons";

export default function QuickActions() {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Quick Actions</div>

      <div style={styles.buttons}>
        <button style={styles.primary}>
          <DropIcon stroke="white" />
          Order Water Now
        </button>
        <button style={styles.secondary}>
          <TruckIcon stroke="#475569" />
          Track Delivery
        </button>
        <button style={styles.secondary}>
          <DollarIcon stroke="#475569" />
          View Payments
        </button>
      </div>

      <div style={styles.subCard}>
        <div style={styles.subIconWrap}>
          <SubscriptionIcon />
        </div>
        <div>
          <div style={styles.subTitle}>Active Subscription</div>
          <div style={styles.subDetail}>Weekly delivery – 5 bottles</div>
          <div style={styles.subNext}>Next delivery: Apr 2, 2026</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 14,
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  title: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  buttons: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  primary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "13px",
    borderRadius: 11,
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  secondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "12px",
    borderRadius: 11,
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#475569",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  subCard: {
    marginTop: 16,
    background: "linear-gradient(135deg,#faf5ff,#ede9fe)",
    borderRadius: 12,
    padding: "14px",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    border: "1px solid #e9d5ff",
  },
  subIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 1px 4px rgba(168,85,247,0.15)",
  },
  subTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  subDetail: { fontSize: 11, color: "#64748b", marginTop: 2 },
  subNext: { fontSize: 11, color: "#a855f7", fontWeight: 600, marginTop: 4 },
};
