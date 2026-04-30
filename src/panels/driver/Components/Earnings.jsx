import React, { useState, useEffect, useCallback } from 'react';
import './Earnings.css';
import driverApi from '../../../shared/api/driverApi';
import { getDriverId } from '../../../shared/api/driverStore';

const filterOptions = ['This Week', 'Last Week', 'This Month'];

// ── Bar Chart (unchanged) ────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max    = Math.max(...data.map((d) => d.amount), 1);
  const yTicks = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];

  return (
    <div className="earn-chart-area">
      <div className="earn-y-axis">
        {[...yTicks].reverse().map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="earn-bars-wrap">
        <div className="earn-grid-lines">
          {yTicks.map((t) => (
            <div key={t} className="earn-grid-line" />
          ))}
        </div>
        <div className="earn-bars">
          {data.map((d) => {
            const pct = (d.amount / max) * 100;
            return (
              <div key={d.day || d.label} className="earn-bar-col">
                <div className="earn-bar-track">
                  <div
                    className="earn-bar"
                    style={{ height: `${pct}%` }}
                    title={`Rs${d.amount.toLocaleString()}`}
                  />
                </div>
                <span className="earn-bar-label">{d.day || d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Line Chart (unchanged) ───────────────────────────────────────────────────
const LineChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const W = 860, H = 220;
  const padL = 60, padR = 30, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...data.map((d) => d.amount), 1);
  const step   = maxVal / 4;
  const yTicks = [0, step, step * 2, step * 3, maxVal].map(Math.round);

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW;
  const pts   = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + chartH - (d.amount / maxVal) * chartH,
    ...d,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="earn-line-svg" preserveAspectRatio="xMidYMid meet">
      {yTicks.map((tick) => {
        const cy = padT + chartH - (tick / maxVal) * chartH;
        return (
          <g key={tick}>
            <line x1={padL} y1={cy} x2={W - padR} y2={cy} stroke="#e2e8f0" strokeWidth="1"/>
            <text x={padL - 8} y={cy + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
              {tick.toLocaleString()}
            </text>
          </g>
        );
      })}
      {pts.map((p) => (
        <text key={p.week || p.label} x={p.x} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8">
          {p.week || p.label}
        </text>
      ))}
      <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p) => (
        <circle key={p.week || p.label} cx={p.x} cy={p.y} r="5" fill="#38bdf8" stroke="white" strokeWidth="2"/>
      ))}
    </svg>
  );
};

// ─── Build earnings summary from a list of delivered Order objects ───────────
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildEarningsFromOrders = (orders, filter) => {
  const total = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Daily breakdown (for weekly view)
  const dailyTotals = Array(7).fill(0);
  orders.forEach((o) => {
    const day = new Date(o.deliveredAt || o.updatedAt).getDay();
    dailyTotals[day] += o.totalAmount || 0;
  });
  const dailyBreakdown = DAY_LABELS.map((label, i) => ({ label, amount: dailyTotals[i] }));

  // Weekly breakdown (for monthly view — by ISO week number within month)
  const weeklyMap = {};
  orders.forEach((o) => {
    const d = new Date(o.deliveredAt || o.updatedAt);
    const weekNum = Math.ceil(d.getDate() / 7);
    const key = `W${weekNum}`;
    weeklyMap[key] = (weeklyMap[key] || 0) + (o.totalAmount || 0);
  });
  const weeklyBreakdown = Object.entries(weeklyMap).map(([week, amount]) => ({ week, amount }));

  // Last and pending payment from most recent order
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const lastPaid = sorted.find((o) => o.paymentStatus === 'paid');
  const lastPayment = lastPaid
    ? { amount: lastPaid.totalAmount, date: lastPaid.deliveredAt || lastPaid.updatedAt, method: lastPaid.paymentMethod }
    : null;
  const pendingTotal = orders
    .filter((o) => o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingPayment = pendingTotal > 0 ? { amount: pendingTotal } : null;

  return {
    totalEarnings: total,
    tripsCompleted: orders.length,
    dailyBreakdown: filter !== 'This Month' ? dailyBreakdown : [],
    weeklyBreakdown: filter === 'This Month' ? weeklyBreakdown : [],
    lastPayment,
    pendingPayment,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
const Earnings = () => {
  const [filter, setFilter]             = useState('This Week');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [earnings, setEarnings]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // No dedicated /drivers/earnings endpoint — derive from GET /drivers/:id/deliveries
  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const driverId = getDriverId();
      const now = new Date();
      let fromDate;
      if (filter === 'This Week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        fromDate = start.toISOString();
      } else if (filter === 'Last Week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() - 7);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        fromDate = start.toISOString();
        // pass toDate too
        const res = await driverApi.getDriverDeliveries(driverId, {
          status: 'delivered', fromDate: start.toISOString(), toDate: end.toISOString(), limit: 100,
        });
        setEarnings(buildEarningsFromOrders(res?.data ?? res ?? [], filter));
        return;
      } else {
        // This Month
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        fromDate = start.toISOString();
      }
      const res = await driverApi.getDriverDeliveries(driverId, {
        status: 'delivered', fromDate, limit: 100,
      });
      setEarnings(buildEarningsFromOrders(res?.data ?? res ?? [], filter));
    } catch (err) {
      setError(err.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  // ── Derived display values ─────────────────────────────────────────────────
  const totalEarnings    = earnings?.totalEarnings    ?? 0;
  const tripsCompleted   = earnings?.tripsCompleted   ?? 0;
  const averagePerTrip   = tripsCompleted > 0 ? Math.round(totalEarnings / tripsCompleted) : 0;
  const weeklyChartData  = earnings?.dailyBreakdown   ?? [];
  const monthlyChartData = earnings?.weeklyBreakdown  ?? [];
  const lastPayment      = earnings?.lastPayment      ?? null;
  const pendingPayment   = earnings?.pendingPayment   ?? null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="earn-container">

      {/* Page Header */}
      <div className="earn-page-header">
        <div>
          <h1 className="earn-title">Earnings &amp; Performance</h1>
          <p className="earn-subtitle">Track your income and delivery statistics</p>
        </div>
        <div className="earn-filter-wrap">
          <button
            className="earn-filter-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{filter}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="earn-dropdown">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  className={`earn-dropdown-item ${filter === opt ? 'active' : ''}`}
                  onClick={() => { setFilter(opt); setDropdownOpen(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading earnings…
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
          <button className="earn-filter-btn" onClick={fetchEarnings}>Retry</button>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="earn-stats">
            <div className="earn-stat-card">
              <div className="earn-stat-info">
                <span className="earn-stat-label">Total Earnings</span>
                <span className="earn-stat-value">Rs{totalEarnings.toLocaleString()}</span>
              </div>
              <div className="earn-stat-icon earn-icon-green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                  <path d="M12 7v10M9 9h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="earn-stat-card">
              <div className="earn-stat-info">
                <span className="earn-stat-label">Trips Completed</span>
                <span className="earn-stat-value">{tripsCompleted}</span>
              </div>
              <div className="earn-stat-icon earn-icon-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M17 7L10 3L3 7M17 7L10 11M17 7V13L10 17M10 11L3 7M10 11V17M3 7V13L10 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="earn-stat-card">
              <div className="earn-stat-info">
                <span className="earn-stat-label">Average per Trip</span>
                <span className="earn-stat-value">Rs{averagePerTrip.toLocaleString()}</span>
                <span className="earn-stat-note">Per delivery</span>
              </div>
              <div className="earn-stat-icon earn-icon-orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17l4-8 4 4 3-6 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 17H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Weekly Bar Chart */}
          {weeklyChartData.length > 0 && (
            <div className="earn-card">
              <div className="earn-card-header">
                <div>
                  <h2 className="earn-card-title">Weekly Earnings</h2>
                  <p className="earn-card-sub">Daily earnings breakdown for this week</p>
                </div>
              </div>
              <BarChart data={weeklyChartData} />
            </div>
          )}

          {/* Monthly Line Chart */}
          {monthlyChartData.length > 0 && (
            <div className="earn-card">
              <div className="earn-card-header">
                <div>
                  <h2 className="earn-card-title">Monthly Trend</h2>
                  <p className="earn-card-sub">Weekly earnings comparison for this month</p>
                </div>
              </div>
              <LineChart data={monthlyChartData} />
            </div>
          )}

          {/* Payment Status */}
          <div className="earn-card">
            <h2 className="earn-card-title" style={{ marginBottom: '18px' }}>Payment Status</h2>

            {lastPayment ? (
              <div className="earn-payment-row earn-paid">
                <div>
                  <span className="earn-payment-label">Last Payment</span>
                  <span className="earn-payment-amount">
                    Rs{Number(lastPayment.amount).toLocaleString()}
                  </span>
                </div>
                <span className="earn-badge earn-badge-paid">
                  Paid
                  {lastPayment.date
                    ? ` · ${new Date(lastPayment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : ''}
                </span>
              </div>
            ) : (
              <div className="earn-payment-row earn-paid">
                <div>
                  <span className="earn-payment-label">Last Payment</span>
                  <span className="earn-payment-amount">—</span>
                </div>
                <span className="earn-badge earn-badge-paid">No records</span>
              </div>
            )}

            {pendingPayment && (
              <div className="earn-payment-row earn-processing">
                <div>
                  <span className="earn-payment-label">Pending Payment</span>
                  <span className="earn-payment-amount">
                    Rs{Number(pendingPayment.amount).toLocaleString()}
                  </span>
                </div>
                <span className="earn-badge earn-badge-processing">Processing</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Earnings;

