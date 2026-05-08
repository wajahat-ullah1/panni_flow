import { useState, useEffect } from "react";

const NAV_LINKS = ["Features", "Solutions", "Pricing", "About", "Contact"];

const MULTI_TENANT_FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    bg: "bg-blue-500",
    title: "Register Multiple Companies",
    desc: "Onboard unlimited water delivery companies to the platform with seamless registration.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    bg: "bg-teal-500",
    title: "Independent Dashboards",
    desc: "Each company gets a fully customized dashboard with complete control over their operations.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    bg: "bg-purple-500",
    title: "Separate Users & Data",
    desc: "Complete data isolation ensuring each company's information remains secure and private.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
      </svg>
    ),
    bg: "bg-orange-500",
    title: "Subscription Management",
    desc: "Flexible subscription plans with automated billing and payment processing for each tenant.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    bg: "bg-pink-500",
    title: "Centralized Super Admin",
    desc: "Powerful super admin panel to monitor, manage, and support all companies from one place.",
  },
];

const FEATURES = [
  { icon: "📍", bg: "bg-blue-500", title: "Live Delivery Tracking", desc: "Real-time GPS tracking for all deliveries with customer notifications and ETA updates." },
  { icon: "🧠", bg: "bg-purple-500", title: "AI Demand Forecasting", desc: "Predictive analytics powered by AI to forecast demand and optimize inventory management." },
  { icon: "👥", bg: "bg-orange-500", title: "Driver Management", desc: "Comprehensive driver portal with route optimization, performance tracking, and scheduling." },
  { icon: "🛒", bg: "bg-teal-500", title: "Customer Ordering System", desc: "Easy-to-use customer portal for placing orders, managing subscriptions, and tracking deliveries." },
  { icon: "📊", bg: "bg-indigo-500", title: "Real-Time Analytics", desc: "Powerful dashboards with actionable insights on sales, deliveries, and business performance." },
  { icon: "💳", bg: "bg-pink-500", title: "Subscription Management", desc: "Automated recurring billing, payment processing, and subscription lifecycle management." },
];

const AI_FEATURES = [
  { icon: "🧠", bg: "bg-blue-500", title: "AI Demand Prediction", desc: "Machine learning algorithms analyze historical data to forecast future demand patterns." },
  { icon: "📈", bg: "bg-teal-500", title: "Smart Delivery Insights", desc: "Optimize routes and schedules based on traffic patterns and delivery history." },
  { icon: "⚡", bg: "bg-purple-500", title: "Revenue Analytics", desc: "Track revenue streams, identify growth opportunities, and monitor financial health." },
  { icon: "🎯", bg: "bg-orange-500", title: "Order Trends", desc: "Visualize order patterns, peak times, and customer behavior analytics." },
];

const DRIVER_FEATURES = [
  { icon: "📍", bg: "bg-green-500", title: "Live GPS Tracking", desc: "Real-time location updates and optimized routes" },
  { icon: "📦", bg: "bg-green-500", title: "Delivery Management", desc: "Scan, confirm, and manage deliveries on the go" },
  { icon: "🔔", bg: "bg-green-500", title: "Instant Notifications", desc: "Get alerts for new orders and schedule changes" },
];

const CUSTOMER_FEATURES = [
  { icon: "📦", bg: "bg-purple-500", title: "One-Tap Ordering", desc: "Quick reorder with saved preferences and history" },
  { icon: "📍", bg: "bg-purple-500", title: "Live Order Tracking", desc: "Track deliveries in real-time with accurate ETAs" },
  { icon: "🔔", bg: "bg-purple-500", title: "Order Notifications", desc: "Stay updated with delivery status and confirmations" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="max-w-9xl mx-auto px-2 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              <path d="M12 2a10 10 0 00-7.07 17.07A10 10 0 0012 22a10 10 0 000-20zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" opacity="0"/>
              <path d="M12 2C9 2 6 5 6 9c0 5 6 13 6 13s6-8 6-13c0-4-3-7-6-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm leading-tight">Mineral Water<br/>Management System</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="pt-28 pb-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-40">
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-blue-700 font-medium">Multi-Tenant SaaS Platform</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            Manage Multiple Water Delivery Companies from{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">One Powerful Platform</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            AI-powered multi-tenant SaaS platform for mineral water businesses with order management, live tracking, analytics, and delivery automation.
          </p>
        </div>
        <div className="flex-1 w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Dashboard Overview</h3>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500 text-sm">📦</span>
                  <span className="text-xs text-gray-500 font-medium">Orders</span>
                </div>
                <p className="text-2xl font-black text-gray-900">2,847</p>
                <p className="text-xs text-green-500 font-semibold mt-1">+12% this month</p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-teal-500 text-sm">📍</span>
                  <span className="text-xs text-gray-500 font-medium">Deliveries</span>
                </div>
                <p className="text-2xl font-black text-gray-900">1,453</p>
                <p className="text-xs text-teal-600 font-medium mt-1">Active today</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-500 text-sm">👥</span>
                  <span className="text-xs text-gray-500 font-medium">Customers</span>
                </div>
                <p className="text-2xl font-black text-gray-900">8,342</p>
                <p className="text-xs text-purple-500 font-medium mt-1">+324 new</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-500 text-sm">📈</span>
                  <span className="text-xs text-gray-500 font-medium">Revenue</span>
                </div>
                <p className="text-2xl font-black text-orange-500">$45.2K</p>
                <p className="text-xs text-orange-400 font-medium mt-1">This week</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 h-28 flex items-end gap-2">
              {[40, 65, 50, 70, 60, 80, 75, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-lg" style={{
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

function MultiTenantSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Multi-Tenant Architecture
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Built for Multiple Companies</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A truly scalable SaaS platform designed to support unlimited water delivery businesses under one roof.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {MULTI_TENANT_FEATURES.slice(0, 3).map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {MULTI_TENANT_FEATURES.slice(3).map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, bg, title, desc }) {
  return (
    <div className="border border-gray-100 rounded-3xl p-7 hover:shadow-lg transition-shadow bg-white group">
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform`}>
        {typeof icon === "string" ? (
          <span className="text-2xl">{icon}</span>
        ) : icon}
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Powerful Features
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Everything You Need to Scale</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Enterprise-grade features designed to streamline operations and accelerate growth for water delivery businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 text-xl group-hover:scale-105 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardsSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Platform Dashboards
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Dashboards for Every Role</h2>
          <p className="text-lg text-gray-500">Tailored interfaces for super admins, company admins, drivers, and customers.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Super Admin */}
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🖥️</span>
              </div>
              <div>
                <p className="text-white font-bold">Super Admin Dashboard</p>
                <p className="text-cyan-100 text-xs">Platform Management</p>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[["Total Companies","128","text-gray-900"],["Active Users","5.2K","text-gray-900"],["MRR","$84K","text-blue-500"]].map(([l,v,c],i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{l}</p>
                    <p className={`font-black text-xl ${c}`}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[80,60,40].map((w,i) => (
                  <div key={i} className="h-2 rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{width:`${w}%`, background: i===0?"linear-gradient(to right,#06b6d4,#3b82f6)":i===1?"linear-gradient(to right,#a78bfa,#7c3aed)":"linear-gradient(to right,#f9a8d4,#ec4899)"}}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Company Admin */}
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🖥️</span>
              </div>
              <div>
                <p className="text-white font-bold">Company Admin Dashboard</p>
                <p className="text-orange-100 text-xs">Business Operations</p>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[["Today's Orders","142","text-orange-400"],["Revenue","$8.4K","text-pink-500"]].map(([l,v,c],i) => (
                  <div key={i} className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{l}</p>
                    <p className={`font-black text-xl ${c}`}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-2 h-20">
                {[50,70,45,75,60,80,70].map((h,i) => (
                  <div key={i} className="flex-1 rounded-t-lg" style={{height:`${h}%`,background:"linear-gradient(to top, #f97316, #ec4899)"}}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Panel */}
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-green-500 p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🚚</span>
              </div>
              <div>
                <p className="text-white font-bold">Driver Panel</p>
                <p className="text-green-100 text-xs">Delivery Management</p>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900">Active Deliveries</p>
                  <p className="text-xs text-green-500">3 orders in progress</p>
                </div>
                <span className="text-3xl font-black text-gray-900">3</span>
              </div>
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-200"></div>
                    <div className="flex-1">
                      <div className="h-2.5 bg-green-200 rounded-full w-3/4 mb-1.5"></div>
                      <div className="h-2 bg-green-100 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Customer Panel */}
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-purple-500 p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <p className="text-white font-bold">Customer Panel</p>
                <p className="text-purple-100 text-xs">Order & Track</p>
              </div>
            </div>
            <div className="bg-white p-6">
              <p className="font-bold text-gray-900 mb-3">Quick Order</p>
              <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-xl mb-5 hover:bg-purple-600 transition-colors">
                Order Water Bottle
              </button>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Last Order</span>
                  <span className="text-sm font-semibold text-gray-900">Delivered 2 days ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Next Subscription</span>
                  <span className="text-sm font-semibold text-gray-900">In 3 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="py-24 px-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-sm font-medium mb-4">
            <span>🤖</span> AI-Powered Intelligence
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Predictive Analytics & AI Insights</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Make data-driven decisions with advanced AI forecasting and real-time business intelligence.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {AI_FEATURES.map((f, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center text-xl flex-shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-cyan-400 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg">Demand Forecast</h3>
              <span className="text-cyan-100 text-sm">Next 7 Days</span>
            </div>
            <div className="h-40 flex items-end gap-2 mb-6">
              {[55,70,45,80,65,90,75].map((h,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-white/30" style={{height:`${h}%`}}></div>
                  <span className="text-xs text-cyan-100">Day {i+1}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-300"></div>
                  <span className="text-cyan-100 text-xs">Accuracy</span>
                </div>
                <p className="text-white text-2xl font-black">94.2%</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                  <span className="text-cyan-100 text-xs">Prediction</span>
                </div>
                <p className="text-white text-2xl font-black">+18%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileAppsSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 text-purple-600 text-sm font-medium mb-4">
            <span>📱</span> Mobile First Experience
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Powerful Mobile Apps</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Dedicated mobile applications for drivers and customers, delivering exceptional on-the-go experiences.
          </p>
        </div>
        {/* Driver App */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-green-700 font-medium">Driver App</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Streamlined Delivery Management</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Empower your drivers with a powerful mobile app that optimizes routes, tracks deliveries in real-time, and enhances productivity.
            </p>
            <div className="space-y-4">
              {DRIVER_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{f.title}</p>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 bg-gray-900 rounded-[40px] p-4 shadow-2xl">
              <div className="w-20 h-5 bg-gray-800 rounded-full mx-auto mb-3"></div>
              <div className="bg-white rounded-3xl overflow-hidden">
                <div className="bg-green-500 p-4 rounded-t-3xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-xs font-medium">Active Delivery</p>
                    <div className="w-2 h-2 rounded-full bg-green-200"></div>
                  </div>
                  <p className="text-white font-black text-lg">Delivery #4521</p>
                  <p className="text-green-100 text-xs">ETA: 12 mins</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm">📍</span>
                    <div>
                      <p className="font-semibold text-sm">123 Main Street</p>
                      <p className="text-gray-500 text-xs">Customer: John Smith</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm">📦</span>
                    <div>
                      <p className="font-semibold text-sm">3 x 19L Bottles</p>
                      <p className="text-gray-500 text-xs">Order #A847</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-green-500 text-white font-bold rounded-xl text-sm">
                    Mark as Delivered
                  </button>
                </div>
              </div>
              <div className="w-16 h-1 bg-gray-700 rounded-full mx-auto mt-3"></div>
            </div>
          </div>
        </div>
        {/* Customer App */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="flex-1 flex justify-center">
            <div className="w-64 bg-gray-900 rounded-[40px] p-4 shadow-2xl">
              <div className="w-20 h-5 bg-gray-800 rounded-full mx-auto mb-3"></div>
              <div className="bg-white rounded-3xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-lg">Quick Order</p>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500"></div>
                  </div>
                  <p className="text-gray-500 text-xs mb-3">Choose your water</p>
                  <div className="border border-blue-200 rounded-xl p-3 mb-3 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">19L Bottle</p>
                        <p className="text-gray-500 text-xs">Premium Water</p>
                      </div>
                      <p className="font-black text-sm">$8.99</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">-</button>
                      <span className="font-bold text-sm">3</span>
                      <button className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold">+</button>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span><span className="font-medium text-gray-900">Today, 3-5 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Total</span><span className="font-bold text-gray-900">$26.97</span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl text-sm mb-3">
                    Place Order
                  </button>
                  <div className="bg-green-50 rounded-xl p-2 flex items-center gap-2">
                    <span className="text-green-500 text-sm">⭐</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Last Delivery</p>
                      <p className="text-xs text-gray-500">Delivered 2 days ago · Rated 5★</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-16 h-1 bg-gray-700 rounded-full mx-auto mt-3"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-purple-700 font-medium">Customer App</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Effortless Ordering Experience</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Delight your customers with a beautiful, intuitive mobile app that makes ordering water bottles simple and convenient.
            </p>
            <div className="space-y-4">
              {CUSTOMER_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{f.title}</p>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
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

function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-500 via-teal-400 to-purple-500">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
          ✨ Start Your Free Trial Today
        </div>
        <h2 className="text-5xl font-black text-white mb-6 leading-tight">
          Ready to Digitize Your Water Delivery Business?
        </h2>
        <p className="text-white/80 text-lg mb-10">
          Join hundreds of successful water delivery companies using our platform. No credit card required for the 14-day trial.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-lg text-base">
            Start Now →
          </button>
          {/* <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/30 transition-colors border border-white/30 text-base">
            Contact Sales
          </button> */}
        </div>
        <div className="flex items-center justify-center gap-8 text-white/80 text-sm">
          {["14-day free trial","No credit card required","Cancel anytime"].map((t,i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M12 2C9 2 6 5 6 9c0 5 6 13 6 13s6-8 6-13c0-4-3-7-6-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span className="font-bold text-white text-sm leading-tight">Mineral Water<br/>Management System</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The leading multi-tenant SaaS platform for water delivery businesses. Streamline operations, boost efficiency, and scale with confidence.
            </p>
            <div className="flex gap-3">
              {["𝕏","in","⌥","✉"].map((icon,i) => (
                <div key={i} className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer text-sm">
                  {icon}
                </div>
              ))}
            </div>
          </div>
          {[
            ["Product", ["Features","Pricing","Integrations","API","Changelog"]],
            ["Company", ["About Us","Blog","Careers","Press","Contact"]],
            ["Resources", ["Documentation","Help Center","Community","Guides","Status"]],
          ].map(([title, links]) => (
            <div key={title}>
              <p className="font-bold text-white mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 Mineral Water Management System. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
              <a key={l} href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MineralWaterLandingPage() {
  return (
    <div className="font-sans">
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
