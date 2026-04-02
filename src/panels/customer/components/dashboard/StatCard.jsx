import { TrendUp } from "../icons/Icons";

export default function StatCard({ label, value, trend, icon, iconBg, trendColor, trendNoArrow }) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <div style={styles.label}>{label}</div>
          <div style={styles.value}>{value}</div>
        </div>
        <div style={{ ...styles.iconWrap, background: iconBg }}>{icon}</div>
      </div>
      <div style={styles.trendRow}>
        {!trendNoArrow && (
          <span style={{ color: trendColor }}>
            <TrendUp />
          </span>
        )}
        <span style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{trend}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 14,
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: { fontSize: 12, color: "#94a3b8", fontWeight: 500, marginBottom: 6 },
  value: { fontSize: 28, fontWeight: 700, color: "#0f172a", lineHeight: 1.1 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trendRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
};
