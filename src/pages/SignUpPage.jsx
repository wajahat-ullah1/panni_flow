import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../shared/hooks/useAuth';
import authApi from '../shared/api/authApi';
import { useTenant } from '../shared/context/TenantContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { tenantId, tenantData, logoUrl } = useTenant();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[a-zA-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const parseRegisterResponse = (payload) => {
    const isSuccess = payload?.success === true;
    const user = payload?.data?.user;
    const token = payload?.data?.accessToken;

    if (!isSuccess || !user || !token) {
      throw new Error('Invalid registration response from server');
    }

    return { user, token };
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters with letters and numbers');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.registerCustomer({
        fullName,
        email,
        phone: phoneNumber,
        password,
      });

      const { user, token } = parseRegisterResponse(response);
      login(user, token);

      alert('Account created successfully!');
      navigate(`/${tenantId}/customer/dashboard`);
    } catch (error) {
      console.error('Sign up error:', error);
      const apiMessage = error?.response?.data?.message;
      alert(apiMessage || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up pressed');
  };

  const handleMicrosoftSignUp = () => {
    console.log('Microsoft sign up pressed');
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    console.log('Terms of Service clicked');
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    console.log('Privacy Policy clicked');
  };

  const handleSignIn = () => {
    navigate(`/${tenantId}/login`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pf-su-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          overflow: hidden;
        }

        /* ── Left Panel ── */
        .pf-su-lp {
          width: 42%;
          background: linear-gradient(145deg, #0369a1 0%, #0ea5e9 50%, #06b6d4 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 44px;
          position: relative;
          overflow: hidden;
        }

        .pf-su-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.12;
          animation: suFloat 8s ease-in-out infinite;
        }
        .pf-su-blob-1 { width: 360px; height: 360px; background: #bae6fd; top: -110px; right: -90px; animation-delay: 0s; }
        .pf-su-blob-2 { width: 240px; height: 240px; background: #7dd3fc; bottom: -50px; left: -50px; animation-delay: 2.5s; }
        .pf-su-blob-3 { width: 160px; height: 160px; background: #e0f2fe; top: 55%; left: 18%; animation-delay: 5s; }

        @keyframes suFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.04); }
        }

        .pf-su-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .pf-su-lp-content {
          position: relative; z-index: 2; text-align: center;
          animation: suFadeIn 0.7s ease 0.1s both;
        }
        @keyframes suFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .pf-su-logo-wrap {
          width: 76px; height: 76px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .pf-su-lp-title {
          font-size: 30px; font-weight: 800;
          color: #ffffff; letter-spacing: -0.8px;
          line-height: 1.2; margin-bottom: 12px;
        }

        .pf-su-lp-subtitle {
          font-size: 14px; color: rgba(255,255,255,0.65);
          line-height: 1.7; max-width: 300px;
          margin: 0 auto 36px;
        }

        .pf-su-steps {
          display: flex; flex-direction: column; gap: 12px;
          width: 100%; max-width: 320px;
        }

        .pf-su-step {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 14px 18px;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
          cursor: default;
          text-align: left;
        }
        .pf-su-step:hover { background: rgba(255,255,255,0.13); }

        .pf-su-step-num {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 1.5px solid rgba(255,255,255,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; color: #fff;
          flex-shrink: 0;
        }

        .pf-su-step-text { font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 600; }
        .pf-su-step-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

        .pf-su-lp-footer {
          margin-top: 36px;
          font-size: 11.5px; color: rgba(255,255,255,0.35);
        }

        /* ── Right Panel ── */
        .pf-su-rp {
          flex: 1;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 40px 56px;
          background: #f8fafc;
          overflow-y: auto;
        }

        .pf-su-card {
          width: 100%; max-width: 460px;
          padding-top: 8px;
          animation: suCardUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes suCardUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pf-su-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #e0f2fe; color: #0369a1;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid #bae6fd;
        }

        .pf-su-title {
          font-size: 26px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .pf-su-sub { font-size: 14px; color: #64748b; margin-bottom: 28px; }

        /* Two-column row */
        .pf-su-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 0;
        }

        /* Fields */
        .pf-su-fg { margin-bottom: 18px; }
        .pf-su-fg label {
          display: block; font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 6px;
        }
        .pf-su-iw { position: relative; display: flex; align-items: center; }
        .pf-su-i-icon {
          position: absolute; left: 13px;
          display: flex; align-items: center; pointer-events: none;
        }

        .pf-su-iw input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 11px;
          font-size: 14px; color: #1e293b;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pf-su-iw input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
        }
        .pf-su-iw input::placeholder { color: #94a3b8; }

        .pf-su-eye {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 2px;
          color: #94a3b8; transition: color 0.15s;
        }
        .pf-su-eye:hover { color: #475569; }

        .pf-su-hint {
          font-size: 11.5px; color: #94a3b8;
          margin-top: 5px; margin-left: 2px;
        }

        /* Terms */
        .pf-su-terms {
          display: flex; align-items: flex-start; gap: 10px;
          margin-bottom: 22px; cursor: pointer;
        }
        .pf-su-terms input[type="checkbox"] {
          width: 16px; height: 16px; margin-top: 2px;
          accent-color: #0ea5e9; cursor: pointer; flex-shrink: 0;
        }
        .pf-su-terms-text {
          font-size: 13px; color: #475569; line-height: 1.55; font-weight: 500;
        }
        .pf-su-terms-link {
          color: #0ea5e9; font-weight: 700; text-decoration: none;
          transition: color 0.2s;
        }
        .pf-su-terms-link:hover { color: #0369a1; text-decoration: underline; }

        /* Submit Button */
        .pf-su-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #0369a1, #0ea5e9);
          color: #fff; border: none; border-radius: 11px;
          font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(14,165,233,0.35);
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 22px;
        }
        .pf-su-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,165,233,0.4);
        }
        .pf-su-btn:active:not(:disabled) { transform: translateY(0); }
        .pf-su-btn:disabled { opacity: 0.8; cursor: not-allowed; transform: none; }

        .pf-su-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: suSpin 0.6s linear infinite;
        }
        @keyframes suSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .pf-su-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
        }
        .pf-su-div-line { flex: 1; height: 1px; background: #e2e8f0; }
        .pf-su-div-text { font-size: 12px; color: #94a3b8; font-weight: 500; }

        /* Sign in row */
        .pf-su-signin-row { text-align: center; }
        .pf-su-signin-text { font-size: 14px; color: #64748b; }
        .pf-su-signin-link {
          background: none; border: none;
          font-size: 14px; color: #0ea5e9; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .pf-su-signin-link:hover { color: #0369a1; text-decoration: underline; }

        /* Responsive */
        @media (max-width: 960px) {
          .pf-su-lp { display: none; }
          .pf-su-rp { padding: 40px 24px; }
        }
        @media (max-width: 540px) {
          .pf-su-row { grid-template-columns: 1fr; }
          .pf-su-rp { padding: 32px 16px; }
          .pf-su-title { font-size: 22px; }
        }
      `}</style>

      <div className="pf-su-root">

        {/* ── Left Panel ── */}
        <div className="pf-su-lp">
          <div className="pf-su-blob pf-su-blob-1" />
          <div className="pf-su-blob pf-su-blob-2" />
          <div className="pf-su-blob pf-su-blob-3" />
          <div className="pf-su-grid" />

          <div className="pf-su-lp-content">
            <div className="pf-su-logo-wrap">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={tenantData?.name}
                  style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 8 }}
                />
              ) : (
                <svg className="pf-logo-svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="White" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* <!-- Outer liquid contour --> */}
                  <path d="M12 2C11.5 2.8 6 11 6 15a6 6 0 0 0 12 0c0-4-5.5-12.2-6-13z" />
                  {/* <!-- Stylish internal reflection accent --> */}
                  <path d="M15 13a3 3 0 0 0-3-3" />
                </svg>
              )}
            </div>

            <h1 className="pf-su-lp-title">Join {tenantData?.name ?? 'Pani Flow'}</h1>
            <p className="pf-su-lp-subtitle">Create your account in minutes and start ordering fresh water delivered to your door.</p>

            <div className="pf-su-steps">
              <div className="pf-su-step">
                <div className="pf-su-step-num">1</div>
                <div>
                  <div className="pf-su-step-text">Create Your Account</div>
                  <div className="pf-su-step-sub">Fill in your details below</div>
                </div>
              </div>
              <div className="pf-su-step">
                <div className="pf-su-step-num">2</div>
                <div>
                  <div className="pf-su-step-text">Place Your First Order</div>
                  <div className="pf-su-step-sub">Browse products and checkout</div>
                </div>
              </div>
              <div className="pf-su-step">
                <div className="pf-su-step-num">3</div>
                <div>
                  <div className="pf-su-step-text">Get Fast Delivery</div>
                  <div className="pf-su-step-sub">Track your order in real time</div>
                </div>
              </div>
            </div>

            <p className="pf-su-lp-footer">© 2026 {tenantData?.name ?? 'Pani Flow'}. All rights reserved.</p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="pf-su-rp">
          <div className="pf-su-card">

            <div className="pf-su-badge">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#0369a1" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#0369a1" strokeWidth="2"/>
              </svg>
              New Customer Registration
            </div>

            <h2 className="pf-su-title">Create Your Account 🚀</h2>
            <p className="pf-su-sub">Sign up to start ordering fresh water online with ease.</p>

            <form onSubmit={handleSignUp}>

              {/* Full Name + Phone */}
              <div className="pf-su-row">
                <div className="pf-su-fg">
                  <label>Full Name</label>
                  <div className="pf-su-iw">
                    <span className="pf-su-i-icon">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="12" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.8"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="pf-su-fg">
                  <label>Phone Number</label>
                  <div className="pf-su-iw">
                    <span className="pf-su-i-icon">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      placeholder="+92 300 0000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="pf-su-fg">
                <label>Email Address</label>
                <div className="pf-su-iw">
                  <span className="pf-su-i-icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
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
              <div className="pf-su-fg">
                <label>Password</label>
                <div className="pf-su-iw">
                  <span className="pf-su-i-icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.8"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="pf-su-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                    )}
                  </button>
                </div>
                <p className="pf-su-hint">Min 8 characters with letters and numbers</p>
              </div>

              {/* Confirm Password */}
              <div className="pf-su-fg">
                <label>Confirm Password</label>
                <div className="pf-su-iw">
                  <span className="pf-su-i-icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.8"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="pf-su-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="pf-su-terms">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <span className="pf-su-terms-text">
                  I agree to the{' '}
                  <a href="#" className="pf-su-terms-link" onClick={handleTermsClick}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="pf-su-terms-link" onClick={handlePrivacyClick}>Privacy Policy</a>
                </span>
              </label>

              {/* Create Account Button */}
              <button type="submit" className="pf-su-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="pf-su-spinner" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="pf-su-divider">
              <div className="pf-su-div-line" />
              <span className="pf-su-div-text">ALREADY A MEMBER?</span>
              <div className="pf-su-div-line" />
            </div>

            {/* Sign In */}
            <div className="pf-su-signin-row">
              <span className="pf-su-signin-text">Already have an account? </span>
              <button className="pf-su-signin-link" onClick={handleSignIn}>
                Sign in here
              </button>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default SignUpPage;