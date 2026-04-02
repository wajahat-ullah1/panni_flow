import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #1a9ee2;
    --blue-dark: #0f7ab8;
    --blue-light: #e8f5fd;
    --navy: #0d1b2a;
    --text: #1a2332;
    --muted: #64748b;
    --border: #e2eaf2;
    --white: #ffffff;
    --bg: #f7fafd;
    --purple: #7c3aed;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    background: var(--white);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, .logo-text {
    font-family: 'Sora', sans-serif;
  }

  /* ── NAV ── */
  nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 3rem;
    height: 70px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .nav-logo-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--blue), #0f7ab8);
    display: flex; align-items: center; justify-content: center;
  }
  .logo-text { font-size: 1.25rem; font-weight: 700; color: var(--text); letter-spacing: -0.5px; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    text-decoration: none; color: var(--muted); font-size: 0.95rem; font-weight: 500;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--blue); }
  .nav-actions { display: flex; gap: 1rem; align-items: center; }

  /* ── BUTTONS ── */
  .btn {
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem; font-weight: 600;
    padding: 0.65rem 1.5rem;
    border-radius: 10px;
    cursor: pointer; border: none;
    transition: all 0.3s ease;
    text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-outline {
    background: transparent; color: var(--text);
    border: 1.5px solid var(--border);
  }
  .btn-outline:hover { border-color: var(--blue); color: var(--blue); background: rgba(26,158,226,0.02); }
  .btn-primary {
    background: var(--blue); color: var(--white);
    box-shadow: 0 4px 16px rgba(26,158,226,0.3);
  }
  .btn-primary:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(26,158,226,0.4); }
  .btn-lg { padding: 1rem 2.2rem; font-size: 1rem; border-radius: 12px; }
  .btn-white {
    background: var(--white); color: var(--blue);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .btn-white-outline {
    background: transparent; color: var(--white);
    border: 2px solid rgba(255,255,255,0.6);
  }
  .btn-white-outline:hover { background: rgba(255,255,255,0.1); border-color: var(--white); }

  /* ── HERO ── */
  .hero {
    min-height: calc(100vh - 70px);
    display: flex; align-items: center;
    padding: 6rem 3rem;
    background: linear-gradient(145deg, #f0f8ff 0%, #e8f4fb 40%, #f7fafd 100%);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; top: -300px; right: -200px;
    width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(26,158,226,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 5rem; align-items: center; width: 100%;
  }
  .hero-content { position: relative; z-index: 2; }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--blue-light); color: var(--blue);
    font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em;
    padding: 0.5rem 1.2rem; border-radius: 100px;
    margin-bottom: 1.75rem; text-transform: uppercase;
  }
  .hero h1 {
    font-size: clamp(2.6rem, 4vw, 3.6rem);
    font-weight: 800; line-height: 1.15;
    color: var(--text); margin-bottom: 1.5rem;
    letter-spacing: -0.03em;
  }
  .hero h1 span { color: var(--blue); }
  .hero p {
    font-size: 1.15rem; color: var(--muted);
    line-height: 1.8; margin-bottom: 2.5rem; max-width: 450px;
    font-weight: 400;
  }
  .hero-actions { display: flex; gap: 1.2rem; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; }
  .hero-perks { display: flex; flex-direction: column; gap: 0.8rem; }
  .hero-perk {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.95rem; color: var(--text);
    font-weight: 500;
  }
  .perk-check {
    width: 20px; height: 20px; border-radius: 50%;
    background: #dcfce7; color: #16a34a;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; flex-shrink: 0; font-weight: 700;
  }

  /* Browser mockup */
  .hero-visual { position: relative; z-index: 2; }
  .browser-mock {
    background: var(--white);
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;
    transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
    transition: transform 0.4s ease;
  }
  .browser-mock:hover { transform: perspective(1200px) rotateY(-2deg) rotateX(1deg); }
  .browser-bar {
    background: #f0f0f0;
    padding: 10px 16px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid #e0e0e0;
  }
  .browser-dots { display: flex; gap: 6px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-r { background: #ff5f57; }
  .dot-y { background: #febc2e; }
  .dot-g { background: #28c840; }
  .browser-url {
    flex: 1; background: var(--white);
    border-radius: 6px; padding: 4px 12px;
    font-size: 0.75rem; color: var(--blue);
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    border: 1px solid var(--border);
  }
  .browser-content {
    background: linear-gradient(160deg, #f8fbff, #edf4fb);
    padding: 1.5rem;
    min-height: 280px;
  }
  .dashboard-preview {
    background: var(--white);
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .dash-header { font-size: 0.7rem; font-weight: 600; color: var(--muted); margin-bottom: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; }
  .dash-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.5rem; margin-bottom: 1rem; }
  .dash-stat {
    background: var(--bg);
    border-radius: 8px; padding: 0.6rem;
    text-align: center;
  }
  .dash-stat-val { font-family: 'Sora',sans-serif; font-size: 1rem; font-weight: 700; color: var(--blue); }
  .dash-stat-lbl { font-size: 0.6rem; color: var(--muted); margin-top: 2px; }
  .dash-chart { background: var(--bg); border-radius: 8px; height: 110px; display: flex; align-items: flex-end; padding: 0.5rem; gap: 4px; }
  .bar { border-radius: 4px 4px 0 0; flex: 1; background: var(--blue); opacity: 0.7; transition: opacity 0.2s; }
  .bar:hover { opacity: 1; }
  .bar-active { opacity: 1; background: var(--blue-dark); }

  /* ── STATS BAND ── */
  .stats-band {
    background: var(--white);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 3.5rem 3rem;
  }
  .stats-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4,1fr); gap: 2.5rem;
  }
  .stat-item { text-align: center; }
  .stat-icon { font-size: 2rem; margin-bottom: 0.6rem; }
  .stat-val {
    font-family: 'Sora',sans-serif;
    font-size: 2.6rem; font-weight: 800;
    color: var(--blue); line-height: 1;
    margin-bottom: 0.5rem;
  }
  .stat-lbl { font-size: 0.9rem; color: var(--muted); font-weight: 500; line-height: 1.5; }

  /* ── FEATURES ── */
  .features {
    padding: 7rem 3rem;
    background: var(--bg);
  }
  .section-header { 
    text-align: center;
    max-width: 650px; 
    margin: 0 auto 4.5rem; 
    width: 100%; 
  }
  .section-tag {
    display: inline-block;
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 1.2rem;
    font-family: 'Sora', sans-serif;
  }
  .section-title {
    font-size: clamp(2rem, 4vw, 2.7rem);
    font-weight: 800; color: var(--text);
    letter-spacing: -0.02em; line-height: 1.25;
  }
  .features-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem;
    width: 100%;
  }
  .feature-card {
    background: var(--white);
    border: 1px solid #e5e7eb;
    border-radius: 14px; padding: 2.4rem;
    transition: all 0.4s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .feature-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 35px rgba(26,158,226,0.15);
    border-color: rgba(26,158,226,0.4);
  }
  .feature-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; margin-bottom: 1.6rem;
    color: white;
    box-shadow: 0 4px 15px rgba(26,158,226,0.3);
  }
  .feature-card h3 {
    font-size: 1.15rem; font-weight: 700;
    margin-bottom: 0.8rem; color: var(--text);
    line-height: 1.4;
  }
  .feature-card p { font-size: 0.9rem; color: #64748b; line-height: 1.75; font-weight: 400; }

  /* ── HOW IT WORKS ── */
  .how-it-works {
    padding: 7rem 3rem;
    background: var(--white);
  }
  .steps {
    max-width: 950px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 3.5rem; position: relative;
    width: 100%;
  }
  .steps::before {
    content: '';
    position: absolute; top: 32px; left: calc(16.66% + 32px); right: calc(16.66% + 32px);
    height: 2px;
    background: linear-gradient(90deg, var(--blue) 0%, var(--blue-light) 50%, var(--blue) 100%);
  }
  .step { text-align: center; }
  .step-num {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), #0f7ab8);
    color: var(--white); font-family: 'Sora',sans-serif;
    font-size: 1.5rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: 0 10px 30px rgba(26,158,226,0.35);
    position: relative; z-index: 1;
  }
  .step-icon { font-size: 1.6rem; margin-bottom: 0.8rem; }
  .step h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.6rem; }
  .step p { font-size: 0.9rem; color: var(--muted); line-height: 1.75; }

  /* ── ROLES ── */
  .roles {
    padding: 7rem 3rem;
    background: var(--bg);
  }
  .roles-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(3,1fr); gap: 2.2rem;
    width: 100%;
  }
  .role-card {
    background: var(--white);
    border: 1px solid #e5e7eb;
    border-radius: 14px; overflow: hidden;
    transition: all 0.4s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .role-card:hover { transform: translateY(-6px); box-shadow: 0 12px 35px rgba(0,0,0,0.1); }
  .role-card.featured {
    border: 2px solid var(--purple);
    box-shadow: 0 8px 30px rgba(124,58,237,0.15);
  }
  .role-featured-badge {
    background: linear-gradient(135deg, var(--purple), #8b5cf6); color: var(--white);
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; text-align: center; padding: 0.5rem;
  }
  .role-img {
    width: 100%; height: 200px; object-fit: cover;
    background: linear-gradient(135deg, #e0eefe, #c7e0f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; overflow: hidden;
  }
  .role-img img { width: 100%; height: 100%; object-fit: cover; }
  .role-body { padding: 2rem; }
  .role-icon-wrap {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; margin-bottom: 1.2rem;
    color: white;
    box-shadow: 0 4px 15px rgba(26,158,226,0.3);
  }
  .role-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.3rem; }
  .role-card .role-sub { font-size: 0.85rem; color: #64748b; margin-bottom: 1.2rem; font-weight: 400; }
  .role-perks { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .role-perks li {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.88rem; color: #64748b;
    line-height: 1.5;
    font-weight: 400;
  }
  .role-perks li::before { content: '✓'; color: var(--blue); font-weight: 700; flex-shrink: 0; font-size: 1rem; }

  /* ── CTA ── */
  .cta-section {
    padding: 6rem 3rem;
    background: var(--white);
  }
  .cta-box {
    max-width: 950px; margin: 0 auto;
    background: linear-gradient(135deg, var(--blue) 0%, #0a8fd4 50%, #0066a8 100%);
    border-radius: 28px; padding: 5rem 4rem;
    text-align: center; position: relative; overflow: hidden;
    box-shadow: 0 30px 90px rgba(26,158,226,0.35);
  }
  .cta-box::before {
    content: '';
    position: absolute; top: -150px; right: -150px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  .cta-box h2 {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    font-weight: 800; color: var(--white);
    margin-bottom: 1rem; position: relative;
    line-height: 1.3;
  }
  .cta-box p { color: rgba(255,255,255,0.9); font-size: 1.05rem; margin-bottom: 2.5rem; position: relative; line-height: 1.6; }
  .cta-actions { display: flex; gap: 1.2rem; justify-content: center; flex-wrap: wrap; position: relative; }

  /* ── FOOTER ── */
  footer {
    background: var(--navy);
    color: rgba(255,255,255,0.7);
    padding: 5rem 3rem 2.5rem;
  }
  .footer-inner {
    max-width: 1200px; margin: 0 auto;
  }
  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 3.5rem; margin-bottom: 3.5rem;
  }
  .footer-brand .logo-text { color: var(--white); font-size: 1.15rem; }
  .footer-brand p { font-size: 0.9rem; line-height: 1.7; margin-top: 1rem; max-width: 230px; }
  .footer-col h4 {
    font-family: 'Sora',sans-serif;
    font-size: 0.9rem; font-weight: 700;
    color: var(--white); margin-bottom: 1.2rem; letter-spacing: 0.02em;
  }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
  .footer-col ul a {
    text-decoration: none; color: rgba(255,255,255,0.65);
    font-size: 0.9rem; transition: color 0.3s;
  }
  .footer-col ul a:hover { color: var(--white); }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-copy { font-size: 0.85rem; }
  .social-links { display: flex; gap: 1rem; }
  .social-btn {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.7); font-size: 0.9rem;
    text-decoration: none; transition: all 0.3s;
    cursor: pointer; border: none;
  }
  .social-btn:hover { background: var(--blue); color: var(--white); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.65s ease forwards; }
  .delay-1 { animation-delay: 0.1s; opacity: 0; }
  .delay-2 { animation-delay: 0.2s; opacity: 0; }
  .delay-3 { animation-delay: 0.35s; opacity: 0; }
  .delay-4 { animation-delay: 0.5s; opacity: 0; }
  .delay-5 { animation-delay: 0.65s; opacity: 0; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    nav {
      padding: 0 2rem;
      height: 65px;
    }
    .hero { padding: 4rem 2rem; }
    .hero-inner { gap: 3rem; }
    .hero-visual { display: none; }
    .features, .how-it-works, .roles, .cta-section, footer {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .features-grid, .roles-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .steps { grid-template-columns: 1fr; gap: 2.5rem; }
    .steps::before { display: none; }
    .stats-inner { grid-template-columns: repeat(2,1fr); gap: 2rem; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
    .nav-links { display: none; }
    .cta-box { padding: 3.5rem 2.5rem; }
  }
  @media (max-width: 600px) {
    nav { padding: 0 1.5rem; }
    .hero { padding: 3rem 1.5rem; }
    .features, .how-it-works, .roles, .cta-section, footer {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .features-grid, .roles-grid { grid-template-columns: 1fr; }
    .stats-inner { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr; }
    .cta-box { padding: 2.5rem 1.5rem; }
    .hero-actions { flex-direction: column; width: 100%; }
    .btn-lg { width: 100%; justify-content: center; }
  }
`;

const NAV_LINKS = ["Features", "How It Works", "Pricing", "About"];

const STATS = [
  { icon: "🚀", val: "40%", lbl: "Faster Deliveries" },
  { icon: "📦", val: "35%", lbl: "Route Optimization" },
  { icon: "⭐", val: "92%", lbl: "Forecast Accuracy" },
  { icon: "👥", val: "5,000+", lbl: "Concurrent Users" },
];

const FEATURES = [
  {
    icon: "💧",
    title: "Real-Time Order Tracking",
    desc: "Google Maps integration with live GPS tracking for every delivery. Customers know exactly when their water arrives.",
  },
  {
    icon: "🤖",
    title: "AI Demand Forecasting",
    desc: "Machine learning models predict demand with 92% accuracy. Never run out of stock or overstock again.",
  },
  {
    icon: "🗺️",
    title: "Route Optimization",
    desc: "Intelligent routing algorithms reduce delivery time by 35%. Save fuel, time, and increase daily deliveries.",
  },
  {
    icon: "🏢",
    title: "Multi-Tenant SaaS",
    desc: "One platform supporting multiple water delivery companies. Scalable, secure, and completely isolated.",
  },
  {
    icon: "💳",
    title: "Automated Billing",
    desc: "Generate invoices, process payments, and send receipts automatically. Integrated with major payment gateways.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Real-time business insights at a glance. Track revenue, orders, driver performance, and customer satisfaction.",
  },
];

const STEPS = [
  {
    num: "1",
    icon: "👤",
    title: "Sign Up",
    desc: "Register your water delivery company in under 2 minutes. No technical knowledge required.",
  },
  {
    num: "2",
    icon: "⚙️",
    title: "Configure",
    desc: "Add your drivers, products, and service area. Customize pricing and delivery zones.",
  },
  {
    num: "3",
    icon: "🚀",
    title: "Go Live",
    desc: "Start receiving orders and tracking deliveries in real-time. Your business is now digital.",
  },
];

const ROLES = [
  {
    icon: "🛒",
    img: "📱",
    imgBg: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
    title: "Customer Panel",
    sub: "Order water, track deliveries, manage payments",
    perks: ["One-tap reordering", "Live delivery tracking", "Payment history", "Schedule deliveries"],
    featured: false,
  },
  {
    icon: "🚚",
    img: "🗺️",
    imgBg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
    title: "Driver Panel",
    sub: "View assignments, navigate routes, update status",
    perks: ["Optimized routes", "Turn-by-turn navigation", "Proof of delivery", "Earnings tracker"],
    featured: false,
  },
  {
    icon: "🛡️",
    img: "💻",
    imgBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
    title: "Admin Panel",
    sub: "Manage operations, analytics, full control",
    perks: ["Real-time analytics", "Driver management", "Inventory control", "Revenue reports"],
    featured: true,
  },
];

const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "Roadmap"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Press Kit"],
  },
  {
    title: "Support",
    links: ["Help Center", "Documentation", "API Reference", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  },
];

const BAR_HEIGHTS = [40, 65, 45, 80, 55, 95, 70, 85, 60, 90];

export default function PanniFlowLanding() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none" }}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" opacity="0"/>
              <path d="M12 2C8 2 5 7 5 12c0 3.87 3.13 7 7 7s7-3.13 7-7c0-5-3-10-7-10zm0 15c-2.76 0-5-2.24-5-5 0-3.53 2-7.36 5-8.91C15 4.64 17 8.47 17 12c0 2.76-2.24 5-5 5z" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">Panni Flow</span>
        </a>

        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="btn btn-outline" onClick={() => navigate("/login")}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-tag fade-up delay-1">
              <span>🌊</span> SaaS Water Delivery Platform
            </div>
            <h1 className="fade-up delay-2">
              Smart Water<br />
              Delivery,{" "}
              <span>Simplified</span>
            </h1>
            <p className="fade-up delay-3">
              The all-in-one SaaS platform for water delivery companies. Manage
              orders, track drivers, and delight customers — in real time.
            </p>
            <div className="hero-actions fade-up delay-4">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/register")}>Get Started</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate("/login")}>Login</button>
            </div>
            <div className="hero-perks fade-up delay-5">
              {["No credit card required", "Setup in 5 minutes", "Cancel anytime"].map((p) => (
                <div className="hero-perk" key={p}>
                  <div className="perk-check">✓</div>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual fade-up delay-3">
            <div className="browser-mock">
              <div className="browser-bar">
                <div className="browser-dots">
                  <div className="dot dot-r" />
                  <div className="dot dot-y" />
                  <div className="dot dot-g" />
                </div>
                <div className="browser-url">panniflow.com/dashboard</div>
              </div>
              <div className="browser-content">
                <div className="dashboard-preview">
                  <div className="dash-header">How well do you retain your users?</div>
                  <div className="dash-stats">
                    {[
                      { v: "0.5K", l: "Orders" },
                      { v: "16K", l: "Deliveries" },
                      { v: "1.7K", l: "Customers" },
                      { v: "92%", l: "Accuracy" },
                    ].map((s) => (
                      <div className="dash-stat" key={s.l}>
                        <div className="dash-stat-val">{s.v}</div>
                        <div className="dash-stat-lbl">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="dash-chart">
                    {BAR_HEIGHTS.map((h, i) => (
                      <div
                        key={i}
                        className={`bar ${i === 9 ? "bar-active" : ""}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-band">
        <div className="stats-inner">
          {STATS.map((s) => (
            <div className="stat-item" key={s.lbl}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-header">
          <div className="section-tag">Features</div>
          <h2 className="section-title">Everything your water delivery business needs</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header">
          <h2 className="section-title">Get started in 3 simple steps</h2>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="roles">
        <div className="section-header">
          <h2 className="section-title">Built for every role in your team</h2>
        </div>
        <div className="roles-grid">
          {ROLES.map((r) => (
            <div className={`role-card ${r.featured ? "featured" : ""}`} key={r.title}>
              {r.featured && <div className="role-featured-badge">Full Access</div>}
              <div
                className="role-img"
                style={{ background: r.imgBg }}
              >
                <span style={{ fontSize: "5rem" }}>{r.img}</span>
              </div>
              <div className="role-body">
                <div className="role-icon-wrap">{r.icon}</div>
                <h3>{r.title}</h3>
                <p className="role-sub">{r.sub}</p>
                <ul className="role-perks">
                  {r.perks.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to modernize your water delivery?</h2>
          <p>
            Join hundreds of companies already using Panni Flow to streamline
            operations and delight customers
          </p>
          <div className="cta-actions">
            <button className="btn btn-white btn-lg" onClick={() => navigate("/register")}>Get Started</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="nav-logo" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
                <div className="nav-logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 2C8 2 5 7 5 12c0 3.87 3.13 7 7 7s7-3.13 7-7c0-5-3-10-7-10zm0 15c-2.76 0-5-2.24-5-5 0-3.53 2-7.36 5-8.91C15 4.64 17 8.47 17 12c0 2.76-2.24 5-5 5z" fill="white"/>
                  </svg>
                </div>
                <span className="logo-text">Panni Flow</span>
              </a>
              <p>The all-in-one SaaS platform for water delivery companies. Streamline operations and delight customers.</p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div className="footer-col" key={col.title}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Panni Flow. All rights reserved.</span>
            <div className="social-links">
              {["𝕏", "in", "⌥", "f"].map((s, i) => (
                <button className="social-btn" key={i}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
