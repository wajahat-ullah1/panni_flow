import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import useAuth from '../shared/hooks/useAuth';
import authApi from '../shared/api/authApi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'driver') return '/driver/dashboard';
    return '/customer/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!email || !password) {
      alert('Please enter email and password');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ email, password });
      const { user: userData, token } = parseLoginResponse(response);

      login(userData, token);

      // Show success message
      alert('Login successful!');

      navigate(getRedirectPathByRole(userData.role));
    } catch (error) {
      console.error('Login error:', error);
      const apiMessage = error?.response?.data?.message;
      alert(apiMessage || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login pressed');
  };

  const handleMicrosoftLogin = () => {
    // Handle Microsoft login
    console.log('Microsoft login pressed');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo and Title */}
        <div className="header-container">
          <div className="logo-container">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
              <rect x="5" y="4" width="14" height="16" rx="2" />
            </svg>
          </div>
          <h1 className="title">Pani Flow</h1>
          <p className="subtitle">Order water online with ease</p>
        </div>

        {/* Login Form Card */}
        <div className="form-card">
          <h2 className="welcome-text">Welcome Back</h2>
          <p className="signin-text">Sign in to your account</p>

          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="input-container">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className="input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-container">
              <label className="label">Password</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="eye-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="eye-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="options-row">
              <label className="remember-me-container">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-custom">
                  {rememberMe && (
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="remember-me-text">Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password-button"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-container">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons-container">
            <button className="social-button" onClick={handleGoogleLogin}>
              <svg className="social-icon" viewBox="0 0 24 24">
                <path
                  fill="#DB4437"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="social-button-text">Google</span>
            </button>

            <button className="social-button" onClick={handleMicrosoftLogin}>
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M13 1h10v10H13z" />
                <path fill="#7FBA00" d="M1 13h10v10H1z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              <span className="social-button-text">Microsoft</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="signup-container">
            <span className="signup-text">Don't have an account? </span>
            <button className="signup-link" onClick={handleSignUp}>
              Sign up for free
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="footer">© 2024 Pani Flow. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;