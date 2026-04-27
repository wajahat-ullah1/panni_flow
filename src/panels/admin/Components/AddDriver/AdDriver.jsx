/**
 * AddDriver.jsx — Panni Flow Admin Panel
 *
 * Allows admins to create driver accounts.
 * Matches the existing admin panel theme:
 *   - Same card style as AdminDashboard
 *   - Same stat card pattern for the summary strip
 *   - Same color palette (#00A8E8 primary, white cards, #f8fafc bg)
 *   - Same font: 'DM Sans', 'Segoe UI', sans-serif
 */

import React, {useState, useEffect} from 'react';
import {
  Users,
  UserPlus,
  Truck,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import authApi from '../../../../shared/api/authApi';
import adminApi from '../../../../shared/api/adminApi';
import './AdDriver.css';

// ── API status → UI label ─────────────────────────────────────────────────────
const API_STATUS_TO_UI = {
  available:       'Active',
  'on-delivery':   'Active',
  'temporary-off': 'On Leave',
  inactive:        'Inactive',
  'off-duty':      'Inactive',
};

// ── Map a Driver object from the API to a local table row ─────────────────────
const toRow = (d) => ({
  id:     d.licenseNumber,
  name:   d.name,
  phone:  d.phone,
  zone:   d.assignedAreas?.[0] ?? '—',
  tanker: d.vehicleNumber ?? '—',
  status: API_STATUS_TO_UI[d.status] ?? 'Inactive',
  joined: d.createdAt ? d.createdAt.slice(0, 10) : '—',
});

const ZONES    = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];
const STATUSES = ['Active', 'Inactive', 'On Leave'];

const STATUS_STYLE = {
  Active:    {bg: '#E8F5E9', color: '#2E7D32'},
  Inactive:  {bg: '#FAFAFA', color: '#757575'},
  'On Leave':{bg: '#FFF8E1', color: '#F57F17'},
};

// ── Stat Card (mirrors AdminDashboard stat card pattern) ──────────────────────
const StatCard = ({title, value, sub, icon: Icon, color, bgColor}) => (
  <div className="add-driver-stat-card">
    <div className="ad-stat-left">
      <p className="ad-stat-title">{title}</p>
      <h2 className="ad-stat-value">{value}</h2>
      <p className="ad-stat-sub" style={{color}}>{sub}</p>
    </div>
    <div className="ad-stat-icon" style={{backgroundColor: bgColor}}>
      <Icon size={26} color={color} />
    </div>
  </div>
);

// ── Field component ───────────────────────────────────────────────────────────
const Field = ({label, error, children}) => (
  <div className="ad-field">
    <label className="ad-label">{label}</label>
    {children}
    {error && (
      <span className="ad-field-error">
        <AlertCircle size={12} /> {error}
      </span>
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const AddDriver = () => {
  const [drivers, setDrivers]       = useState([]);
  const [vehicles, setVehicles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast]           = useState(null); // {type: 'success'|'error', msg}
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // driver id
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    zone: '', tanker: '', licenseNo: '', address: '',
  });
  const [errors, setErrors] = useState({});

  // ── Initial data load ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [driversRes, vehiclesRes] = await Promise.all([
          adminApi.getDrivers({ all: true }),
          adminApi.getVehicles({ all: true }),
        ]);
        if (cancelled) return;
        const driverData   = driversRes.data?.data  ?? driversRes.data  ?? [];
        const vehicleData  = vehiclesRes.data?.data ?? vehiclesRes.data ?? [];
        setDrivers(driverData.map(toRow));
        setVehicles(vehicleData);
      } catch {
        if (!cancelled) showToast('error', 'Failed to load drivers. Please refresh.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const set = (field) => (e) => {
    setForm(f => ({...f, [field]: e.target.value}));
    if (errors[field]) setErrors(er => ({...er, [field]: null}));
  };

  const showToast = (type, msg) => {
    setToast({type, msg});
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name       = 'Full name is required';
    if (!form.email.trim())       e.email      = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  e.email      = 'Enter a valid email';
    if (!form.phone.trim())       e.phone      = 'Phone number is required';
    if (!form.password)           e.password   = 'Password is required';
    else if (form.password.length < 8)
                                  e.password   = 'Minimum 8 characters';
    if (!form.zone)               e.zone       = 'Select a zone';
    if (!form.tanker)             e.tanker     = 'Assign a tanker';
    if (!form.licenseNo.trim())   e.licenseNo  = 'License number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await authApi.registerDriver({
        fullName:      form.name,
        email:         form.email,
        phone:         form.phone,
        password:      form.password,
        licenseNumber: form.licenseNo,
        vehicleNumber: form.tanker,
        assignedAreas: form.zone ? [form.zone] : [],
      });
      const newRow = toRow({
        ...res.data.driver,
        // driver-register returns id (not _id) — normalise
        _id: res.data.driver.id ?? res.data.driver._id,
        createdAt: new Date().toISOString(),
      });
      setDrivers(d => [newRow, ...d]);
      setForm({name:'',email:'',phone:'',password:'',zone:'',tanker:'',licenseNo:'',address:''});
      showToast('success', `Driver "${newRow.name}" created successfully.`);
    } catch (err) {
      const msg = err.response?.status === 409
        ? 'Email already registered in this tenant.'
        : err.response?.data?.message ?? 'Failed to create driver. Please try again.';
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteConfirm(null);
    try {
      await adminApi.deleteDriver(id);
      setDrivers(d => d.filter(dr => dr.id !== id));
      showToast('success', 'Driver account removed.');
    } catch {
      showToast('error', 'Failed to remove driver. Please try again.');
    }
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const total    = drivers.length;
  const active   = drivers.filter(d => d.status === 'Active').length;
  const inactive = drivers.filter(d => d.status === 'Inactive').length;
  const onLeave  = drivers.filter(d => d.status === 'On Leave').length;

  // ── Filtered table ───────────────────────────────────────────────────────────
  const filtered = drivers.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.zone.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="add-driver-page">

      {/* Toast */}
      {toast && (
        <div className={`ad-toast ad-toast-${toast.type}`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} />
            : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
          <button className="ad-toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal">
            <div className="ad-modal-icon">
              <AlertCircle size={32} color="#EF5350" />
            </div>
            <h3 className="ad-modal-title">Remove Driver</h3>
            <p className="ad-modal-sub">
              This will permanently delete the driver account. This action cannot be undone.
            </p>
            <div className="ad-modal-actions">
              <button className="ad-modal-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="ad-modal-confirm" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Driver Management</h1>
          <p className="ad-page-sub">Create and manage driver accounts for the Panni Flow fleet.</p>
        </div>
        <div className="ad-header-badge">
          <span className="ad-live-dot" />
          {total} Drivers Registered
        </div>
      </div>

      <div className="ad-content">

        {/* ── Stats Strip ── */}
        <div className="ad-stats-row">
          <StatCard title="Total Drivers"   value={total}    sub="Registered"       icon={Users}     color="#00A8E8" bgColor="#E3F2FD" />
          <StatCard title="Active"          value={active}   sub="On duty"          icon={Truck}     color="#4CAF50" bgColor="#E8F5E9" />
          <StatCard title="Inactive"        value={inactive} sub="Off roster"       icon={UserPlus}  color="#9E9E9E" bgColor="#F5F5F5" />
          <StatCard title="On Leave"        value={onLeave}  sub="Temporarily off"  icon={MapPin}    color="#FF9800" bgColor="#FFF3E0" />
        </div>

        {/* ── Two-column layout: Form + Table ── */}
        <div className="ad-body">

          {/* ── Add Driver Form ── */}
          <div className="ad-form-card">
            <div className="ad-card-header">
              <UserPlus size={20} color="#00A8E8" />
              <div>
                <h3 className="ad-card-title">Add New Driver</h3>
                <p className="ad-card-sub">Fill in the details to create a driver account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="ad-form" noValidate>

              <div className="ad-form-grid">
                <Field label="Full Name *" error={errors.name}>
                  <input
                    className={`ad-input ${errors.name ? 'ad-input-err' : ''}`}
                    placeholder="e.g. Ali Hassan"
                    value={form.name}
                    onChange={set('name')}
                  />
                </Field>

                <Field label="Email Address *" error={errors.email}>
                  <div className="ad-input-icon-wrap">
                    <Mail size={15} className="ad-input-icon" />
                    <input
                      className={`ad-input ad-input-padded ${errors.email ? 'ad-input-err' : ''}`}
                      placeholder="driver@panniflow.com"
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                </Field>

                <Field label="Phone Number *" error={errors.phone}>
                  <div className="ad-input-icon-wrap">
                    <Phone size={15} className="ad-input-icon" />
                    <input
                      className={`ad-input ad-input-padded ${errors.phone ? 'ad-input-err' : ''}`}
                      placeholder="+92 300 0000000"
                      value={form.phone}
                      onChange={set('phone')}
                    />
                  </div>
                </Field>

                <Field label="Password *" error={errors.password}>
                  <div className="ad-input-icon-wrap">
                    <input
                      className={`ad-input ad-input-padded-r ${errors.password ? 'ad-input-err' : ''}`}
                      placeholder="Min. 8 characters"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                    />
                    <button
                      type="button"
                      className="ad-eye-btn"
                      onClick={() => setShowPassword(s => !s)}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </Field>

                <Field label="Assigned Zone *" error={errors.zone}>
                  <select
                    className={`ad-select ${errors.zone ? 'ad-input-err' : ''}`}
                    value={form.zone}
                    onChange={set('zone')}>
                    <option value="">Select zone</option>
                    {ZONES.map(z => <option key={z}>{z}</option>)}
                  </select>
                </Field>

                <Field label="Assign Tanker *" error={errors.tanker}>
                  <select
                    className={`ad-select ${errors.tanker ? 'ad-input-err' : ''}`}
                    value={form.tanker}
                    onChange={set('tanker')}>
                    <option value="">Select tanker</option>
                    {vehicles.map(v => (
                      <option key={v._id} value={v.registrationNumber}>
                        {v.registrationNumber}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="License No. *" error={errors.licenseNo}>
                  <input
                    className={`ad-input ${errors.licenseNo ? 'ad-input-err' : ''}`}
                    placeholder="e.g. LHR-2024-00123"
                    value={form.licenseNo}
                    onChange={set('licenseNo')}
                  />
                </Field>

                <Field label="Home Address" error={errors.address}>
                  <div className="ad-input-icon-wrap">
                    <MapPin size={15} className="ad-input-icon" />
                    <input
                      className="ad-input ad-input-padded"
                      placeholder="Optional"
                      value={form.address}
                      onChange={set('address')}
                    />
                  </div>
                </Field>
              </div>

              <button
                type="submit"
                className="ad-submit-btn"
                disabled={submitting}>
                {submitting
                  ? <><span className="ad-spinner" /> Creating Account…</>
                  : <><UserPlus size={16} /> Create Driver Account</>
                }
              </button>

            </form>
          </div>

          {/* ── Driver List ── */}
          <div className="ad-list-card">
            <div className="ad-card-header">
              <Users size={20} color="#00A8E8" />
              <div>
                <h3 className="ad-card-title">Registered Drivers</h3>
                <p className="ad-card-sub">{filtered.length} of {total} shown</p>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="ad-list-controls">
              <input
                className="ad-search"
                placeholder="Search by name, ID, or zone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="ad-filter-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}>
                <option>All</option>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Zone</th>
                    <th>Tanker</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="ad-empty">Loading drivers…</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ad-empty">No drivers found.</td>
                    </tr>
                  ) : filtered.map(d => {
                    const ss = STATUS_STYLE[d.status] || STATUS_STYLE.Inactive;
                    return (
                      <tr key={d.id} className="ad-table-row">
                        <td>
                          <div className="ad-driver-cell">
                            <div className="ad-avatar">
                              {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="ad-driver-name">{d.name}</p>
                              <p className="ad-driver-id">{d.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="ad-td-sub">{d.zone}</td>
                        <td>
                          <span className="ad-tanker-badge">{d.tanker}</span>
                        </td>
                        <td>
                          <span
                            className="ad-status-badge"
                            style={{backgroundColor: ss.bg, color: ss.color}}>
                            {d.status}
                          </span>
                        </td>
                        <td className="ad-td-sub">{d.joined}</td>
                        <td>
                          <button
                            className="ad-delete-btn"
                            onClick={() => setDeleteConfirm(d.id)}
                            title="Remove driver">
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddDriver;
