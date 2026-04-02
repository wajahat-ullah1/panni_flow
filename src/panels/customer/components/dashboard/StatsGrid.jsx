import StatCard from "./StatCard";
import { BoxIcon, TruckIcon, DollarIcon, DropIcon } from "../icons/Icons";

const STATS = [
  {
    label: "Total Orders",
    value: "47",
    trend: "+12%",
    icon: <BoxIcon color="#0ea5e9" />,
    iconBg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    trendColor: "#16a34a",
  },
  {
    label: "Active Deliveries",
    value: "2",
    trend: "In Progress",
    icon: <TruckIcon stroke="white" />,
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    trendColor: "#6b7280",
    trendNoArrow: true,
  },
  {
    label: "Monthly Spending",
    value: "$342",
    trend: "+8%",
    icon: <DollarIcon stroke="white" />,
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    trendColor: "#16a34a",
  },
  {
    label: "Bottles Ordered",
    value: "89",
    trend: "19L Bottles",
    icon: <DropIcon stroke="white" />,
    iconBg: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    trendColor: "#6b7280",
    trendNoArrow: true,
  },
];

export default function StatsGrid() {
  return (
    <div style={styles.grid}>
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
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
