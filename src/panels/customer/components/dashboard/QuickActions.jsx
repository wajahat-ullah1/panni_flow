import { DropIcon, TruckIcon, DollarIcon, SubscriptionIcon } from "../icons/Icons";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../../../../shared/context/TenantContext";

export default function QuickActions() {
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  return (
    <div style={styles.card}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .qa-primary-btn {
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .qa-primary-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          opacity: 0;
          transition: opacity 0.18s;
        }
        .qa-primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14,165,233,0.4) !important;
        }
        .qa-primary-btn:hover::after { opacity: 1; }
        .qa-primary-btn:active { transform: translateY(0) scale(0.98); }

        .qa-secondary-btn {
          transition: all 0.18s ease;
        }
        .qa-secondary-btn:hover {
          background: #eff6ff !important;
          border-color: #bae6fd !important;
          color: #0369a1 !important;
          transform: translateX(2px);
        }

        @keyframes qaSubPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.15); }
          50%      { box-shadow: 0 0 0 6px rgba(14,165,233,0); }
        }
        .qa-sub-card { animation: qaSubPulse 3s ease infinite; }
      `}</style>

      {/* Header */}
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <p style={styles.sectionSub}>Shortcuts for your workflow</p>
      </div>

      {/* Buttons */}
      <div style={styles.buttons}>
        <button style={styles.primary} className="qa-primary-btn" onClick={() => navigate(`/${tenantId}/customer/order-water`)}>
          <DropIcon stroke="white" />
          Order Water Now
        </button>
        <button style={styles.secondary} className="qa-secondary-btn" onClick={() => navigate(`/${tenantId}/customer/live-tracking`)}>
          <TruckIcon stroke="currentColor" />
          Track Delivery
        </button>
        <button style={styles.secondary} className="qa-secondary-btn" onClick={() => navigate(`/${tenantId}/customer/payments`)}>
          <DollarIcon stroke="currentColor" />
          View Payments
        </button>
      </div>

      {/* Subscription card */}
      <div style={styles.subCard} className="qa-sub-card">
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
    background: "#ffffff",
    borderRadius: 16,
    padding: "22px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  sectionHead: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: "1px solid #f1f5f9",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 2px",
    letterSpacing: "-0.3px",
  },
  sectionSub: {
    fontSize: 13,
    color: "#94a3b8",
    margin: 0,
    fontWeight: 500,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  },
  primary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
    color: "white",
    fontWeight: 700,
    fontSize: 13.5,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(14,165,233,0.3)",
    fontFamily: "'DM Sans', sans-serif",
  },
  secondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "11px 16px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  subCard: {
    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    border: "1px solid #bfdbfe",
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
    boxShadow: "0 2px 8px rgba(14,165,233,0.18)",
  },
  subTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },
  subDetail: {
    fontSize: 11.5,
    color: "#64748b",
    marginTop: 2,
  },
  subNext: {
    fontSize: 11,
    color: "#0369a1",
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
    background: "#0ea5e9",
    display: "inline-block",
    flexShrink: 0,
  },
};