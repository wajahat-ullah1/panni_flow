import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../shared/hooks/useAuth';
import authApi from '../shared/api/authApi';
import { useTenant } from '../shared/context/TenantContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { tenantId, tenantData } = useTenant();

  const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1')
    .replace(/\/api\/v\d+\/?$/, '');
  const logoUrl = tenantData?.logo ? `${API_ORIGIN}${tenantData.logo}` : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseLoginResponse = (payload) => {
    const isSuccess = payload?.success === true;
    const token = payload?.data?.accessToken;
    const user = payload?.data?.user;

    if (!isSuccess || !token || !user) {
      throw new Error('Invalid login response from server');
    }

    return { token, user };
  };

  const getRedirectPathByRole = (role) => {
    if (role === 'admin') return `/${tenantId}/admin/dashboard`;
    if (role === 'driver') return `/${tenantId}/driver/dashboard`;
    return `/${tenantId}/customer/dashboard`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    if (!email || !password) {
      setLoginError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setLoginError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setLoginError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ email, password });
      const { user: userData, token } = parseLoginResponse(response);
      login(userData, token);
      navigate(getRedirectPathByRole(userData.role));
    } catch (error) {
      console.error('Login error:', error);
      const apiMessage = error?.response?.data?.message;
      setLoginError(apiMessage || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  const handleMicrosoftLogin = () => {
    console.log('Microsoft login pressed');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    navigate(`/${tenantId}/register`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pf-login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          overflow: hidden;
        }

        /* ── Left Panel ── */
        .pf-lp {
          width: 48%;
          background: linear-gradient(145deg, #0369a1 0%, #0ea5e9 45%, #06b6d4 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 52px;
          position: relative;
          overflow: hidden;
        }

        .pf-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.12;
          animation: pfFloat 8s ease-in-out infinite;
        }
        .pf-blob-1 { width: 380px; height: 380px; background: #bae6fd; top: -120px; right: -100px; animation-delay: 0s; }
        .pf-blob-2 { width: 260px; height: 260px; background: #7dd3fc; bottom: -60px; left: -60px; animation-delay: 2s; }
        .pf-blob-3 { width: 180px; height: 180px; background: #e0f2fe; top: 50%; left: 20%; animation-delay: 4s; }

        @keyframes pfFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }

        .pf-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .pf-lp-content {
          position: relative; z-index: 2; text-align: center;
          animation: pfFadeIn 0.7s ease 0.1s both;
        }
        @keyframes pfFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .pf-logo-wrap {
          width: 80px; height: 80px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .pf-logo-svg { color: #fff; }

        .pf-lp-title {
          font-size: 32px; font-weight: 800;
          color: #ffffff; letter-spacing: -0.8px;
          line-height: 1.15; margin-bottom: 14px;
        }

        .pf-lp-subtitle {
          font-size: 14.5px; color: rgba(255,255,255,0.65);
          line-height: 1.65; max-width: 320px;
          margin: 0 auto 40px;
        }

        .pf-features { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 340px; }

        .pf-feat {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 14px 18px;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
          cursor: default;
        }
        .pf-feat:hover { background: rgba(255,255,255,0.13); }

        .pf-feat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .pf-feat-text { font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 600; }
        .pf-feat-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

        /* ── Right Panel ── */
        .pf-rp {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 60px;
          background: #f8fafc;
          overflow-y: auto;
        }

        .pf-card {
          width: 100%; max-width: 420px;
          animation: pfCardUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes pfCardUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pf-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #e0f2fe; color: #0369a1;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid #bae6fd;
        }

        .pf-title {
          font-size: 28px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.6px; margin-bottom: 8px;
        }
        .pf-sub { font-size: 14px; color: #64748b; margin-bottom: 32px; }

        /* Error */
        .pf-err {
          display: flex; align-items: center; gap: 8px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px; color: #dc2626; font-weight: 500;
          animation: pfErrShake 0.3s ease;
        }
        @keyframes pfErrShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        /* Fields */
        .pf-fg { margin-bottom: 20px; }
        .pf-fg label {
          display: block; font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 7px;
        }
        .pf-iw { position: relative; display: flex; align-items: center; }
        .pf-i-icon { position: absolute; left: 14px; display: flex; align-items: center; pointer-events: none; }

        .pf-iw input {
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
        .pf-iw input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
        .pf-iw input::placeholder { color: #94a3b8; }

        .pf-eye-btn {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 2px;
          color: #94a3b8; transition: color 0.15s;
        }
        .pf-eye-btn:hover { color: #475569; }

        /* Options Row */
        .pf-form-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px;
        }
        .pf-check-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #475569; cursor: pointer; font-weight: 500;
          user-select: none;
        }
        .pf-check-label input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #0ea5e9; padding: 0; cursor: pointer;
        }
        .pf-forgot {
          font-size: 13px; color: #0ea5e9; font-weight: 600;
          cursor: pointer; background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .pf-forgot:hover { color: #0369a1; text-decoration: underline; }

        /* Submit Button */
        .pf-signin-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #0369a1, #0ea5e9);
          color: #fff; border: none; border-radius: 11px;
          font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(14,165,233,0.35);
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 24px;
        }
        .pf-signin-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,165,233,0.4);
        }
        .pf-signin-btn:active:not(:disabled) { transform: translateY(0); }
        .pf-signin-btn:disabled { opacity: 0.8; cursor: not-allowed; transform: none; }

        .pf-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pfSpin 0.6s linear infinite;
        }
        @keyframes pfSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .pf-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .pf-div-line { flex: 1; height: 1px; background: #e2e8f0; }
        .pf-div-text { font-size: 12px; color: #94a3b8; font-weight: 500; }

        /* Sign up */
        .pf-signup-row {
          text-align: center;
        }
        .pf-signup-text { font-size: 14px; color: #64748b; }
        .pf-signup-link {
          background: none; border: none;
          font-size: 14px; color: #0ea5e9; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .pf-signup-link:hover { color: #0369a1; text-decoration: underline; }

        /* Responsive */
        @media (max-width: 900px) {
          .pf-lp { display: none; }
          .pf-rp { padding: 40px 24px; }
        }
        @media (max-width: 480px) {
          .pf-rp { padding: 32px 16px; }
          .pf-title { font-size: 24px; }
        }
      `}</style>

      <div className="pf-login-root">

        {/* ── Left Panel ── */}
        <div className="pf-lp">
          <div className="pf-blob pf-blob-1" />
          <div className="pf-blob pf-blob-2" />
          <div className="pf-blob pf-blob-3" />
          <div className="pf-grid" />

          <div className="pf-lp-content">
            {/* Logo */}
            <div className="pf-logo-wrap">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={tenantData?.name}
                  style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8 }}
                />
              ) : (
                <svg className="pf-logo-svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.5 2 6 6 6 9c0 5 6 13 6 13s6-8 6-13c0-3-2.5-7-6-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              )}
            </div>

            <h1 className="pf-lp-title">{tenantData?.name ?? 'Pani Flow'}</h1>
            <p className="pf-lp-subtitle">Order water online with ease — fast, reliable delivery right to your door.</p>

            <div className="pf-features">
              <div className="pf-feat">
                <div className="pf-feat-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M3 3h18v4H3zM3 11h18v4H3zM3 19h12v2H3z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="pf-feat-text">Easy Online Ordering</div>
                  <div className="pf-feat-sub">Place orders in seconds from any device</div>
                </div>
              </div>

              <div className="pf-feat">
                <div className="pf-feat-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M1 3h15l-1.5 9H2.5L1 3z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3h4l2 9h-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="6" cy="20" r="1.5" stroke="#fff" strokeWidth="1.8"/>
                    <circle cx="13" cy="20" r="1.5" stroke="#fff" strokeWidth="1.8"/>
                  </svg>
                </div>
                <div>
                  <div className="pf-feat-text">Track Your Deliveries</div>
                  <div className="pf-feat-sub">Real-time updates on every order</div>
                </div>
              </div>

              <div className="pf-feat">
                <div className="pf-feat-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="pf-feat-text">Safe & Secure</div>
                  <div className="pf-feat-sub">Your data is always protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="pf-rp">
          <div className="pf-card">
            <div className="pf-badge">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 6 6 9c0 5 6 13 6 13s6-8 6-13c0-3-2.5-7-6-7z" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {tenantData?.name ?? 'Pani Flow'} · Customer Portal
            </div>

            <h2 className="pf-title">Welcome Back 👋</h2>
            <p className="pf-sub">Sign in to your account to manage orders and deliveries.</p>

            {/* Error */}
            {loginError && (
              <div className="pf-err">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="pf-fg">
                <label>Email Address</label>
                <div className="pf-iw">
                  <span className="pf-i-icon">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#94a3b8" strokeWidth="1.8"/>
                      <polyline points="22,6 12,13 2,6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="pf-fg">
                <label>Password</label>
                <div className="pf-iw">
                  <span className="pf-i-icon">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.8"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="pf-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
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

              {/* Remember Me & Forgot Password */}
              <div className="pf-form-row">
                <label className="pf-check-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="pf-forgot"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="pf-signin-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="pf-spinner" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="pf-divider">
              <div className="pf-div-line" />
              <span className="pf-div-text">NEW HERE?</span>
              <div className="pf-div-line" />
            </div>

            {/* Sign Up */}
            <div className="pf-signup-row">
              <span className="pf-signup-text">Don't have an account? </span>
              <button className="pf-signup-link" onClick={handleSignUp}>
                Sign up for free
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;