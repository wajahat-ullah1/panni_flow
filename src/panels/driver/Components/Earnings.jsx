import React, { useState, useEffect, useCallback } from 'react';
import driverApi from '../../../shared/api/driverApi';
import { getDriverId } from '../../../shared/api/driverStore';

const filterOptions = ['This Week', 'Last Week', 'This Month'];

// ── Bar Chart ────────────────────────────────────────────────────────────────
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
                    title={`PKR ${d.amount.toLocaleString()}`}
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

// ── Line Chart ───────────────────────────────────────────────────────────────
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
      <path d={pathD} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p) => (
        <circle key={p.week || p.label} cx={p.x} cy={p.y} r="5" fill="#0ea5e9" stroke="white" strokeWidth="2"/>
      ))}
    </svg>
  );
};

// ─── Build earnings summary from a list of delivered Order objects ───────────
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildEarningsFromOrders = (orders, filter) => {
  const total = orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;

  const dailyTotals = Array(7).fill(0);
  orders?.forEach((o) => {
    const day = new Date(o.deliveredAt || o.updatedAt).getDay();
    dailyTotals[day] += o.totalAmount || 0;
  });
  const dailyBreakdown = DAY_LABELS.map((label, i) => ({ label, amount: dailyTotals[i] }));

  const weeklyMap = {};
  orders?.forEach((o) => {
    const d = new Date(o.deliveredAt || o.updatedAt);
    const weekNum = Math.ceil(d.getDate() / 7);
    const key = `W${weekNum}`;
    weeklyMap[key] = (weeklyMap[key] || 0) + (o.totalAmount || 0);
  });
  const weeklyBreakdown = Object.entries(weeklyMap).map(([week, amount]) => ({ week, amount }));

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
        const res = await driverApi.getDriverDeliveries(driverId, {
          status: 'delivered', fromDate: start.toISOString(), toDate: end.toISOString(), limit: 100,
        });
        setEarnings(buildEarningsFromOrders(res?.data?.data ?? [], filter));
        return;
      } else {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        fromDate = start.toISOString();
      }
      const res = await driverApi.getDriverDeliveries(driverId, {
        status: 'delivered', fromDate, limit: 100,
      });
      setEarnings(buildEarningsFromOrders(res?.data?.data ?? [], filter));
    } catch (err) {
      setError(err.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  const totalEarnings    = earnings?.totalEarnings    ?? 0;
  const tripsCompleted   = earnings?.tripsCompleted   ?? 0;
  const averagePerTrip   = tripsCompleted > 0 ? Math.round(totalEarnings / tripsCompleted) : 0;
  const weeklyChartData  = earnings?.dailyBreakdown   ?? [];
  const monthlyChartData = earnings?.weeklyBreakdown  ?? [];
  const lastPayment      = earnings?.lastPayment      ?? null;
  const pendingPayment   = earnings?.pendingPayment   ?? null;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{earnStyles}</style>
        <div className="earn-root">
          <div className="earn-loader">
            <div className="earn-loader-spinner" />
            <span>Loading earnings…</span>
          </div>
        </div>
      </>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <style>{earnStyles}</style>
        <div className="earn-root">
          <div className="earn-error-box">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>{error}</p>
            <button className="earn-retry-btn" onClick={fetchEarnings}>Try Again</button>
          </div>
        </div>
      </>
    );
  }

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{earnStyles}</style>
      <div className="earn-root">

        {/* ── Page Header ── */}
        <header className="earn-header">
          <div className="earn-header-left">
            <p className="earn-header-eyebrow">Overview</p>
            <h1 className="earn-header-title">Collection &amp; Performance</h1>
            <p className="earn-header-sub">Track your income and delivery statistics</p>
          </div>
          <div className="earn-header-right">
            <div className="earn-filter-wrap">
              <button
                className="earn-filter-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{filter}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        </header>

        {/* ── Stats Grid ── */}
        <div className="earn-stats-grid">

          {/* Total Earnings */}
          <div className="earn-stat-card">
            <div className="earn-stat-icon" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2"/>
                <path d="M12 8V16M10 10H13C13.5523 10 14 10.4477 14 11C14 11.5523 13.5523 12 13 12H11C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14H14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="earn-stat-body">
              <p className="earn-stat-label">Total Collected</p>
              <h3 className="earn-stat-value" style={{ fontSize: 22 }}>PKR {totalEarnings.toLocaleString()}</h3>
              <p className="earn-stat-sub">{filter.toLowerCase()}</p>
            </div>
          </div>

          {/* Trips Completed */}
          <div className="earn-stat-card">
            <div className="earn-stat-icon" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="earn-stat-body">
              <p className="earn-stat-label">Trips Completed</p>
              <h3 className="earn-stat-value">{tripsCompleted}</h3>
              <p className="earn-stat-sub">deliveries</p>
            </div>
          </div>

          {/* Average per Trip */}
          <div className="earn-stat-card">
            <div className="earn-stat-icon" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 17l4-8 4 4 3-6 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 17H4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="earn-stat-body">
              <p className="earn-stat-label">Average per Trip</p>
              <h3 className="earn-stat-value" style={{ fontSize: 22 }}>PKR {averagePerTrip.toLocaleString()}</h3>
              <p className="earn-stat-sub">per delivery</p>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="earn-stat-card">
            <div className="earn-stat-icon" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="earn-stat-body">
              <p className="earn-stat-label">Pending Payment</p>
              <h3 className="earn-stat-value" style={{ fontSize: 22 }}>
                {pendingPayment ? `PKR ${Number(pendingPayment.amount).toLocaleString()}` : 'PKR 0'}
              </h3>
              <p className="earn-stat-sub">awaiting</p>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="earn-columns">

          {/* Left — Charts */}
          <div className="earn-charts-col">

            {/* Weekly Bar Chart */}
            {weeklyChartData.length > 0 && (
              <div className="earn-card">
                <div className="earn-card-head">
                  <div>
                    <h2 className="earn-card-title">Weekly Earnings</h2>
                    <p className="earn-card-sub">Daily earnings breakdown for {filter.toLowerCase()}</p>
                  </div>
                  <div className="earn-chart-badge">
                    <span className="earn-chart-dot" />
                    Daily
                  </div>
                </div>
                <BarChart data={weeklyChartData} />
              </div>
            )}

            {/* Monthly Line Chart */}
            {monthlyChartData.length > 0 && (
              <div className="earn-card">
                <div className="earn-card-head">
                  <div>
                    <h2 className="earn-card-title">Monthly Trend</h2>
                    <p className="earn-card-sub">Weekly earnings comparison for this month</p>
                  </div>
                  <div className="earn-chart-badge">
                    <span className="earn-chart-dot" style={{ background: '#0ea5e9' }} />
                    Weekly
                  </div>
                </div>
                <LineChart data={monthlyChartData} />
              </div>
            )}

            {/* Empty chart state */}
            {weeklyChartData.length === 0 && monthlyChartData.length === 0 && (
              <div className="earn-card earn-chart-empty">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path d="M3 17l4-8 4 4 3-6 4 4" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 17H4" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p>No chart data available</p>
                <span>Earnings will appear once deliveries are recorded</span>
              </div>
            )}
          </div>

          {/* Right — Payment Status + Summary */}
          <div className="earn-right-col">

            {/* Payment Status */}
            <div className="earn-card">
              <div className="earn-card-head" style={{ marginBottom: 18 }}>
                <div>
                  <h2 className="earn-card-title">Payment Status</h2>
                  <p className="earn-card-sub">Your recent transactions</p>
                </div>
              </div>

              {lastPayment ? (
                <div className="earn-payment-row earn-payment-paid">
                  <div className="earn-payment-icon-wrap" style={{ background: '#f0fdf4' }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
                      <path d="M8 12L11 15L16 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="earn-payment-info">
                    <span className="earn-payment-label">Last Payment</span>
                    <span className="earn-payment-amount">PKR {Number(lastPayment.amount).toLocaleString()}</span>
                    {lastPayment.date && (
                      <span className="earn-payment-date">
                        {new Date(lastPayment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <span className="earn-status-pill earn-pill-paid">
                    <span className="earn-pill-dot" style={{ background: '#22c55e' }} />
                    Paid
                  </span>
                </div>
              ) : (
                <div className="earn-payment-row earn-payment-paid">
                  <div className="earn-payment-icon-wrap" style={{ background: '#f1f5f9' }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="earn-payment-info">
                    <span className="earn-payment-label">Last Payment</span>
                    <span className="earn-payment-amount">—</span>
                  </div>
                  <span className="earn-status-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>
                    <span className="earn-pill-dot" style={{ background: '#94a3b8' }} />
                    No records
                  </span>
                </div>
              )}

              {pendingPayment && (
                <div className="earn-payment-row earn-payment-pending" style={{ marginTop: 10 }}>
                  <div className="earn-payment-icon-wrap" style={{ background: '#fff7ed' }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="earn-payment-info">
                    <span className="earn-payment-label">Pending Payment</span>
                    <span className="earn-payment-amount">PKR {Number(pendingPayment.amount).toLocaleString()}</span>
                  </div>
                  <span className="earn-status-pill earn-pill-pending">
                    <span className="earn-pill-dot" style={{ background: '#f97316' }} />
                    Processing
                  </span>
                </div>
              )}
            </div>

            {/* Collection Summary Card */}
            <div className="earn-summary-card">
              <div className="earn-summary-header">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Collection Summary</span>
              </div>
              <div className="earn-summary-rows">
                <div className="earn-summary-row">
                  <span>Total Collected</span>
                  <strong>PKR {totalEarnings.toLocaleString()}</strong>
                </div>
                <div className="earn-summary-row">
                  <span>Trips Done</span>
                  <strong>{tripsCompleted}</strong>
                </div>
                <div className="earn-summary-row">
                  <span>Avg per Trip</span>
                  <strong>PKR {averagePerTrip.toLocaleString()}</strong>
                </div>
                <div className="earn-summary-row">
                  <span>Pending</span>
                  <strong style={{ color: '#fde68a' }}>
                    PKR {pendingPayment ? Number(pendingPayment.amount).toLocaleString() : '0'}
                  </strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const earnStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.earn-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px 36px;
  box-sizing: border-box;
}

/* ── Loader ── */
.earn-loader {
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 14px;
  height: 60vh; color: #64748b; font-size: 14px; font-weight: 500;
}
.earn-loader-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: earnSpin 0.7s linear infinite;
}
@keyframes earnSpin { to { transform: rotate(360deg); } }

/* ── Error ── */
.earn-error-box {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  height: 60vh; color: #64748b; font-size: 14px;
}
.earn-retry-btn {
  margin-top: 8px;
  padding: 9px 24px;
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: opacity 0.2s;
}
.earn-retry-btn:hover { opacity: 0.88; }

/* ── Header ── */
.earn-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 32px;
}
.earn-header-eyebrow {
  font-size: 13px; font-weight: 600; color: #0ea5e9;
  margin: 0 0 4px;
  text-transform: uppercase; letter-spacing: 0.6px;
}
.earn-header-title {
  font-size: 28px; font-weight: 800; color: #0f172a;
  margin: 0 0 4px; letter-spacing: -0.5px;
}
.earn-header-sub {
  font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;
}
.earn-header-right {
  display: flex; align-items: center; gap: 12px; padding-top: 4px;
}

/* ── Filter ── */
.earn-filter-wrap { position: relative; }
.earn-filter-btn {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 10px; padding: 9px 16px;
  font-size: 13px; font-weight: 600; color: #334155;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.earn-filter-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

.earn-dropdown {
  position: absolute; right: 0; top: calc(100% + 6px);
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 100; min-width: 148px; overflow: hidden;
}
.earn-dropdown-item {
  display: block; width: 100%;
  padding: 10px 16px; text-align: left;
  background: none; border: none;
  font-size: 13px; font-weight: 500; color: #334155;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background 0.15s;
}
.earn-dropdown-item:hover { background: #f1f5f9; }
.earn-dropdown-item.active {
  background: #eff6ff; color: #2563eb; font-weight: 700;
}

/* ── Stats Grid ── */
.earn-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}
.earn-stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 22px 20px;
  display: flex; align-items: flex-start; gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}
.earn-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.earn-stat-icon {
  width: 50px; height: 50px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.earn-stat-body { flex: 1; min-width: 0; }
.earn-stat-label {
  font-size: 12px; font-weight: 600; color: #64748b;
  margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.4px;
}
.earn-stat-value {
  font-size: 26px; font-weight: 800; color: #0f172a;
  margin: 0 0 2px; line-height: 1;
}
.earn-stat-sub {
  font-size: 11.5px; color: #94a3b8; margin: 0; font-weight: 500;
}

/* ── Two-column layout ── */
.earn-columns {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: flex-start;
}
.earn-charts-col { display: flex; flex-direction: column; gap: 24px; }
.earn-right-col  { display: flex; flex-direction: column; gap: 16px; }

/* ── Card ── */
.earn-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 26px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.earn-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); }

.earn-card-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 22px;
}
.earn-card-title {
  font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 2px;
}
.earn-card-sub {
  font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;
}
.earn-chart-badge {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: #64748b;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 20px; padding: 4px 12px;
}
.earn-chart-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; flex-shrink: 0;
}

/* ── Bar Chart ── */
.earn-chart-area {
  display: flex; gap: 10px; height: 240px;
}
.earn-y-axis {
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding-bottom: 24px;
  width: 42px; text-align: right;
}
.earn-y-axis span { font-size: 11px; color: #94a3b8; font-weight: 500; }
.earn-bars-wrap {
  flex: 1; position: relative;
  display: flex; flex-direction: column;
}
.earn-grid-lines {
  position: absolute; top: 0; left: 0; right: 0; bottom: 24px;
  display: flex; flex-direction: column;
  justify-content: space-between; pointer-events: none;
}
.earn-grid-line { width: 100%; height: 1px; background: #f1f5f9; }
.earn-bars {
  flex: 1; display: flex; align-items: flex-end;
  gap: 14px; padding-bottom: 24px;
  position: relative; z-index: 1;
}
.earn-bar-col {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 6px; height: 100%;
}
.earn-bar-track {
  flex: 1; width: 100%;
  display: flex; align-items: flex-end;
}
.earn-bar {
  width: 100%; border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%);
  transition: opacity 0.2s; cursor: pointer; min-height: 4px;
  box-shadow: 0 -2px 8px rgba(14,165,233,0.2);
}
.earn-bar:hover { opacity: 0.82; }
.earn-bar-label {
  font-size: 12px; color: #94a3b8; white-space: nowrap; font-weight: 500;
}

/* ── Line Chart ── */
.earn-line-svg {
  width: 100%; height: auto;
  display: block; overflow: visible;
}

/* ── Chart empty ── */
.earn-chart-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; padding: 56px 24px;
}
.earn-chart-empty p {
  font-size: 15px; font-weight: 600; color: #475569; margin: 0;
}
.earn-chart-empty span {
  font-size: 13px; color: #94a3b8;
}

/* ── Payment Rows ── */
.earn-payment-row {
  display: flex; align-items: center; gap: 14px;
  border-radius: 12px; padding: 16px 18px;
}
.earn-payment-paid    { background: #f8fafc; border: 1px solid #e2e8f0; }
.earn-payment-pending { background: #fff7ed; border: 1px solid #fed7aa; }

.earn-payment-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.earn-payment-info {
  flex: 1; display: flex; flex-direction: column; gap: 2px;
}
.earn-payment-label {
  font-size: 12px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.4px;
}
.earn-payment-amount {
  font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1;
}
.earn-payment-date {
  font-size: 11px; color: #94a3b8; font-weight: 500;
}

/* Status pills */
.earn-status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: 20px;
  font-size: 12px; font-weight: 600; white-space: nowrap;
  flex-shrink: 0;
}
.earn-pill-paid    { background: #f0fdf4; color: #16a34a; }
.earn-pill-pending { background: #fff7ed; color: #c2410c; }
.earn-pill-dot     { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* ── Summary Card ── */
.earn-summary-card {
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  border-radius: 16px; padding: 20px 22px;
  box-shadow: 0 4px 16px rgba(14,165,233,0.3);
}
.earn-summary-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 16px;
  font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9);
}
.earn-summary-rows { display: flex; flex-direction: column; gap: 12px; }
.earn-summary-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: rgba(255,255,255,0.7);
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.earn-summary-row:last-child { border-bottom: none; padding-bottom: 0; }
.earn-summary-row strong { font-weight: 700; color: #fff; }

/* ── Responsive ── */
@media (max-width: 1200px) {
  .earn-stats-grid  { grid-template-columns: repeat(2, 1fr); }
  .earn-columns     { grid-template-columns: 1fr; }
  .earn-right-col   { flex-direction: row; flex-wrap: wrap; }
  .earn-card        { flex: 1; min-width: 260px; }
}
@media (max-width: 768px) {
  .earn-root        { padding: 20px 16px; }
  .earn-stats-grid  { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .earn-stat-value  { font-size: 22px; }
  .earn-header-title { font-size: 22px; }
  .earn-right-col   { flex-direction: column; }
}
@media (max-width: 480px) {
  .earn-stats-grid  { grid-template-columns: 1fr 1fr; }
}
`;

export default Earnings;