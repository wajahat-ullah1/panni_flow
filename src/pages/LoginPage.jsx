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
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');

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

  const handleForgotPasswordClick = () => {
    setIsForgotPasswordVisible(true);
    setForgotEmail('');
    setForgotError('');
  };

  const handleResetPasswordRequest = async (e) => {
    e.preventDefault();
    setForgotError('');
    const emailToForget = forgotEmail;

    if (!emailToForget || !validateEmail(emailToForget)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    try {
      await authApi.forgotPassword(emailToForget);
      setForgotError('');
      alert(`A password reset link has been sent to ${emailToForget}. Please check your inbox and spam folder.`);
      setIsForgotPasswordVisible(false);
      setForgotEmail('');
      // Optionally, navigate the user back to the current tenant login view after success
      navigate(`/${tenantId}/login`);
    } catch (error) {
      console.error('Forgot password error:', error);
      const apiMessage = error?.response?.data?.message;
      setForgotError(apiMessage || 'Failed to send reset link. Please try again later.');
    }
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
          flex-wrap: wrap;
          background: #f8fafc;
          overflow: hidden;
        }

        /* ── Left Panel ── */
        .pf-lp {
          width: 48%;
          min-width: 320px;
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
          font-size: 14.5px; color: rgba(255,255,255,0.75);
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

        .pf-feat-text { font-size: 13px; color: rgba(255,255,255,0.92); font-weight: 600; }
        .pf-feat-sub { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; }

        /* ── Right Panel ── */
        .pf-rp {
          flex: 1;
          min-width: 320px;
          display: flex; align-items: center; justify-content: center;
          padding: 36px 40px;
          background: #f8fafc;
          overflow-y: auto;
        }

        .pf-card {
          width: 100%; max-width: 480px; background: #ffffff;
          border-radius: 28px; padding: 42px 36px;
          box-shadow: 0 28px 80px rgba(15,23,42,0.12);
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
          width: 100%; padding: 12px 14px 12px 44px; border: 1px solid #d1d5db;
          border-radius: 8px; font-size: 13px; transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .pf-iw input:focus {
          outline: none; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6;
        }

        .pf-eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          width: 32px; height: 32px; border: none; background: transparent;
          display: inline-flex; align-items: center; justify-content: center;
          color: #64748b; cursor: pointer;
          padding: 0;
        }

        /* Buttons */
        .pf-btn {
          width: 100%; padding: 14px 16px; border-radius: 12px; font-size: 15px;
          font-weight: 700; cursor: pointer; transition: background 0.2s, opacity 0.2s, transform 0.2s;
        }

        .pf-btn-primary {
          background-color: #2563eb; color: white; border: none;
          box-shadow: 0 14px 30px rgba(59,130,246,0.16);
        }
        .pf-btn-primary:hover:not(:disabled) { background-color: #1d4ed8; transform: translateY(-1px); }
        .pf-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

        .pf-btn-secondary {
          background-color: transparent; color: #2563eb; border: none;
          padding: 12px 0; width: 100%; text-align: center;
          cursor: pointer; transition: opacity 0.2s;
        }
        .pf-btn-secondary:hover { opacity: 0.85; }

        .pf-card {
          width: 100%; max-width: 460px; background: #ffffff;
          border-radius: 28px; padding: 42px 36px; box-shadow: 0 28px 80px rgba(15,23,42,0.12);
        }

        .pf-checkbox-label {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 13px; color: #475569; cursor: pointer;
        }

        .pf-checkbox-label input {
          width: 16px; height: 16px; accent-color: #2563eb;
          border: 1px solid #cbd5e1; border-radius: 4px;
        }

        .pf-form-actions {
          margin-top: 16px;
        }

        .pf-form-actions button {
          width: 100%;
        }

        .pf-text-link-row {
          margin-top: 18px;
          display: flex;
          justify-content: center;
        }

        .pf-link-button {
          border: none;
          background: none;
          color: #2563eb;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .pf-link-button:hover:not(:disabled) {
          text-decoration: underline;
        }

        .pf-card-header {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 24px;
        }

        .forgot-form-container {
          margin-top: 0;
          padding: 0;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .pf-section-title {
          font-size: 28px; font-weight: 800; color: #111827; margin-bottom: 10px;
        }

        .pf-section-text {
          font-size: 14px; color: #475569; margin-bottom: 28px;
          line-height: 1.75;
        }`}
      </style>
      <div className="pf-login-root">
        {/* Left Panel */}
        <div className="pf-lp">
          <div className="pf-grid"></div>
          <div className="pf-logo-wrap">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="pf-logo-svg" style={{ width: '100%', height: 'auto' }} />
            ) : (
              <span className="pf-logo-svg" style={{ fontSize: '32px' }}>PanniFlow</span>
            )}
          </div>
          <div className="pf-lp-content">
            <h1 className="pf-lp-title">{tenantData?.name || 'Welcome to PanniFlow'}</h1>
            <p className="pf-lp-subtitle">
              The secure platform for managing your business operations. Log in to continue.
            </p>

            <div className="pf-features">
              <div className="pf-feat">
                <div className="pf-feat-icon">⚙️</div>
                <div>
                  <div className="pf-feat-text">Modular Design</div>
                  <div className="pf-feat-sub">Scalable components for future growth.</div>
                </div>
              </div>
              <div className="pf-feat">
                <div className="pf-feat-icon">🔒</div>
                <div>
                  <div className="pf-feat-text">Secure Auth</div>
                  <div className="pf-feat-sub">Token-based and role-gated access.</div>
                </div>
              </div>
              <div className="pf-feat">
                <div className="pf-feat-icon">🚀</div>
                <div>
                  <div className="pf-feat-text">High Performance</div>
                  <div className="pf-feat-sub">Built with modern React and Vite stack.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="pf-rp">
          <div className="pf-card">
            <h2 className="pf-title">{tenantData?.name || 'Login'}</h2>
            <p className="pf-sub">Sign in to access your dashboard.</p>

            {!isForgotPasswordVisible ? (
              <form onSubmit={handleLogin}>
                {loginError && (
                  <div className="pf-err">{loginError}</div>
                )}

                <div className="pf-fg">
                  <label htmlFor="email">Email Address</label>
                  <div className="pf-iw">
                    <span className="pf-i-icon">📧</span>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="pf-fg">
                  <label htmlFor="password">Password</label>
                  <div className="pf-iw">
                    <span className="pf-i-icon">🔑</span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="pf-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pf-fg">
                  <label htmlFor="rememberMe" className="pf-checkbox-label">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <span>Remember Me</span>
                  </label>
                </div>

                <div className="pf-form-actions">
                  <button
                    type="submit"
                    className="pf-btn pf-btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Logging In...' : 'Login'}
                  </button>
                </div>

                <div className="pf-text-link-row">
                  <button
                    type="button"
                    className="pf-link-button"
                    onClick={handleForgotPasswordClick}
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            ) : (
              <div className="forgot-form-container">
                <div className="pf-card-header">
                  <button
                    type="button"
                    className="pf-link-button"
                    onClick={() => {
                      setIsForgotPasswordVisible(false);
                      setForgotError('');
                    }}
                  >
                    ← Back to login
                  </button>
                </div>

                <h3 className="pf-section-title">Forgot Your Password?</h3>
                <p className="pf-section-text">
                  Enter your email address below to receive a password reset link.
                </p>

                {forgotError && (
                  <div className="pf-err">{forgotError}</div>
                )}

                <form onSubmit={handleResetPasswordRequest}>
                  <div className="pf-fg">
                    <label htmlFor="forgotEmail">Email Address</label>
                    <div className="pf-iw">
                      <span className="pf-i-icon">📧</span>
                      <input
                        id="forgotEmail"
                        type="email"
                        placeholder="you@company.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="pf-btn pf-btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;