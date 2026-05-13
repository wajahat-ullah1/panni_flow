import { DropIcon, TruckIcon, DollarIcon, SubscriptionIcon } from "../icons/Icons";

export default function QuickActions() {
  return (
    <div style={styles.card}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .qa-primary-btn {
          transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .qa-primary-btn::after {
          content:'';
          position:absolute;
          inset:0;
          background:rgba(255,255,255,0.15);
          opacity:0;
          transition:opacity 0.18s;
        }
        .qa-primary-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,165,233,0.35) !important; }
        .qa-primary-btn:hover::after { opacity:1; }
        .qa-primary-btn:active { transform: translateY(0) scale(0.98); }
        .qa-secondary-btn {
          transition: all 0.18s ease;
        }
        .qa-secondary-btn:hover {
          background: #f0f9ff !important;
          border-color: #bae6fd !important;
          color: #0284c7 !important;
          transform: translateX(2px);
        }
        @keyframes subCardPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.15); }
          50%      { box-shadow: 0 0 0 6px rgba(168,85,247,0); }
        }
        .sub-card { animation: subCardPulse 3s ease infinite; }
      `}</style>

      <div style={styles.titleRow}>
        <div style={styles.title}>Quick Actions</div>
        <div style={styles.titleDot} />
      </div>

      <div style={styles.buttons}>
        <button style={styles.primary} className="qa-primary-btn">
          <DropIcon stroke="white" />
          Order Water Now
        </button>
        <button style={styles.secondary} className="qa-secondary-btn">
          <TruckIcon stroke="currentColor" />
          Track Delivery
        </button>
        <button style={styles.secondary} className="qa-secondary-btn">
          <DollarIcon stroke="currentColor" />
          View Payments
        </button>
      </div>

      <div style={styles.subCard} className="sub-card">
        <div style={styles.subIconWrap}>
          <SubscriptionIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div style={styles.subTitle}>Active Subscription</div>
          <div style={styles.subDetail}>Weekly delivery – 5 bottles</div>
          <div style={styles.subNext}>
            <span style={styles.nextDot} />
            Next delivery: Apr 2, 2026
          </div>
        </div>
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
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
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
  titleDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    marginTop: 1,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 18,
  },
  primary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.1,
  },
  secondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    background: "#fafcff",
    color: "#475569",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  subCard: {
    background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    border: "1px solid #e9d5ff",
  },
  subIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(168,85,247,0.18)",
  },
  subTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    fontFamily: "'Syne', sans-serif",
  },
  subDetail: { fontSize: 11.5, color: "#64748b", marginTop: 2 },
  subNext: {
    fontSize: 11,
    color: "#7c3aed",
    fontWeight: 600,
    marginTop: 6,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  nextDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#a855f7",
    display: "inline-block",
    flexShrink: 0,
  },
};