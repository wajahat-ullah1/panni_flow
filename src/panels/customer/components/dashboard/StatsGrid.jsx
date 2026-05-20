import { useState, useEffect, useMemo } from "react";
import StatCard from "./StatCard";
import { BoxIcon, TruckIcon, DollarIcon, DropIcon } from "../icons/Icons";
import customerApi from "../../../../shared/api/customerApi";

export default function StatsGrid() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    customerApi
      .getDashboardStats()
      .then((res) => setStats(res.data ?? null))
      .catch(() => setStats(null));

    customerApi
      .getOrders({ limit: 100 })
      .then((res) => {
        const list = res.data?.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => setOrders([]));
  }, []);

  const monthlySpending = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return orders.reduce((total, order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : null;
      const orderStatus = (order.status || "").toLowerCase();
      const isPaidOrDelivered = orderStatus === "delivered";
      if (orderDate && orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && isPaidOrDelivered) {
        return total + (Number(order.totalAmount) || Number(order.total) || 0);
      }
      return total;
    }, 0);
  }, [orders]);

  const val = (field) => (typeof field === "object" && field !== null ? field.value : field);
  const trendInfo = (field) => {
    if (typeof field === "object" && field !== null && field.trend) {
      const { percentage, direction } = field.trend;
      return { label: percentage ? `${percentage}%` : null, color: direction === "up" ? "#16a34a" : "#ef4444", noArrow: false, direction };
    }
    return { label: null, color: "#94a3b8", noArrow: true, direction: null };
  };

  const ordersT   = trendInfo(stats?.totalOrders);
  const spendingT = trendInfo(stats?.monthlySpending);

  const cards = [
    {
      label: "Total Orders",
      value: stats ? String(val(stats.totalOrders)) : "—",
      trend: stats ? (ordersT.label ?? `${val(stats.totalOrders)} orders`) : "Loading...",
      icon: <BoxIcon color="#fff" />,
      iconBg: "linear-gradient(135deg, #3b82f6, #2563eb)",
      trendColor: ordersT.color,
      trendNoArrow: ordersT.noArrow,
      trendDirection: ordersT.direction,
    },
    {
      label: "Active Deliveries",
      value: stats ? String(stats.activeDeliveries ?? stats.activeOrders) : "—",
      trend: "In Progress",
      icon: <TruckIcon stroke="white" />,
      iconBg: "linear-gradient(135deg, #f97316, #ea580c)",
      trendColor: "#94a3b8",
      trendNoArrow: true,
    },
    {
      label: "Monthly Spending",
      value: stats ? `PKR ${monthlySpending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—",
      trend: stats ? (spendingT.label ?? `PKR ${stats.totalSpent?.toLocaleString()} total`) : "Loading...",
      icon: <DollarIcon stroke="white" />,
      iconBg: "linear-gradient(135deg, #22c55e, #16a34a)",
      trendColor: spendingT.color,
      trendNoArrow: spendingT.noArrow,
      trendDirection: spendingT.direction,
    },
    {
      label: "Bottles Ordered",
      value: stats ? String(stats.bottlesOrdered?.count ?? "—") : "—",
      trend: stats?.bottlesOrdered?.label ?? "19L Bottles",
      icon: <DropIcon stroke="white" />,
      iconBg: "linear-gradient(135deg, #a855f7, #7c3aed)",
      trendColor: "#94a3b8",
      trendNoArrow: true,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes sgFadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .sg-card-wrap { animation: sgFadeUp 0.4s ease both; }
      `}</style>
      <div style={styles.grid}>
        {cards.map((card, i) => (
          <div key={card.label} className="sg-card-wrap" style={{ animationDelay: `${i * 80}ms` }}>
            <StatCard {...card} />
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
    marginBottom: 28,
  },
};