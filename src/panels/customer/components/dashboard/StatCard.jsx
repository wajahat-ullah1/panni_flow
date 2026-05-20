import { TrendUp, TrendDown } from "../icons/Icons";

export default function StatCard({ label, value, trend, icon, iconBg, trendColor, trendNoArrow, trendDirection }) {
  return (
    <div style={styles.card} className="csc-card">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .csc-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .csc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important;
        }
      `}</style>
      <div style={styles.top}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.label}>{label}</div>
          <div style={styles.value}>{value}</div>
        </div>
        <div style={{ ...styles.iconWrap, background: iconBg }}>
          {icon}
        </div>
      </div>
      <div style={styles.trendRow}>
        {!trendNoArrow && trendDirection === "up" && (
          <span style={{ color: trendColor, display: "flex" }}><TrendUp /></span>
        )}
        {!trendNoArrow && trendDirection === "down" && (
          <span style={{ color: trendColor, display: "flex" }}><TrendDown /></span>
        )}
        <span style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{trend}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "22px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    border: "1px solid #f1f5f9",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  label: {
    fontSize: 11.5,
    color: "#64748b",
    fontWeight: 600,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  value: {
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.1,
    letterSpacing: "-0.5px",
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  trendRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
};