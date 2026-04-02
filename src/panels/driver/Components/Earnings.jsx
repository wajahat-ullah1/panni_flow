import React, { useState } from 'react';
import './Earnings.css';

// ── Static Data ──────────────────────────────────────────────
const weeklyData = [
  { day: 'Mon', amount: 2100 },
  { day: 'Tue', amount: 2700 },
  { day: 'Wed', amount: 2450 },
  { day: 'Thu', amount: 3300 },
  { day: 'Fri', amount: 2850 },
  { day: 'Sat', amount: 3400 },
  { day: 'Sun', amount: 2650 },
];

const monthlyData = [
  { week: 'Week 1', amount: 13000 },
  { week: 'Week 2', amount: 15800 },
  { week: 'Week 3', amount: 14500 },
  { week: 'Week 4', amount: 17500 },
];

const filterOptions = ['This Week', 'Last Week', 'This Month'];

// ── Bar Chart ────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.amount));
  const yTicks = [0, 850, 1700, 2550, 3400];

  return (
    <div className="earn-chart-area">
      {/* Y-axis */}
      <div className="earn-y-axis">
        {[...yTicks].reverse().map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      {/* Bars */}
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
              <div key={d.day} className="earn-bar-col">
                <div className="earn-bar-track">
                  <div
                    className="earn-bar"
                    style={{ height: `${pct}%` }}
                    title={`Rs${d.amount.toLocaleString()}`}
                  />
                </div>
                <span className="earn-bar-label">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Line Chart ───────────────────────────────────────────────
const LineChart = ({ data }) => {
  const W = 860, H = 220;
  const padL = 60, padR = 30, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = 18000;
  const yTicks = [0, 4500, 9000, 13500, 18000];

  const xStep = chartW / (data.length - 1);
  const pts = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + chartH - (d.amount / maxVal) * chartH,
    ...d,
  }));

  const pathD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="earn-line-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Y grid + labels */}
      {yTicks.map((tick) => {
        const cy = padT + chartH - (tick / maxVal) * chartH;
        return (
          <g key={tick}>
            <line
              x1={padL} y1={cy} x2={W - padR} y2={cy}
              stroke="#e2e8f0" strokeWidth="1"
            />
            <text x={padL - 8} y={cy + 4} textAnchor="end"
              fontSize="11" fill="#94a3b8">{tick.toLocaleString()}</text>
          </g>
        );
      })}

      {/* X labels */}
      {pts.map((p) => (
        <text key={p.week} x={p.x} y={H - 8} textAnchor="middle"
          fontSize="12" fill="#94a3b8">{p.week}</text>
      ))}

      {/* Line */}
      <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {pts.map((p) => (
        <circle key={p.week} cx={p.x} cy={p.y} r="5"
          fill="#38bdf8" stroke="white" strokeWidth="2" />
      ))}
    </svg>
  );
};

// ── Main Component ───────────────────────────────────────────
const Earnings = () => {
  const [filter, setFilter] = useState('This Week');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              <rect x="3" y="4" width="18" height="18" rx="2"
                stroke="#64748b" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#64748b"
                strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{filter}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#64748b"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* Stat Cards */}
      <div className="earn-stats">
        <div className="earn-stat-card">
          <div className="earn-stat-info">
            <span className="earn-stat-label">Total Earnings (Week)</span>
            <span className="earn-stat-value">Rs19,750</span>
            <span className="earn-stat-trend">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7v10"
                  stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +12.5% from last week
            </span>
          </div>
          <div className="earn-stat-icon earn-icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              <path d="M12 7v10M9 9h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3H15"
                stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="earn-stat-card">
          <div className="earn-stat-info">
            <span className="earn-stat-label">Trips Completed</span>
            <span className="earn-stat-value">43</span>
            <span className="earn-stat-note">Average: 6.1 per day</span>
          </div>
          <div className="earn-stat-icon earn-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M17 7L10 3L3 7M17 7L10 11M17 7V13L10 17M10 11L3 7M10 11V17M3 7V13L10 17"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="earn-stat-card">
          <div className="earn-stat-info">
            <span className="earn-stat-label">Distance Covered</span>
            <span className="earn-stat-value">284 km</span>
            <span className="earn-stat-note">This week</span>
          </div>
          <div className="earn-stat-icon earn-icon-pink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 1114 0C19 13.5 12 21 12 21z"
                stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="8.5" r="2.5" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="earn-stat-card">
          <div className="earn-stat-info">
            <span className="earn-stat-label">Average per Trip</span>
            <span className="earn-stat-value">Rs459</span>
            <span className="earn-stat-note">Per delivery</span>
          </div>
          <div className="earn-stat-icon earn-icon-orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l4-8 4 4 3-6 4 4" stroke="white"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 17H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="earn-card">
        <div className="earn-card-header">
          <div>
            <h2 className="earn-card-title">Weekly Earnings</h2>
            <p className="earn-card-sub">Daily earnings breakdown for this week</p>
          </div>
          <span className="earn-card-badge">+Rs2,450 this week</span>
        </div>
        <BarChart data={weeklyData} />
      </div>

      {/* Monthly Line Chart */}
      <div className="earn-card">
        <div className="earn-card-header">
          <div>
            <h2 className="earn-card-title">Monthly Trend</h2>
            <p className="earn-card-sub">Weekly earnings comparison for this month</p>
          </div>
        </div>
        <LineChart data={monthlyData} />
      </div>

      {/* Payment Status */}
      <div className="earn-card">
        <h2 className="earn-card-title" style={{ marginBottom: '18px' }}>Payment Status</h2>

        <div className="earn-payment-row earn-paid">
          <div>
            <span className="earn-payment-label">Last Payment</span>
            <span className="earn-payment-amount">Rs18,500</span>
          </div>
          <span className="earn-badge earn-badge-paid">Paid · Jan 20, 2026</span>
        </div>

        <div className="earn-payment-row earn-processing">
          <div>
            <span className="earn-payment-label">Pending Payment</span>
            <span className="earn-payment-amount">Rs19,750</span>
          </div>
          <span className="earn-badge earn-badge-processing">Processing</span>
        </div>
      </div>

    </div>
  );
};

export default Earnings;
