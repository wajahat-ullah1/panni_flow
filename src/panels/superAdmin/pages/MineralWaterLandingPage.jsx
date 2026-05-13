import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MineralWaterLandingPage.css";

const NAV_LINKS = ["Features", "Solutions", "Pricing", "About", "Contact"];

const MULTI_TENANT_FEATURES = [
  {
    iconBg: "bg-blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="26" height="26">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Register Multiple Companies",
    desc: "Onboard unlimited water delivery companies to the platform with seamless registration.",
  },
  {
    iconBg: "bg-teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="26" height="26">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    title: "Independent Dashboards",
    desc: "Each company gets a fully customized dashboard with complete control over their operations.",
  },
  {
    iconBg: "bg-purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="26" height="26">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Separate Users & Data",
    desc: "Complete data isolation ensuring each company's information remains secure and private.",
  },
  {
    iconBg: "bg-orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="26" height="26">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
      </svg>
    ),
    title: "Subscription Management",
    desc: "Flexible subscription plans with automated billing and payment processing for each tenant.",
  },
  {
    iconBg: "bg-pink",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="26" height="26">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Centralized Super Admin",
    desc: "Powerful super admin panel to monitor, manage, and support all companies from one place.",
  },
];

const FEATURES = [
  { icon: "📍", bg: "bg-blue", title: "Live Delivery Tracking", desc: "Real-time GPS tracking for all deliveries with customer notifications and ETA updates." },
  { icon: "🧠", bg: "bg-purple", title: "AI Demand Forecasting", desc: "Predictive analytics powered by AI to forecast demand and optimize inventory management." },
  { icon: "👥", bg: "bg-orange", title: "Driver Management", desc: "Comprehensive driver portal with route optimization, performance tracking, and scheduling." },
  { icon: "🛒", bg: "bg-teal", title: "Customer Ordering System", desc: "Easy-to-use customer portal for placing orders, managing subscriptions, and tracking deliveries." },
  { icon: "📊", bg: "bg-indigo", title: "Real-Time Analytics", desc: "Powerful dashboards with actionable insights on sales, deliveries, and business performance." },
  { icon: "💳", bg: "bg-pink", title: "Subscription Management", desc: "Automated recurring billing, payment processing, and subscription lifecycle management." },
];

const AI_FEATURES = [
  { icon: "🧠", bg: "bg-blue", title: "AI Demand Prediction", desc: "Machine learning algorithms analyze historical data to forecast future demand patterns." },
  { icon: "📈", bg: "bg-teal", title: "Smart Delivery Insights", desc: "Optimize routes and schedules based on traffic patterns and delivery history." },
  { icon: "⚡", bg: "bg-purple", title: "Revenue Analytics", desc: "Track revenue streams, identify growth opportunities, and monitor financial health." },
  { icon: "🎯", bg: "bg-orange", title: "Order Trends", desc: "Visualize order patterns, peak times, and customer behavior analytics." },
];

const DRIVER_FEATURES = [
  { icon: "📍", bg: "bg-green", title: "Live GPS Tracking", desc: "Real-time location updates and optimized routes" },
  { icon: "📦", bg: "bg-green", title: "Delivery Management", desc: "Scan, confirm, and manage deliveries on the go" },
  { icon: "🔔", bg: "bg-green", title: "Instant Notifications", desc: "Get alerts for new orders and schedule changes" },
];

const CUSTOMER_FEATURES = [
  { icon: "📦", bg: "bg-purple", title: "One-Tap Ordering", desc: "Quick reorder with saved preferences and history" },
  { icon: "📍", bg: "bg-purple", title: "Live Order Tracking", desc: "Track deliveries in real-time with accurate ETAs" },
  { icon: "🔔", bg: "bg-purple", title: "Order Notifications", desc: "Stay updated with delivery status and confirmations" },
];

// ===== NAVBAR =====
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/super-admin/login");
    }, 1000);
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M12 2C9 2 6 5 6 9c0 5 6 13 6 13s6-8 6-13c0-4-3-7-6-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="navbar-logo-text">Mineral Water<br/>Management System</span>
        </div>

        <div className="navbar-links">
          {NAV_LINKS.map(l => <a key={l} href="#">{l}</a>)}
        </div>

        <div className="navbar-actions">
          <button className="btn-get-started" onClick={handleLogin} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ===== HERO =====
function HeroSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const barHeights = [40, 65, 50, 70, 60, 80, 75, 90];
  
  const handleStartClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/super-admin/login");
    }, 2000);
  };
  
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="badge">
            <div className="badge-dot"></div>
            <span className="badge-text">Multi-Tenant SaaS Platform</span>
          </div>
          <h1 className="hero-title">
            Manage Multiple Water Delivery Companies from{" "}
            <span className="hero-title-gradient">One Powerful Platform</span>
          </h1>
          <p className="hero-desc">
            AI-powered multi-tenant SaaS platform for mineral water businesses with order management, live tracking, analytics, and delivery automation.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStartClick} disabled={loading}>
              {loading ? "Loading..." : "Lets Start →"}
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="dashboard-header">
              <span className="dashboard-title">Dashboard Overview</span>
              <div className="window-dots">
                <div className="dot-red"></div>
                <div className="dot-yellow"></div>
                <div className="dot-green"></div>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="stat-card stat-card-blue">
                <div className="stat-card-row"><span className="stat-icon">📦</span><span className="stat-label">Orders</span></div>
                <div className="stat-value">2,847</div>
                <div className="stat-sub stat-sub-green">+12% this month</div>
              </div>
              <div className="stat-card stat-card-teal">
                <div className="stat-card-row"><span className="stat-icon">📍</span><span className="stat-label">Deliveries</span></div>
                <div className="stat-value">1,453</div>
                <div className="stat-sub stat-sub-teal">Active today</div>
              </div>
              <div className="stat-card stat-card-purple">
                <div className="stat-card-row"><span className="stat-icon">👥</span><span className="stat-label">Customers</span></div>
                <div className="stat-value">8,342</div>
                <div className="stat-sub stat-sub-purple">+324 new</div>
              </div>
              <div className="stat-card stat-card-orange">
                <div className="stat-card-row"><span className="stat-icon">📈</span><span className="stat-label">Revenue</span></div>
                <div className="stat-value stat-value-orange">$45.2K</div>
                <div className="stat-sub stat-sub-orange">This week</div>
              </div>
            </div>
            <div className="dashboard-chart">
              {barHeights.map((h, i) => (
                <div key={i} className="chart-bar" style={{
                  height: `${h}%`,
                  background: i % 2 === 0
                    ? "linear-gradient(to top, #3b82f6, #06b6d4)"
                    : "linear-gradient(to top, #2563eb, #3b82f6)"
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== MULTI-TENANT =====
function MultiTenantSection() {
  return (
    <section className="multi-tenant">
      <div className="multi-tenant-inner">
        <div className="section-header">
          <div className="section-badge">Multi-Tenant Architecture</div>
          <h2 className="section-title">Built for Multiple Companies</h2>
          <p className="section-desc">
            A truly scalable SaaS platform designed to support unlimited water delivery businesses under one roof.
          </p>
        </div>
        <div className="features-grid-3">
          {MULTI_TENANT_FEATURES.slice(0, 3).map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
        <div className="features-grid-2">
          {MULTI_TENANT_FEATURES.slice(3).map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, iconBg, title, desc }) {
  return (
    <div className="feature-card">
      <div className={`feature-icon-wrap ${iconBg}`}>
        {typeof icon === "string" ? <span>{icon}</span> : icon}
      </div>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </div>
  );
}

// ===== FEATURES =====
function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-section-inner">
        <div className="section-header">
          <div className="section-badge">Powerful Features</div>
          <h2 className="section-title">Everything You Need to Scale</h2>
          <p className="section-desc">
            Enterprise-grade features designed to streamline operations and accelerate growth for water delivery businesses.
          </p>
        </div>
        <div className="features-grid-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card-sm">
              <div className={`feature-icon-sm ${f.bg}`}>{f.icon}</div>
              <div className="feature-title-sm">{f.title}</div>
              <div className="feature-desc-sm">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== DASHBOARDS =====
function DashboardsSection() {
  return (
    <section className="dashboards-section">
      <div className="dashboards-inner">
        <div className="section-header">
          <div className="section-badge">Platform Dashboards</div>
          <h2 className="section-title">Dashboards for Every Role</h2>
          <p className="section-desc">Tailored interfaces for super admins, company admins, drivers, and customers.</p>
        </div>

        <div className="dashboards-grid-top">
          {/* Super Admin */}
          <div className="db-card">
            <div className="db-card-header db-super-admin-header">
              <div className="db-card-header-icon">🖥️</div>
              <div>
                <div className="db-card-header-title">Super Admin Dashboard</div>
                <div className="db-card-header-sub">Platform Management</div>
              </div>
              <div className="db-header-dots">
                <div className="db-header-dot"></div>
                <div className="db-header-dot"></div>
                <div className="db-header-dot"></div>
              </div>
            </div>
            <div className="db-card-body">
              <div className="db-stats-grid-3">
                <div className="db-stat">
                  <div className="db-stat-label">Total Companies</div>
                  <div className="db-stat-val">128</div>
                </div>
                <div className="db-stat">
                  <div className="db-stat-label">Active Users</div>
                  <div className="db-stat-val">5.2K</div>
                </div>
                <div className="db-stat">
                  <div className="db-stat-label">MRR</div>
                  <div className="db-stat-val db-stat-val-blue">$84K</div>
                </div>
              </div>
              <div className="db-progress-bars">
                {[
                  { width: "80%", grad: "linear-gradient(to right,#06b6d4,#3b82f6)" },
                  { width: "60%", grad: "linear-gradient(to right,#a78bfa,#7c3aed)" },
                  { width: "40%", grad: "linear-gradient(to right,#f9a8d4,#ec4899)" },
                ].map((b, i) => (
                  <div key={i} className="db-progress-track">
                    <div className="db-progress-fill" style={{ width: b.width, background: b.grad }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Admin */}
          <div className="db-card">
            <div className="db-card-header db-company-header">
              <div className="db-card-header-icon">🖥️</div>
              <div>
                <div className="db-card-header-title">Company Admin Dashboard</div>
                <div className="db-card-header-sub">Business Operations</div>
              </div>
              <div className="db-header-dots">
                <div className="db-header-dot"></div>
                <div className="db-header-dot"></div>
                <div className="db-header-dot"></div>
              </div>
            </div>
            <div className="db-card-body">
              <div className="db-stats-grid-2">
                <div className="db-stat db-stat-orange">
                  <div className="db-stat-label">Today's Orders</div>
                  <div className="db-stat-val db-stat-val-orange">142</div>
                </div>
                <div className="db-stat db-stat-orange">
                  <div className="db-stat-label">Revenue</div>
                  <div className="db-stat-val db-stat-val-pink">$8.4K</div>
                </div>
              </div>
              <div className="db-mini-chart">
                {[50, 70, 45, 75, 60, 80, 70].map((h, i) => (
                  <div key={i} className="db-mini-bar" style={{
                    height: `${h}%`,
                    background: "linear-gradient(to top, #f97316, #ec4899)"
                  }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboards-grid-bottom">
          {/* Driver Panel */}
          <div className="db-card">
            <div className="db-card-header db-driver-header">
              <div className="db-card-header-icon">🚚</div>
              <div>
                <div className="db-card-header-title">Driver Panel</div>
                <div className="db-card-header-sub">Delivery Management</div>
              </div>
            </div>
            <div className="db-card-body">
              <div className="db-driver-summary">
                <div>
                  <div className="db-driver-summary-label">Active Deliveries</div>
                  <div className="db-driver-summary-sub">3 orders in progress</div>
                </div>
                <div className="db-driver-summary-count">3</div>
              </div>
              <div className="db-delivery-list">
                {[1,2,3].map(i => (
                  <div key={i} className="db-delivery-item">
                    <div className="db-delivery-avatar"></div>
                    <div className="db-delivery-lines">
                      <div className="db-delivery-line-1"></div>
                      <div className="db-delivery-line-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Panel */}
          <div className="db-card">
            <div className="db-card-header db-customer-header">
              <div className="db-card-header-icon">👤</div>
              <div>
                <div className="db-card-header-title">Customer Panel</div>
                <div className="db-card-header-sub">Order & Track</div>
              </div>
            </div>
            <div className="db-card-body">
              <div className="db-quick-order-label">Quick Order</div>
              <button className="btn-order-water">Order Water Bottle</button>
              <div className="db-order-info">
                <div className="db-order-row">
                  <span className="db-order-row-label">Last Order</span>
                  <span className="db-order-row-val">Delivered 2 days ago</span>
                </div>
                <div className="db-order-row">
                  <span className="db-order-row-label">Next Subscription</span>
                  <span className="db-order-row-val">In 3 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== AI SECTION =====
function AISection() {
  const barHeights = [55, 70, 45, 80, 65, 90, 75];
  return (
    <section className="ai-section">
      <div className="ai-inner">
        <div className="section-header">
          <div className="ai-badge">🤖 AI-Powered Intelligence</div>
          <h2 className="ai-title">Predictive Analytics & AI Insights</h2>
          <p className="ai-desc">
            Make data-driven decisions with advanced AI forecasting and real-time business intelligence.
          </p>
        </div>

        <div className="ai-grid">
          <div className="ai-features-list">
            {AI_FEATURES.map((f, i) => (
              <div key={i} className="ai-feature-item">
                <div className={`ai-feature-icon ${f.bg}`}>{f.icon}</div>
                <div>
                  <div className="ai-feature-title">{f.title}</div>
                  <div className="ai-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-forecast-card">
            <div className="ai-forecast-header">
              <span className="ai-forecast-title">Demand Forecast</span>
              <span className="ai-forecast-period">Next 7 Days</span>
            </div>
            <div className="ai-chart">
              {barHeights.map((h, i) => (
                <div key={i} className="ai-chart-col">
                  <div className="ai-chart-bar" style={{ height: `${h}%` }}></div>
                  <span className="ai-chart-label">Day {i + 1}</span>
                </div>
              ))}
            </div>
            <div className="ai-stats-grid">
              <div className="ai-stat">
                <div className="ai-stat-row">
                  <div className="ai-stat-dot dot-green-light"></div>
                  <span className="ai-stat-label">Accuracy</span>
                </div>
                <div className="ai-stat-value">94.2%</div>
              </div>
              <div className="ai-stat">
                <div className="ai-stat-row">
                  <div className="ai-stat-dot dot-blue-light"></div>
                  <span className="ai-stat-label">Prediction</span>
                </div>
                <div className="ai-stat-value">+18%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== MOBILE APPS =====
function MobileAppsSection() {
  return (
    <section className="mobile-section">
      <div className="mobile-inner">
        <div className="section-header">
          <div className="mobile-badge">📱 Mobile First Experience</div>
          <h2 className="section-title">Powerful Mobile Apps</h2>
          <p className="section-desc">
            Dedicated mobile applications for drivers and customers, delivering exceptional on-the-go experiences.
          </p>
        </div>

        {/* Driver App */}
        <div className="mobile-row">
          <div className="mobile-content">
            <div className="app-badge app-badge-green">
              <div className="app-badge-dot app-badge-dot-green"></div>
              <span className="app-badge-text-green">Driver App</span>
            </div>
            <h3 className="app-title">Streamlined Delivery Management</h3>
            <p className="app-desc">
              Empower your drivers with a powerful mobile app that optimizes routes, tracks deliveries in real-time, and enhances productivity.
            </p>
            <div className="app-features-list">
              {DRIVER_FEATURES.map((f, i) => (
                <div key={i} className="app-feature-item">
                  <div className={`app-feature-icon ${f.bg}`}>{f.icon}</div>
                  <div>
                    <div className="app-feature-name">{f.title}</div>
                    <div className="app-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-visual">
            <div className="phone-mockup">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="phone-screen-driver-header">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="phone-screen-driver-sub">Active Delivery</span>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#bbf7d0" }}></div>
                  </div>
                  <div className="phone-screen-driver-title">Delivery #4521</div>
                  <div className="phone-screen-driver-eta">ETA: 12 mins</div>
                </div>
                <div className="phone-screen-body">
                  <div className="phone-screen-row">
                    <span className="phone-screen-icon">📍</span>
                    <div>
                      <div className="phone-screen-val">123 Main Street</div>
                      <div className="phone-screen-sub">Customer: John Smith</div>
                    </div>
                  </div>
                  <div className="phone-screen-row">
                    <span className="phone-screen-icon">📦</span>
                    <div>
                      <div className="phone-screen-val">3 x 19L Bottles</div>
                      <div className="phone-screen-sub">Order #A847</div>
                    </div>
                  </div>
                  <button className="btn-delivered">Mark as Delivered</button>
                </div>
              </div>
              <div className="phone-home-bar"></div>
            </div>
          </div>
        </div>

        {/* Customer App */}
        <div className="mobile-row mobile-row-reverse">
          <div className="mobile-visual">
            <div className="phone-mockup">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="phone-screen-customer-header">
                  <div>
                    <div className="phone-customer-title">Quick Order</div>
                    <div className="phone-customer-sub">Choose your water</div>
                  </div>
                  <div className="phone-avatar"></div>
                </div>
                <div className="phone-product-card">
                  <div className="phone-product-row">
                    <div>
                      <div className="phone-product-name">19L Bottle</div>
                      <div className="phone-product-sub">Premium Water</div>
                    </div>
                    <div className="phone-product-price">$8.99</div>
                  </div>
                  <div className="phone-qty-row">
                    <button className="btn-qty btn-qty-minus">-</button>
                    <span className="phone-qty-val">3</span>
                    <button className="btn-qty btn-qty-plus">+</button>
                  </div>
                </div>
                <div className="phone-order-details">
                  <div className="phone-order-row">
                    <span className="phone-order-row-label">Delivery</span>
                    <span className="phone-order-row-val">Today, 3-5 PM</span>
                  </div>
                  <div className="phone-order-row">
                    <span className="phone-order-row-label">Total</span>
                    <span className="phone-order-row-val">$26.97</span>
                  </div>
                </div>
                <button className="btn-place-order">Place Order</button>
                <div className="phone-last-delivery">
                  <span className="phone-last-delivery-icon">⭐</span>
                  <div>
                    <div className="phone-last-delivery-title">Last Delivery</div>
                    <div className="phone-last-delivery-sub">Delivered 2 days ago · Rated 5★</div>
                  </div>
                </div>
              </div>
              <div className="phone-home-bar"></div>
            </div>
          </div>

          <div className="mobile-content">
            <div className="app-badge app-badge-purple">
              <div className="app-badge-dot app-badge-dot-purple"></div>
              <span className="app-badge-text-purple">Customer App</span>
            </div>
            <h3 className="app-title">Effortless Ordering Experience</h3>
            <p className="app-desc">
              Delight your customers with a beautiful, intuitive mobile app that makes ordering water bottles simple and convenient.
            </p>
            <div className="app-features-list">
              {CUSTOMER_FEATURES.map((f, i) => (
                <div key={i} className="app-feature-item">
                  <div className={`app-feature-icon ${f.bg}`}>{f.icon}</div>
                  <div>
                    <div className="app-feature-name">{f.title}</div>
                    <div className="app-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== CTA =====
function CTASection() {
  const navigate = useNavigate();
  
  const handleStartClick = () => {
    navigate("/super-admin/login");
  };

  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-badge">✨ Start Your Free Trial Today</div>
        <h2 className="cta-title">Ready to Digitize Your Water Delivery Business?</h2>
        <p className="cta-desc">
          Join hundreds of successful water delivery companies using our platform. No credit card required for the 14-day trial.
        </p>
        <div className="cta-buttons">
          <button className="btn-cta-primary" onClick={handleStartClick}>
            Start Now →
          </button>
        </div>
        <div className="cta-perks">
          {["14-day free trial", "No credit card required", "Cancel anytime"].map((t, i) => (
            <div key={i} className="cta-perk">
              <div className="cta-perk-check">✓</div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                  <path d="M12 2C9 2 6 5 6 9c0 5 6 13 6 13s6-8 6-13c0-4-3-7-6-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span className="footer-brand-name">Mineral Water<br/>Management System</span>
            </div>
            <p className="footer-brand-desc">
              The leading multi-tenant SaaS platform for water delivery businesses. Streamline operations, boost efficiency, and scale with confidence.
            </p>
            <div className="footer-social">
              {["𝕏", "in", "⌥", "✉"].map((icon, i) => (
                <div key={i} className="footer-social-btn">{icon}</div>
              ))}
            </div>
          </div>

          {[
            ["Product", ["Features", "Pricing", "Integrations", "API", "Changelog"]],
            ["Company", ["About Us", "Blog", "Careers", "Press", "Contact"]],
            ["Resources", ["Documentation", "Help Center", "Community", "Guides", "Status"]],
          ].map(([title, links]) => (
            <div key={title}>
              <div className="footer-col-title">{title}</div>
              <div className="footer-links">
                {links.map(l => <a key={l} href="#">{l}</a>)}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">© 2026 Mineral Water Management System. All rights reserved.</span>
          <div className="footer-legal">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN =====
export default function MineralWaterLandingPage() {
  return (
    <div className="mineral-water-landing">
      <Navbar />
      <HeroSection />
      <MultiTenantSection />
      <FeaturesSection />
      <DashboardsSection />
      <AISection />
      <MobileAppsSection />
      <CTASection />
      <Footer />
    </div>
  );
}