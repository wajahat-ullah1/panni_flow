import { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { BoxIcon, TruckIcon, DollarIcon, DropIcon } from "../icons/Icons";
import customerApi from "../../../../shared/api/customerApi";

export default function StatsGrid() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    customerApi
      .getDashboardStats()
      .then((res) => setStats(res.data ?? null))
      .catch(() => setStats(null));
  }, []);

  // Helper: extract value + trend from fields that may be { value, trend } or plain numbers
  const val = (field) => (typeof field === "object" && field !== null ? field.value : field);
  const trendInfo = (field) => {
    if (typeof field === "object" && field !== null && field.trend) {
      const { percentage, direction } = field.trend;
      return {
        label: `${percentage}%`,
        color: direction === "up" ? "#16a34a" : "#ef4444",
        noArrow: false,
        direction,
      };
    }
    return { label: null, color: "#6b7280", noArrow: true, direction: null };
  };

  const ordersT  = trendInfo(stats?.totalOrders);
  const spendingT = trendInfo(stats?.monthlySpending);

  const cards = [
    {
      label: "Total Orders",
      value: stats ? String(val(stats.totalOrders)) : "—",
      trend: stats ? (ordersT.label ?? `${val(stats.totalOrders)} orders`) : "Loading...",
      icon: <BoxIcon color="#0ea5e9" />,
      iconBg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      trendColor: ordersT.color,
      trendNoArrow: ordersT.noArrow,
      trendDirection: ordersT.direction,
    },
    {
      label: "Active Deliveries",
      value: stats ? String(stats.activeDeliveries ?? stats.activeOrders) : "—",
      trend: "In Progress",
      icon: <TruckIcon stroke="white" />,
      iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      trendColor: "#6b7280",
      trendNoArrow: true,
    },
    {
      label: "Monthly Spending",
      value: stats ? `$${val(stats.monthlySpending).toLocaleString()}` : "—",
      trend: stats ? (spendingT.label ?? `$${stats.totalSpent?.toLocaleString()} total spent`) : "Loading...",
      icon: <DollarIcon stroke="white" />,
      iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      trendColor: spendingT.color,
      trendNoArrow: spendingT.noArrow,
      trendDirection: spendingT.direction,
    },
    {
      label: "Bottles Ordered",
      value: stats ? String(stats.bottlesOrdered?.count ?? "—") : "—",
      trend: stats?.bottlesOrdered?.label ?? "19L Bottles",
      icon: <DropIcon stroke="white" />,
      iconBg: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
      trendColor: "#6b7280",
      trendNoArrow: true,
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 22,
  },
};
