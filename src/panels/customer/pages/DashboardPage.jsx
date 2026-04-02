import StatsGrid from "../components/dashboard/StatsGrid";
import RecentOrders from "../components/dashboard/RecentOrders";
import QuickActions from "../components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div style={styles.content}>
      <div style={styles.pageTitle}>Customer Dashboard</div>
      <div style={styles.pageSubtitle}>
        Welcome back! Here's your water delivery overview
      </div>

      <StatsGrid />

      <div style={styles.bottomRow}>
        <RecentOrders />
        <QuickActions />
      </div>
    </div>
  );
}

const styles = {
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
  },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
  pageSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
    marginBottom: 22,
  },
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "1fr 260px",
    gap: 16,
  },
};
