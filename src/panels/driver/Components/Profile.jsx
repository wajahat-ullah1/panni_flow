import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: 'Ahmed Ali Khan',
    phone: '+92 300 1234567',
    email: 'ahmed.ali@panniflow.com',
    address: 'Gulshan-e-Iqbal, Karachi',
  });

  const [toggles, setToggles] = useState({
    onlineStatus: true,
    autoAccept: false,
    deliveryUpdates: true,
    routeChanges: true,
    paymentNotifications: true,
    systemAlerts: false,
  });

  const [language, setLanguage] = useState('English');
  const languages = ['English', 'Urdu', 'Pashto'];

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const handleToggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => setEditMode(false);

  return (
    <div className="prof-container">

      {/* ── Page Header ── */}
      <div className="prof-page-header">
        <h1 className="prof-title">Driver Profile</h1>
        <p className="prof-subtitle">Manage your account and preferences</p>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="prof-card prof-hero">
        <div className="prof-avatar-wrap">
          <div className="prof-avatar">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="white"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/>
            </svg>
          </div>
          <div className="prof-camera-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="prof-hero-info">
          <h2 className="prof-hero-name">Ahmed Ali Khan</h2>
          <p className="prof-hero-id">Driver ID: DRV-2024-0156</p>
          <div className="prof-hero-meta">
            <span className="prof-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Joined: March 2024
            </span>
            <span className="prof-online-dot" />
            <span className="prof-online-label">Online</span>
          </div>
        </div>

        <button
          className="prof-edit-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* ── Personal Information ── */}
      <div className="prof-card">
        <div className="prof-section-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#374151" strokeWidth="2"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3 className="prof-section-title">Personal Information</h3>
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
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="prof-field">
            <label className="prof-label">Address</label>
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
            <button className="prof-save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        )}
      </div>

      {/* ── Vehicle Information ── */}
      <div className="prof-card">
        <div className="prof-section-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="9" width="22" height="11" rx="2" stroke="#374151" strokeWidth="2"/>
            <path d="M1 13h22M6 13V9l3-5h6l3 5v4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="20" r="2" fill="#374151"/>
            <circle cx="17" cy="20" r="2" fill="#374151"/>
          </svg>
          <h3 className="prof-section-title">Vehicle Information</h3>
        </div>

        <div className="prof-form-grid prof-form-3col">
          <div className="prof-field">
            <label className="prof-label">Vehicle Type</label>
            <input className="prof-input" value="Water Tanker Truck" disabled />
          </div>
          <div className="prof-field">
            <label className="prof-label">Vehicle Number</label>
            <input className="prof-input" value="KHI-2024-1234" disabled />
          </div>
          <div className="prof-field">
            <label className="prof-label">Tank Capacity</label>
            <input className="prof-input" value="10,000 Liters" disabled />
          </div>
        </div>
      </div>

      {/* ── Availability Settings ── */}
      <div className="prof-card">
        <h3 className="prof-section-title" style={{ marginBottom: '18px' }}>
          Availability Settings
        </h3>

        <div className="prof-toggle-row">
          <div>
            <p className="prof-toggle-title">Online Status</p>
            <p className="prof-toggle-sub">Make yourself available for deliveries</p>
          </div>
          <button
            className={`prof-toggle ${toggles.onlineStatus ? 'on' : ''}`}
            onClick={() => handleToggle('onlineStatus')}
            aria-label="Toggle Online Status"
          >
            <span className="prof-toggle-knob" />
          </button>
        </div>

        <div className="prof-toggle-row">
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

      {/* ── Preferences ── */}
      <div className="prof-card">
        <h3 className="prof-section-title" style={{ marginBottom: '18px' }}>
          Preferences
        </h3>

        <div className="prof-section-header" style={{ marginBottom: '10px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
              stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <label className="prof-label" style={{ margin: 0 }}>Language</label>
        </div>

        <div className="prof-lang-wrap">
          <button
            className="prof-lang-btn"
            onClick={() => setLangOpen(!langOpen)}
          >
            <span>{language}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#64748b"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* ── Notification Preferences ── */}
      <div className="prof-card">
        <div className="prof-section-header" style={{ marginBottom: '18px' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="prof-section-title">Notification Preferences</h3>
        </div>

        {[
          { key: 'deliveryUpdates', title: 'Delivery Updates', sub: 'Get notified about new delivery assignments' },
          { key: 'routeChanges', title: 'Route Changes', sub: 'Alerts when route is optimized or changed' },
          { key: 'paymentNotifications', title: 'Payment Notifications', sub: 'Updates about earnings and payments' },
          { key: 'systemAlerts', title: 'System Alerts', sub: 'Important system messages and updates' },
        ].map(({ key, title, sub }) => (
          <div className="prof-toggle-row" key={key}>
            <div>
              <p className="prof-toggle-title">{title}</p>
              <p className="prof-toggle-sub">{sub}</p>
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

      {/* ── Security ── */}
      <div className="prof-card">
        <div className="prof-section-header" style={{ marginBottom: '18px' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="#374151" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <h3 className="prof-section-title">Security</h3>
        </div>

        <div className="prof-accordion">
          <button
            className="prof-accordion-btn"
            onClick={() => setPwOpen(!pwOpen)}
          >
            <span>Change Password</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              style={{ transform: pwOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            >
              <path d="M6 9l6 6 6-6" stroke="#64748b"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {pwOpen && (
            <div className="prof-pw-form">
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
              <button className="prof-save-btn" style={{ marginTop: '8px' }}>
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
