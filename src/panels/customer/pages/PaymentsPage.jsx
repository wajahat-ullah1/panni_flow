import { useState, useEffect, useCallback, useMemo } from "react";
import customerApi from "../../../shared/api/customerApi";

// ─── Static Data ────────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 1,
    icon: "cod",
    label: "Cash on Delivery",
    desc: "Pay when you receive your order",
    isDefault: true,
  },
  // ── Hidden until online payments are supported ──
  // {
  //   id: 2,
  //   icon: "card",
  //   label: "Credit Card",
  //   desc: "•••• •••• •••• 4532",
  //   isDefault: false,
  // },
];

const PAYMENT_TIPS = [
  "Cash on Delivery is the only accepted payment method",
  "Have exact change ready when your order arrives",
  "Payment is collected by the driver upon delivery",
  "Online payment options coming soon",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const METHOD_LABELS = { cod: "Cash on Delivery", card: "Credit Card" };

// ✅ Ported from App: full STATUS_CONFIG with bg/color for each status key
const STATUS_CONFIG = {
  paid:      { bg: "#dcfce7", color: "#15803d", label: "Paid" },
  delivered: { bg: "#dcfce7", color: "#15803d", label: "Delivered" },
  success:   { bg: "#dcfce7", color: "#15803d", label: "Success" },
  refunded:  { bg: "#fff7ed", color: "#ea580c", label: "Refunded" },
  pending:   { bg: "#fef3c7", color: "#b45309", label: "Pending" },
  cancelled: { bg: "#fee2e2", color: "#dc2626", label: "Cancelled" },
  failed:    { bg: "#fee2e2", color: "#dc2626", label: "Failed" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ✅ Ported from App: smarter mapTransaction that reads orderId.status
function mapTransaction(tx) {
  const rawPaymentStatus = (tx.status || "pending").toLowerCase();
  const orderStatus = tx.orderId?.status?.toLowerCase();

  // If order is delivered, override the payment status key so UI label is correct
  let finalStatusKey = rawPaymentStatus;
  if (orderStatus === "delivered") {
    finalStatusKey = "delivered";
  } else if (rawPaymentStatus === "pending" && orderStatus) {
    finalStatusKey = orderStatus;
  }

  const statusCfg = STATUS_CONFIG[finalStatusKey] || { label: finalStatusKey };
  const statusLabel = statusCfg.label ||
    finalStatusKey.charAt(0).toUpperCase() + finalStatusKey.slice(1).replace(/_/g, " ");

  const orderNum =
    typeof tx.orderId === "object"
      ? tx.orderId?.orderNumber
      : tx.orderNumber || tx.orderId;

  return {
    id:          tx._id || tx.id,
    invoice:     (tx._id || tx.id || "").slice(-8).toUpperCase(),
    order:       orderNum ?? "—",
    amount:      Number(tx.amount) || 0,
    date:        formatDate(tx.createdAt),
    dateObj:     tx.createdAt ? new Date(tx.createdAt) : new Date(),
    method:      METHOD_LABELS[tx.method] ?? tx.method ?? "Wallet",
    statusKey:   finalStatusKey,
    statusLabel,
  };
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────────
const DollarCircleIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v12M8 9.5c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5-1.5 2-4 2.5c-2.5.5-4 1.5-4 3S9.5 18 12 18s4-1 4-2.5"/>
  </svg>
);

const CodIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20"/>
    <path d="M7 15h.01M11 15h2"/>
  </svg>
);

const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3A7 7 0 0 1 5 9a7 7 0 0 1 7-7z"/>
  </svg>
);

const GreenDollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const InvoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────────
// ✅ Now reads from STATUS_CONFIG by statusKey instead of a hardcoded 3-key map
function StatusBadge({ statusKey, statusLabel }) {
  const cfg = STATUS_CONFIG[statusKey] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11.5,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
    }}>
      {statusLabel}
    </span>
  );
}

// ─── Stat Card (right column) ─────────────────────────────────────────────────────
function StatCard({ iconBg, icon, label, value, sub, subColor }) {
  return (
    <div style={styles.statCard}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 12,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: subColor || "#94a3b8" }}>{sub}</div>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [methods] = useState(PAYMENT_METHODS);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    customerApi.getPayments(true)
      .then(res => {
        const list = res.data?.payments || res.data?.data || [];
        setTransactions(Array.isArray(list) ? list.map(mapTransaction) : []);
      })
      .catch(() => setTxError("Failed to load transactions."))
      .finally(() => setTxLoading(false));

    customerApi.getPaymentsDashboard()
      .then(res => setSummaryStats(res.data ?? null))
      .catch(() => {/* dashboard stats are non-critical */});
  }, []);

  // ✅ Ported from App: calculate totals on the fly from transactions
  const totals = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.reduce((acc, tx) => {
      const isSuccessful =
        tx.statusKey === "paid" ||
        tx.statusKey === "delivered" ||
        tx.statusKey === "success";

      if (isSuccessful) {
        acc.totalPaid += tx.amount;
        if (
          tx.dateObj.getMonth() === currentMonth &&
          tx.dateObj.getFullYear() === currentYear
        ) {
          acc.monthSpent += tx.amount;
          acc.monthOrders += 1;
        }
      } else if (tx.statusKey === "pending") {
        acc.pendingCount += 1;
        acc.pendingAmount += tx.amount;
      }

      return acc;
    }, { totalPaid: 0, monthSpent: 0, monthOrders: 0, pendingCount: 0, pendingAmount: 0 });
  }, [transactions]);

  const getMonthTrend = () => {
    if (!summaryStats?.thisMonthPaid?.trend) return "0% from last month";
    const { trend } = summaryStats.thisMonthPaid;
    const sign = trend?.direction === "up" ? "+" : trend?.direction === "down" ? "−" : "";
    return `${sign}${trend?.percentage ?? 0}% from last month`;
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div>
        <h1 style={styles.title}>Payments</h1>
        <p style={styles.subtitle}>Manage payment methods and view transactions</p>
      </div>

      {/* ── Hero banner ── */}
      <div style={styles.heroBanner}>
        <div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
            Total Spent This Month
          </div>
          {/* ✅ Uses calculated totals instead of summaryStats directly */}
          <div style={{ fontSize: 38, fontWeight: 800, color: "white", marginBottom: 14 }}>
            PKR {totals.monthSpent.toFixed(2)}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={styles.heroPill}>{totals.monthOrders} Orders</span>
            <span style={{ ...styles.heroPill, background: "rgba(255,255,255,0.25)" }}>
              {getMonthTrend()}
            </span>
          </div>
        </div>
        <div style={styles.heroDollar}>
          <DollarCircleIcon size={90} />
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={styles.twoCol}>
        {/* LEFT column */}
        <div style={styles.leftCol}>

          {/* Payment Methods */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTitle}>Payment Methods</div>
                <div style={styles.cardSub}>Manage your payment options</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
              {methods.map(m => (
                <div key={m.id} style={styles.methodRow}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: m.icon === "cod"
                      ? "linear-gradient(135deg,#10b981,#059669)"
                      : "linear-gradient(135deg,#3b82f6,#2563eb)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {m.icon === "cod" ? <CodIcon /> : <CardIcon />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{m.label}</span>
                      {m.isDefault && (
                        <span style={{
                          padding: "2px 8px", borderRadius: 20,
                          fontSize: 11, fontWeight: 600,
                          background: "#eff6ff", color: "#3b82f6",
                        }}>Default</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#94a3b8" }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment tips */}
            <div style={styles.tipsBox}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <LightbulbIcon />
                <span style={{ fontWeight: 600, fontSize: 13, color: "#92400e" }}>Payment Tips</span>
              </div>
              {PAYMENT_TIPS.map((tip, i) => (
                <div key={i} style={{ fontSize: 12.5, color: "#64748b", marginBottom: 5, paddingLeft: 4 }}>
                  • {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTitle}>Transaction History</div>
                <div style={styles.cardSub}>View all your payment transactions</div>
              </div>
              <button style={styles.exportBtn}>
                <ExportIcon />
                Export
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto", marginTop: 18 }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Invoice ID", "Order ID", "Amount", "Date", "Method", "Status", "Action"].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txLoading ? (
                    <tr>
                      <td colSpan={7} style={{ ...styles.td, textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
                        Loading transactions…
                      </td>
                    </tr>
                  ) : txError ? (
                    <tr>
                      <td colSpan={7} style={{ ...styles.td, textAlign: "center", padding: "32px 0", color: "#ef4444" }}>
                        {txError}
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ ...styles.td, textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : transactions.map(tx => (
                    <tr key={tx.id}
                      style={{ borderTop: "1px solid #f1f5f9" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={styles.td}>{tx.invoice}</td>
                      <td style={styles.td}>{tx.order}</td>
                      <td style={{ ...styles.td, fontWeight: 600, color: "#0f172a" }}>
                        PKR {tx.amount.toFixed(2)}
                      </td>
                      <td style={styles.td}>{tx.date}</td>
                      <td style={styles.td}>{tx.method}</td>
                      <td style={styles.td}>
                        {/* ✅ Pass statusKey + statusLabel instead of a plain string */}
                        <StatusBadge statusKey={tx.statusKey} statusLabel={tx.statusLabel} />
                      </td>
                      <td style={styles.td}>
                        <button style={styles.downloadBtn}>
                          <DownloadIcon />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT column — stat cards */}
        <div style={styles.rightCol}>
          {/* ✅ Uses calculated totals */}
          <StatCard
            iconBg="linear-gradient(135deg,#10b981,#059669)"
            icon={<GreenDollarIcon />}
            label="Total Paid"
            value={`$${totals.totalPaid.toFixed(2)}`}
            sub="All time"
            subColor="#10b981"
          />
          <StatCard
            iconBg="linear-gradient(135deg,#6366f1,#4f46e5)"
            icon={<InvoiceIcon />}
            label="Pending Invoices"
            value={totals.pendingCount}
            sub="Unpaid orders"
          />
          <StatCard
            iconBg="linear-gradient(135deg,#f59e0b,#d97706)"
            icon={<PendingIcon />}
            label="Pending Amount"
            value={`$${totals.pendingAmount.toFixed(2)}`}
            sub={totals.pendingCount === 0 ? "No pending payments" : `${totals.pendingCount} pending`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    flex: 1,
    overflowY: "auto",
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 22,
    background: "#f8fafc",
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: "4px 0 0", fontSize: 13.5, color: "#94a3b8" },

  heroBanner: {
    borderRadius: 16,
    background: "linear-gradient(135deg,#0ea5e9 0%,#10b981 100%)",
    padding: "80px 46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  heroPill: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: "rgba(255,255,255,0.18)",
    color: "white",
  },
  heroDollar: {
    opacity: 0.6,
    flexShrink: 0,
  },

  twoCol: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
  },
  leftCol: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  rightCol: {
    width: 240,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  card: {
    background: "white",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    padding: "22px 24px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTitle: { fontWeight: 700, fontSize: 15, color: "#0f172a" },
  cardSub: { fontSize: 12.5, color: "#94a3b8", marginTop: 2 },

  statCard: {
    background: "white",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    padding: "20px 22px",
  },

  methodRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },

  tipsBox: {
    marginTop: 18,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 16px",
  },

  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#475569",
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 12px",
    color: "#475569",
    fontSize: 13,
    whiteSpace: "nowrap",
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 7,
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#475569",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
};