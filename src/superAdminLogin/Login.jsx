import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email === "admin@system.com" && password === "admin123") {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          if (onLogin) onLogin();
        }, 800);
      } else {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
      }
    }, 1600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          overflow: hidden;
        }

        /* ── Left Panel ── */
        .lp {
          width: 48%;
          background: linear-gradient(145deg, #0f2d6b 0%, #1d4ed8 45%, #0ea5e9 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 52px;
          position: relative;
          overflow: hidden;
        }

        .lp-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.12;
          animation: lpFloat 8s ease-in-out infinite;
        }
        .lp-blob-1 { width: 380px; height: 380px; background: #7dd3fc; top: -120px; right: -100px; animation-delay: 0s; }
        .lp-blob-2 { width: 260px; height: 260px; background: #38bdf8; bottom: -60px; left: -60px; animation-delay: 2s; }
        .lp-blob-3 { width: 180px; height: 180px; background: #bae6fd; top: 50%; left: 20%; animation-delay: 4s; }
        @keyframes lpFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }

        .lp-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .lp-content {
          position: relative; z-index: 2; text-align: center;
          animation: lpFadeIn 0.7s ease 0.1s both;
        }
        @keyframes lpFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .lp-logo {
          width: 72px; height: 72px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        .lp-title {
          font-size: 32px; font-weight: 800;
          color: #ffffff; letter-spacing: -0.8px;
          line-height: 1.15; margin-bottom: 14px;
        }

        .lp-subtitle {
          font-size: 14.5px; color: rgba(255,255,255,0.65);
          line-height: 1.65; max-width: 320px;
          margin: 0 auto 40px;
        }

        .lp-features { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 340px; }

        .lp-feat {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 14px 18px;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
          cursor: default;
        }
        .lp-feat:hover { background: rgba(255,255,255,0.13); }

        .lp-feat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .lp-feat-text { font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500; }
        .lp-feat-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 1px; }

        /* ── Right Panel ── */
        .rp {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 60px;
          background: #f8fafc;
          overflow-y: auto;
        }

        .login-card {
          width: 100%; max-width: 420px;
          animation: cardSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; color: #2563eb;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid #bfdbfe;
        }

        .login-title {
          font-size: 28px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.6px; margin-bottom: 8px;
        }
        .login-sub { font-size: 14px; color: #64748b; margin-bottom: 32px; }

        /* Error */
        .err-box {
          display: flex; align-items: center; gap: 8px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px; color: #dc2626; font-weight: 500;
          animation: errShake 0.3s ease;
        }
        @keyframes errShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        /* Fields */
        .fg { margin-bottom: 20px; }
        .fg label {
          display: block; font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 7px;
        }
        .iw { position: relative; display: flex; align-items: center; }
        .i-icon { position: absolute; left: 14px; display: flex; align-items: center; pointer-events: none; }

        .iw input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 11px;
          font-size: 14px; color: #1e293b;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .iw input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .iw input::placeholder { color: #94a3b8; }

        .eye-btn {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 2px;
          color: #94a3b8; transition: color 0.15s;
        }
        .eye-btn:hover { color: #475569; }

        /* Remember row */
        .form-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px;
        }
        .check-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #475569; cursor: pointer; font-weight: 500;
        }
        .check-label input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #2563eb; padding: 0;
        }
        .forgot { font-size: 13px; color: #2563eb; font-weight: 600; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
        .forgot:hover { text-decoration: underline; }

        /* Button */
        .login-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
          color: #fff; border: none; border-radius: 11px;
          font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 24px;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.8; cursor: not-allowed; }
        .login-btn.success { background: linear-gradient(135deg, #16a34a, #0d9488); }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .divider-text { font-size: 12px; color: #94a3b8; font-weight: 500; }

        /* Security note */
        .sec-note {
          display: flex; align-items: center; gap: 8px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 12px 16px;
        }
        .sec-note span { font-size: 12.5px; color: #15803d; font-weight: 500; }
      `}</style>

      <div className="login-root" onKeyDown={handleKeyDown}>
        {/* ── Left Panel ── */}
        <div className="lp">
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-blob lp-blob-3" />
          <div className="lp-grid" />

          <div className="lp-content">
            <div className="lp-logo">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8 2 5 8 5 12s3 8 7 8c2 0 4-1 5.5-3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19 7c0 2-1.5 4-3 5l1 4h-4l1-4c-1.5-1-3-3-3-5a4 4 0 018 0z" fill="rgba(255,255,255,0.4)" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>

            <h1 className="lp-title">Mineral Water<br/>Management System</h1>
            <p className="lp-subtitle">A centralized platform to oversee water delivery companies, subscriptions, and platform operations.</p>

            <div className="lp-features">
              <div className="lp-feat">
                <div className="lp-feat-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M3 21h18M9 21v-6h6v6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="lp-feat-text">Company Management</div>
                  <div className="lp-feat-sub">Register & manage all delivery companies</div>
                </div>
              </div>

              <div className="lp-feat">
                <div className="lp-feat-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/>
                    <path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="lp-feat-text">Subscription Billing</div>
                  <div className="lp-feat-sub">Track plans, renewals and payments</div>
                </div>
              </div>

              <div className="lp-feat">
                <div className="lp-feat-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="lp-feat-text">Live Analytics</div>
                  <div className="lp-feat-sub">Revenue, growth & usage insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="rp">
          <div className="login-card">
            <div className="login-badge">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              Super Admin Access Only
            </div>

            <h2 className="login-title">Welcome back 👋</h2>
            <p className="login-sub">Sign in to your admin dashboard to manage the platform.</p>

            {/* Error */}
            {error && (
              <div className="err-box">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="fg">
              <label>Email Address</label>
              <div className="iw">
                <span className="i-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#94a3b8" strokeWidth="1.8"/>
                    <polyline points="22,6 12,13 2,6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="admin@system.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="fg">
              <label>Password</label>
              <div className="iw">
                <span className="i-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.8"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? (
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="form-row">
              <label className="check-label">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
                Remember me
              </label>
              <button className="forgot">Forgot password?</button>
            </div>

            {/* Login Button */}
            <button
              className={`login-btn${success ? " success" : ""}`}
              onClick={handleLogin}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Signing in...
                </>
              ) : success ? (
                <>
                  ✓ Access Granted
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <div className="divider">
              <div className="divider-line"/>
              <span className="divider-text">SECURED BY</span>
              <div className="divider-line"/>
            </div>

            <div className="sec-note">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16a34a" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>256-bit SSL encryption · Restricted access · Session monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
