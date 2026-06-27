import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../shared/hooks/useAuth';
import authApi from '../shared/api/authApi';
import { useTenant } from '../shared/context/TenantContext';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId, tenantData } = useTenant();
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Extract token from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('No reset token found in the URL.');
    }
  }, [location.search]);

  // 2. Handle form submission for password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) {
        setError("Error: Token is missing or invalid.");
        return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.resetPassword({
        token,
        newPassword,
      });

      if (response?.success) {
        alert('Success! Your password has been reset.');
        // Redirect to login page upon successful reset
        navigate(`/${tenantId}/login`);
      } else {
        throw new Error(response.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'An unexpected error occurred during the reset process.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return <div className="p-8 text-center">Loading token...</div>;
  }

  return (
    <>
      <style>{`
        /* Reusing styles from LoginPage.jsx for consistency */
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

        /* Form Styling */
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
          width: 100%; padding: 12px 14px; border: 1px solid #d1d5db;
          border-radius: 8px; font-size: 13px; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pf-iw input:focus {
          outline: none; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6;
        }

        /* Buttons */
        .pf-btn {
          width: 100%; padding: 12px; border-radius: 8px; font-size: 15px;
          font-weight: 600; cursor: pointer; transition: background 0.2s, opacity 0.2s;
        }

        .pf-btn-primary {
          background-color: #3b82f6; color: white; border: none;
        }
        .pf-btn-primary:hover:not(:disabled) { background-color: #2563eb; }
        .pf-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Forgot Password Section */
        .forgot-password-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .forgot-password-section h4 {
          font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 12px;
        }`}
      </style>
      <div className="pf-login-root">
        {/* Left Panel (Copied for visual consistency) */}
        <div className="pf-lp">
          <div className="pf-grid"></div>
          <div className="pf-logo-wrap">
            {/* Assuming logo logic remains the same or can be simplified/removed if not needed on this page */}
             <span style={{ fontSize: '32px' }}>PanniFlow</span>
          </div>
          <div className="pf-lp-content">
            <h1 className="pf-lp-title">{tenantData?.name || 'Welcome to PanniFlow'}</h1>
            <p className="pf-lp-subtitle">
              The secure platform for managing your business operations. Log in to continue.
            </p>

            <div className="pf-features">
              {/* ...existing feature divs... */}
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

        {/* Right Panel (Reset Form) */}
        <div className="pf-rp">
          <div className="pf-card">
            <h2 className="pf-title">Reset Password</h2>
            <p className="pf-sub">Use the link provided to set a new password.</p>

            {/* Error Display */}
            {error && (
                <div className="pf-err">{error}</div>
            )}

            <form onSubmit={handleResetPassword}>
              {/* New Password Field */}
              <div className="pf-fg">
                <label htmlFor="newPassword">New Password</label>
                <div className="pf-iw">
                  <span className="pf-i-icon">🔑</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="pf-fg">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="pf-iw">
                  <span className="pf-i-icon">🔑</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="pf-btn pf-btn-primary"
                disabled={loading || !token}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;