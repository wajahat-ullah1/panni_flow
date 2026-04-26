import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Droplet,
  Truck,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import adminApi from '/src/shared/api/adminApi';
import customerApi from '/src/shared/api/customerApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, revenueRes, ordersRes] = await Promise.all([
          adminApi.getDashboardSummary(),
          adminApi.getMonthlyRevenue(new Date().getFullYear()),
          customerApi.getOrders({ page: 1, limit: 5, sort: 'createdAt' }),
        ]);
        setSummary(summaryRes.data);
        setRevenueData(revenueRes.data);
        const orderList = ordersRes.data?.data ?? [];
        setRecentOrders(orderList.map((o) => ({
          id: o.orderNumber ?? o._id,
          company: o.customerName ?? '—',
          quantity: o.items[0]?.quantity ? `${o.items[0]?.quantity * 19}L` : '',
          status: o.status,
          statusColor:
            o.status === 'delivered' ? '#4CAF50'
            : o.status === 'pending'   ? '#FFC107'
            : '#2196F3',
        })));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const buildStats = (s) => {
    if (!s) return [];
    const { totalOrders, activeDeliveries, monthlyRevenue, tankers } = s;
    const revenueChange = monthlyRevenue.changePercent;
    return [
      {
        title: 'Total Orders',
        value: totalOrders.value.toLocaleString(),
        change: totalOrders.changePercent !== undefined
          ? `${totalOrders.changePercent > 0 ? '+' : ''}${totalOrders.changePercent}%`
          : null,
        trend: totalOrders.trend,
        icon: Droplet,
        color: '#00A8E8',
        bgColor: '#E3F2FD',
      },
      {
        title: 'Active Deliveries',
        value: activeDeliveries.value.toString(),
        status: 'In Progress',
        icon: Truck,
        color: '#FF9800',
        bgColor: '#FFF3E0',
      },
      {
        title: 'Revenue (Month)',
        value: `$${monthlyRevenue.value.toFixed(2)}`,
        change: revenueChange !== undefined
          ? `${revenueChange > 0 ? '+' : ''}${revenueChange}%`
          : null,
        trend: monthlyRevenue.trend,
        icon: DollarSign,
        color: '#4CAF50',
        bgColor: '#E8F5E9',
      },
      {
        title: 'Active Tankers',
        value: `${tankers.active}/${tankers.total}`,
        status: `${tankers.utilizationPercent}% Utilization`,
        icon: Users,
        color: '#9C27B0',
        bgColor: '#F3E5F5',
      },
    ];
  };

  const stats = buildStats(summary);

  // Demand forecast data
  const demandData = [
    { day: 'Mon', demand: 85 },
    { day: 'Tue', demand: 92 },
    { day: 'Wed', demand: 78 },
    { day: 'Thu', demand: 88 },
    { day: 'Fri', demand: 95 },
    { day: 'Sat', demand: 110 },
    { day: 'Sun', demand: 98 },
  ];



  // Alerts and notifications
  const alerts = [
    {
      id: 1,
      type: 'warning',
      icon: Clock,
      color: '#FF9800',
      title: 'Tanker TK-145 requires maintenance',
      time: '10 mins ago',
    },
    {
      id: 2,
      type: 'info',
      icon: TrendingUp,
      color: '#2196F3',
      title: 'High demand predicted for tomorrow',
      time: '25 mins ago',
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle,
      color: '#4CAF50',
      title: 'All deliveries completed in Zone A',
      time: '1 hour ago',
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.month}</p>
          <p className="tooltip-value">Revenue: ${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="header-title">Admin Dashboard</h1>
          <p className="header-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="date-container">
          <span className="date-text">Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-container">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="stat-card stat-card--loading" />
              ))
            : stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const isDown = stat.trend === 'down';
                return (
                  <div key={index} className="stat-card">
                    <div className="stat-header">
                      <div className="stat-info">
                        <p className="stat-title">{stat.title}</p>
                        <h2 className="stat-value">{stat.value}</h2>
                        {stat.change && (
                          <p className={`stat-change ${isDown ? 'negative' : 'positive'}`}>
                            {isDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            {stat.change}
                          </p>
                        )}
                        {stat.status && (
                          <p className="stat-status" style={{ color: stat.color }}>
                            <Clock size={14} />
                            {stat.status}
                          </p>
                        )}
                      </div>
                      <div
                        className="stat-icon"
                        style={{ backgroundColor: stat.bgColor }}
                      >
                        <IconComponent size={28} color={stat.color} />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Charts Section */}
        <div className="charts-row">
          {/* Revenue Overview */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Revenue Overview</h3>
                <p className="chart-subtitle">Monthly revenue and order trends</p>
              </div>
            </div>

            {loading ? (
              <div className="chart-skeleton" />
            ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#757575"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#757575" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2196F3"
                  strokeWidth={3}
                  dot={{ fill: '#2196F3', r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorRevenue)"
                />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>

          {/* Demand Forecast */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Demand Forecast</h3>
                <p className="chart-subtitle">Predicted demand for next 7 days</p>
              </div>
            </div>

            {loading ? (
              <div className="chart-skeleton" />
            ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  stroke="#757575"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#757575" style={{ fontSize: '12px' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 188, 212, 0.1)' }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="demand" fill="#00BCD4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Orders and Alerts */}
        <div className="bottom-section">
          {/* Recent Orders */}
          <div className="recent-orders-card">
            <h3 className="section-title">Recent Orders</h3>

            <div className="orders-list">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="order-item order-item--loading" />
                  ))
                : recentOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-icon">
                    <Droplet size={24} color="#00A8E8" />
                  </div>
                  <div className="order-details">
                    <p className="order-company">{order.company}</p>
                    <p className="order-info">
                      {order.id} • {order.quantity}
                    </p>
                  </div>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: `${order.statusColor}20` }}
                  >
                    <span style={{ color: order.statusColor }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="alerts-card">
            <h3 className="section-title">Alerts & Notifications</h3>

            <div className="alerts-list">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="alert-item alert-item--loading" />
                  ))
                : alerts.map((alert) => {
                const AlertIcon = alert.icon;
                return (
                  <div key={alert.id} className="alert-item">
                    <div
                      className="alert-icon"
                      style={{ backgroundColor: `${alert.color}20` }}
                    >
                      <AlertIcon size={20} color={alert.color} />
                    </div>
                    <div className="alert-content">
                      <p className="alert-title">{alert.title}</p>
                      <p className="alert-time">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
