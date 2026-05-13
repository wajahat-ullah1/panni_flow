import React, { useState, useEffect, useCallback } from 'react';
import driverApi from '../../../shared/api/driverApi';
import useAuth from '../../../shared/hooks/useAuth';
import { getDriverId, getDriverProfile } from '../../../shared/api/driverStore';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [editMode, setEditMode]   = useState(false);
  const [langOpen, setLangOpen]   = useState(false);
  const [pwOpen, setPwOpen]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [pwSaving, setPwSaving]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [pwError, setPwError]     = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const [driverProfile, setDriverProfile] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    phone:    '',
    email:    '',
    address:  '',
  });

  const [toggles, setToggles] = useState({
    onlineStatus:          true,
    autoAccept:            false,
    deliveryUpdates:       true,
    routeChanges:          true,
    paymentNotifications:  true,
    systemAlerts:          false,
  });

  const [language, setLanguage] = useState('English');
  const languages = ['English', 'Urdu', 'Pashto'];

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  // ── Fetch profile on mount ──────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authRes = await driverApi.getMyProfile();
      const authData = authRes?.data ?? authRes;
      let driverData = getDriverProfile();
      const driverId = getDriverId();
      if (driverId) {
        try {
          const driverRes = await driverApi.getDriverById(driverId);
          driverData = driverRes?.data ?? driverRes;
        } catch {}
      }
      setDriverProfile(driverData);
      setForm({
        fullName: authData.fullName || user?.fullName || '',
        phone:    authData.phone   || user?.phone    || '',
        email:    authData.email   || user?.email    || '',
        address:  Array.isArray(driverData?.assignedAreas) ? driverData.assignedAreas.join(', ') : '',
      });
    } catch {
      setForm({
        fullName: user?.fullName || '',
        phone:    user?.phone    || '',
        email:    user?.email    || '',
        address:  '',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleToggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await driverApi.updateMyProfile({ fullName: form.fullName, phone: form.phone });
      const driverId = getDriverId();
      if (driverId) {
        try {
          const updatedRes = await driverApi.updateDriver(driverId, { name: form.fullName, phone: form.phone });
          const updatedDriver = updatedRes?.data ?? updatedRes;
          setDriverProfile((prev) => ({ ...prev, ...updatedDriver }));
        } catch {}
      }
      updateUser({ fullName: form.fullName, phone: form.phone });
      setEditMode(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    const driverId = getDriverId();
    if (!driverId) return;
    try {
      await driverApi.updateDriverStatus(driverId, newStatus);
    } catch {}
  };

  const handleOnlineToggle = () => {
    const newOnline = !toggles.onlineStatus;
    setToggles((prev) => ({ ...prev, onlineStatus: newOnline }));
    handleUpdateStatus(newOnline ? 'available' : 'off-duty');
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwError('Please fill in all password fields');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    if (passwords.newPass.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    setPwError(null);
    setPwSuccess(false);
    try {
      await driverApi.changePassword({
        currentPassword: passwords.current,
        newPassword:     passwords.newPass,
      });
      setPwSuccess(true);
      setPasswords({ current: '', newPass: '', confirm: '' });
      setPwOpen(false);
    } catch (err) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  // ── Derived display values ──────────────────────────────────────────────────
  const joinedDate = driverProfile?.createdAt
    ? new Date(driverProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const vehicleType    = driverProfile?.vehicleType   || '-';
  const vehicleNumber  = driverProfile?.vehicleNumber || '-';
  const licenseNumber  = driverProfile?.licenseNumber || '-';
  const driverStatus   = driverProfile?.status        || 'available';
  const driverId       = driverProfile?._id           || '-';

  const statusLabel =
    driverStatus === 'available'   ? 'Online' :
    driverStatus === 'on-delivery' ? 'On Delivery' : 'Offline';

  const statusColor =
    driverStatus === 'available'   ? '#22c55e' :
    driverStatus === 'on-delivery' ? '#f97316' : '#94a3b8';

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{profStyles}</style>
        <div className="prof-root">
          <div className="prof-loader">
            <div className="prof-loader-spinner" />
            <span>Loading profile…</span>
          </div>
        </div>
      </>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{profStyles}</style>
      <div className="prof-root">

        {/* ── Page Header ── */}
        <header className="prof-page-header">
          <div>
            <p className="prof-header-eyebrow">Account</p>
            <h1 className="prof-header-title">Driver Profile</h1>
            <p className="prof-header-sub">Manage your account and preferences</p>
          </div>
        </header>

        {/* ── Hero Card ── */}
        <div className="prof-hero-card">
          <div className="prof-hero-bg" />
          <div className="prof-hero-body">
            <div className="prof-avatar-wrap">
              <div className="prof-avatar">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="white"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/>
                </svg>
              </div>
              <div className="prof-camera-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                    stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="prof-hero-info">
              <h2 className="prof-hero-name">{form.fullName || user?.fullName || 'Driver'}</h2>
              <p className="prof-hero-id">ID: {driverId}</p>
              <div className="prof-hero-meta">
                {joinedDate && (
                  <span className="prof-meta-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Joined {joinedDate}
                  </span>
                )}
                <span className="prof-status-chip" style={{ background: `${statusColor}18`, color: statusColor }}>
                  <span className="prof-status-dot" style={{ background: statusColor,
                    boxShadow: `0 0 0 3px ${statusColor}30`,
                    animation: driverStatus === 'available' ? 'profPulse 2s ease infinite' : 'none'
                  }} />
                  {statusLabel}
                </span>
              </div>
            </div>

            <button
              className={`prof-edit-btn ${editMode ? 'cancel' : ''}`}
              onClick={() => { setEditMode(!editMode); setSaveError(null); }}
            >
              {editMode ? (
                <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Personal Information ── */}
        <div className="prof-card">
          <div className="prof-section-head">
            <div className="prof-section-icon" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 className="prof-section-title">Personal Information</h3>
              <p className="prof-section-sub">Your account details</p>
            </div>
          </div>

          <div className="prof-form-grid">
            <div className="prof-field">
              <label className="prof-label">Full Name</label>
              <input
                className="prof-input"
                name="fullName"
                value={form.fullName}
                onChange={handleFormChange}
                disabled={!editMode}
              />
            </div>

            <div className="prof-field">
              <label className="prof-label">Phone Number</label>
              <div className="prof-input-icon-wrap">
                <svg className="prof-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                    stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                <input
                  className="prof-input prof-input-with-icon"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div className="prof-field">
              <label className="prof-label">Email Address</label>
              <div className="prof-input-icon-wrap">
                <svg className="prof-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  className="prof-input prof-input-with-icon"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  disabled
                />
              </div>
            </div>

            <div className="prof-field">
              <label className="prof-label">Address / Areas</label>
              <div className="prof-input-icon-wrap">
                <svg className="prof-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 1114 0C19 13.5 12 21 12 21z"
                    stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="8.5" r="2.5" stroke="#94a3b8" strokeWidth="2"/>
                </svg>
                <input
                  className="prof-input prof-input-with-icon"
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  disabled={!editMode}
                />
              </div>
            </div>
          </div>

          {editMode && (
            <div className="prof-save-row">
              {saveError && <p className="prof-error-msg">{saveError}</p>}
              <button className="prof-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><span className="prof-btn-spinner" />Saving…</>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Vehicle Information ── */}
        <div className="prof-card">
          <div className="prof-section-head">
            <div className="prof-section-icon" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="9" width="22" height="11" rx="2" stroke="#fff" strokeWidth="2"/>
                <path d="M1 13h22M6 13V9l3-5h6l3 5v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="20" r="2" fill="#fff"/>
                <circle cx="17" cy="20" r="2" fill="#fff"/>
              </svg>
            </div>
            <div>
              <h3 className="prof-section-title">Vehicle Information</h3>
              <p className="prof-section-sub">Your registered vehicle details</p>
            </div>
          </div>

          <div className="prof-form-grid prof-form-3col">
            <div className="prof-field">
              <label className="prof-label">Vehicle Type</label>
              <input className="prof-input" value={vehicleType} disabled/>
            </div>
            <div className="prof-field">
              <label className="prof-label">Vehicle Number</label>
              <input className="prof-input" value={vehicleNumber} disabled/>
            </div>
            <div className="prof-field">
              <label className="prof-label">License Number</label>
              <input className="prof-input" value={licenseNumber} disabled/>
            </div>
          </div>
        </div>

        {/* ── Two-column: Availability + Preferences ── */}
        <div className="prof-two-col">

          {/* Availability */}
          <div className="prof-card">
            <div className="prof-section-head" style={{ marginBottom: 18 }}>
              <div className="prof-section-icon" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="prof-section-title">Availability</h3>
                <p className="prof-section-sub">Control your active status</p>
              </div>
            </div>

            <div className="prof-toggle-row">
              <div>
                <p className="prof-toggle-title">Online Status</p>
                <p className="prof-toggle-sub">Make yourself available for deliveries</p>
              </div>
              <button
                className={`prof-toggle ${toggles.onlineStatus ? 'on' : ''}`}
                onClick={handleOnlineToggle}
                aria-label="Toggle Online Status"
              >
                <span className="prof-toggle-knob" />
              </button>
            </div>

            <div className="prof-toggle-row" style={{ marginBottom: 0 }}>
              <div>
                <p className="prof-toggle-title">Auto-Accept Orders</p>
                <p className="prof-toggle-sub">Automatically accept assigned deliveries</p>
              </div>
              <button
                className={`prof-toggle ${toggles.autoAccept ? 'on' : ''}`}
                onClick={() => handleToggle('autoAccept')}
                aria-label="Toggle Auto-Accept"
              >
                <span className="prof-toggle-knob" />
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="prof-card">
            <div className="prof-section-head" style={{ marginBottom: 18 }}>
              <div className="prof-section-icon" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="prof-section-title">Preferences</h3>
                <p className="prof-section-sub">Language and region settings</p>
              </div>
            </div>

            <label className="prof-label" style={{ display: 'block', marginBottom: 8 }}>App Language</label>
            <div className="prof-lang-wrap">
              <button
                className="prof-lang-btn"
                onClick={() => setLangOpen(!langOpen)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
                      stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{language}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  style={{ transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {langOpen && (
                <div className="prof-lang-dropdown">
                  {languages.map((l) => (
                    <button
                      key={l}
                      className={`prof-lang-item ${language === l ? 'active' : ''}`}
                      onClick={() => { setLanguage(l); setLangOpen(false); }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Notification Preferences ── */}
        <div className="prof-card">
          <div className="prof-section-head" style={{ marginBottom: 20 }}>
            <div className="prof-section-icon" style={{ background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="prof-section-title">Notification Preferences</h3>
              <p className="prof-section-sub">Choose what you want to be notified about</p>
            </div>
          </div>

          <div className="prof-notif-grid">
            {[
              { key: 'deliveryUpdates',      title: 'Delivery Updates',       sub: 'New delivery assignments',          color: '#3b82f6' },
              { key: 'routeChanges',         title: 'Route Changes',          sub: 'Route optimizations and alerts',    color: '#f97316' },
              { key: 'paymentNotifications', title: 'Payment Notifications',  sub: 'Earnings and payment updates',      color: '#22c55e' },
              { key: 'systemAlerts',         title: 'System Alerts',          sub: 'Important system messages',         color: '#a855f7' },
            ].map(({ key, title, sub, color }) => (
              <div className="prof-toggle-row" key={key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="prof-notif-dot" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'block' }} />
                  </div>
                  <div>
                    <p className="prof-toggle-title">{title}</p>
                    <p className="prof-toggle-sub">{sub}</p>
                  </div>
                </div>
                <button
                  className={`prof-toggle ${toggles[key] ? 'on' : ''}`}
                  onClick={() => handleToggle(key)}
                  aria-label={`Toggle ${title}`}
                >
                  <span className="prof-toggle-knob" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Security ── */}
        <div className="prof-card">
          <div className="prof-section-head" style={{ marginBottom: 20 }}>
            <div className="prof-section-icon" style={{ background: 'linear-gradient(135deg,#475569,#1e293b)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="prof-section-title">Security</h3>
              <p className="prof-section-sub">Manage your password and account security</p>
            </div>
          </div>

          <div className="prof-accordion">
            <button
              className="prof-accordion-btn"
              onClick={() => { setPwOpen(!pwOpen); setPwError(null); setPwSuccess(false); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#64748b" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Change Password</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                style={{ transform: pwOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {pwOpen && (
              <div className="prof-pw-form">
                {pwError && <p className="prof-error-msg">{pwError}</p>}
                {pwSuccess && <p className="prof-success-msg">Password updated successfully!</p>}

                <div className="prof-pw-grid">
                  <div className="prof-field">
                    <label className="prof-label">Current Password</label>
                    <input
                      type="password"
                      className="prof-input"
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">New Password</label>
                    <input
                      type="password"
                      className="prof-input"
                      placeholder="Enter new password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="prof-input"
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>

                <div className="prof-save-row" style={{ marginTop: 0 }}>
                  <button
                    className="prof-save-btn"
                    onClick={handleChangePassword}
                    disabled={pwSaving}
                  >
                    {pwSaving ? (
                      <><span className="prof-btn-spinner" />Updating…</>
                    ) : (
                      <>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const profStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.prof-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px 36px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Loader ── */
.prof-loader {
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 14px;
  height: 60vh; color: #64748b; font-size: 14px; font-weight: 500;
}
.prof-loader-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: profSpin 0.7s linear infinite;
}
@keyframes profSpin { to { transform: rotate(360deg); } }

/* ── Page Header ── */
.prof-page-header { margin-bottom: 4px; }
.prof-header-eyebrow {
  font-size: 13px; font-weight: 600; color: #0ea5e9;
  margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.6px;
}
.prof-header-title {
  font-size: 28px; font-weight: 800; color: #0f172a;
  margin: 0 0 4px; letter-spacing: -0.5px;
}
.prof-header-sub {
  font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;
}

/* ── Hero Card ── */
.prof-hero-card {
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  position: relative;
}
.prof-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%);
  z-index: 0;
}
.prof-hero-body {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 22px;
  padding: 28px 30px;
}

/* Avatar */
.prof-avatar-wrap { position: relative; flex-shrink: 0; }
.prof-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 3px solid rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.prof-camera-btn {
  position: absolute; bottom: 0; right: 0;
  width: 26px; height: 26px; border-radius: 50%;
  background: #1e293b;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid #fff;
  transition: background 0.2s;
}
.prof-camera-btn:hover { background: #0f172a; }

/* Hero info */
.prof-hero-info { flex: 1; }
.prof-hero-name {
  font-size: 22px; font-weight: 800; color: #fff;
  margin: 0 0 4px; letter-spacing: -0.3px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.prof-hero-id {
  font-size: 12px; color: rgba(255,255,255,0.65);
  margin: 0 0 12px; font-weight: 500; letter-spacing: 0.3px;
}
.prof-hero-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.prof-meta-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.28);
  border-radius: 20px; padding: 4px 12px;
  font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
}
.prof-status-chip {
  display: inline-flex; align-items: center; gap: 6px;
  border-radius: 20px; padding: 4px 12px;
  font-size: 12px; font-weight: 700;
  backdrop-filter: blur(4px);
}
.prof-status-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
@keyframes profPulse {
  0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.3); }
  50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0.08); }
}

/* Edit button */
.prof-edit-btn {
  margin-left: auto; flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.4);
  color: #fff; border-radius: 10px;
  padding: 10px 20px;
  font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all 0.2s;
  backdrop-filter: blur(4px);
}
.prof-edit-btn:hover { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.6); }
.prof-edit-btn.cancel {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.4);
  color: #fecaca;
}
.prof-edit-btn.cancel:hover { background: rgba(239,68,68,0.28); }

/* ── Card ── */
.prof-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 26px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.prof-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }

/* ── Section Head ── */
.prof-section-head {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 22px;
}
.prof-section-icon {
  width: 40px; height: 40px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0,0,0,0.14);
}
.prof-section-title {
  font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 1px;
}
.prof-section-sub {
  font-size: 12px; color: #94a3b8; margin: 0; font-weight: 500;
}

/* ── Form Grid ── */
.prof-form-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
}
.prof-form-3col { grid-template-columns: repeat(3, 1fr); }

.prof-field { display: flex; flex-direction: column; gap: 7px; }

.prof-label {
  font-size: 12px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.4px;
}

.prof-input {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 14px; font-weight: 500; color: #0f172a;
  font-family: 'DM Sans', sans-serif;
  background: #fff; box-sizing: border-box;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.prof-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
}
.prof-input:disabled {
  background: #f8fafc; color: #64748b; cursor: default; border-color: #f1f5f9;
}
.prof-input-icon-wrap { position: relative; }
.prof-input-icon {
  position: absolute; left: 13px; top: 50%;
  transform: translateY(-50%); pointer-events: none;
}
.prof-input-with-icon { padding-left: 38px; }

/* Save Row */
.prof-save-row {
  display: flex; flex-direction: column; align-items: flex-end;
  margin-top: 20px; gap: 8px;
}
.prof-error-msg   { font-size: 13px; color: #ef4444; margin: 0; font-weight: 500; }
.prof-success-msg { font-size: 13px; color: #22c55e; margin: 0; font-weight: 500; }

.prof-save-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  padding: 10px 22px;
  font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(14,165,233,0.3);
  transition: all 0.2s;
}
.prof-save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(14,165,233,0.4);
}
.prof-save-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.prof-btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: profSpin 0.6s linear infinite;
  flex-shrink: 0;
}

/* ── Two-column row ── */
.prof-two-col {
  display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
}

/* ── Toggle Row ── */
.prof-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px; padding: 15px 18px;
  margin-bottom: 10px;
  transition: background 0.15s;
}
.prof-toggle-row:hover { background: #f1f5f9; }
.prof-toggle-title {
  font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px;
}
.prof-toggle-sub {
  font-size: 12px; color: #94a3b8; margin: 0; font-weight: 500;
}

/* Toggle switch */
.prof-toggle {
  width: 48px; height: 28px; border-radius: 14px;
  background: #cbd5e1; border: none; cursor: pointer;
  position: relative; flex-shrink: 0;
  transition: background 0.25s; padding: 0;
}
.prof-toggle.on { background: linear-gradient(135deg,#0369a1,#0ea5e9); }
.prof-toggle-knob {
  position: absolute; top: 3px; left: 3px;
  width: 22px; height: 22px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: left 0.25s; display: block;
}
.prof-toggle.on .prof-toggle-knob { left: 23px; }

/* ── Notification grid ── */
.prof-notif-grid { display: flex; flex-direction: column; gap: 0; }
.prof-notif-dot {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

/* ── Language Dropdown ── */
.prof-lang-wrap { position: relative; }
.prof-lang-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 11px 14px;
  font-size: 14px; font-weight: 500; color: #334155;
  font-family: 'DM Sans', sans-serif;
  background: #fff; cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.prof-lang-btn:hover {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}
.prof-lang-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 100; overflow: hidden;
}
.prof-lang-item {
  display: block; width: 100%; padding: 11px 16px;
  text-align: left; background: none; border: none;
  font-size: 14px; font-weight: 500; color: #334155;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background 0.15s;
}
.prof-lang-item:hover { background: #f1f5f9; }
.prof-lang-item.active { background: #eff6ff; color: #2563eb; font-weight: 700; }

/* ── Accordion ── */
.prof-accordion {
  border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden;
}
.prof-accordion-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: #f8fafc; border: none;
  font-size: 14px; font-weight: 700; color: #0f172a;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background 0.15s;
}
.prof-accordion-btn:hover { background: #f1f5f9; }
.prof-pw-form {
  padding: 22px; border-top: 1.5px solid #e2e8f0;
  background: #fff; display: flex; flex-direction: column; gap: 16px;
}
.prof-pw-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .prof-two-col { grid-template-columns: 1fr; }
  .prof-form-3col { grid-template-columns: 1fr 1fr; }
  .prof-pw-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .prof-root { padding: 20px 16px; }
  .prof-form-grid { grid-template-columns: 1fr; }
  .prof-form-3col { grid-template-columns: 1fr; }
  .prof-hero-body { flex-wrap: wrap; }
  .prof-edit-btn { margin-left: 0; }
  .prof-pw-grid { grid-template-columns: 1fr; }
  .prof-header-title { font-size: 22px; }
}
@media (max-width: 480px) {
  .prof-form-3col { grid-template-columns: 1fr; }
}
`;

export default Profile;