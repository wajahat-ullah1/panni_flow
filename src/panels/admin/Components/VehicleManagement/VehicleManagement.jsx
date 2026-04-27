/**
 * VehicleManagement.jsx — Panni Flow Admin Panel
 *
 * Register, edit and delete fleet vehicles.
 * Follows the same design pattern as AddDriver.
 */

import React, { useState, useEffect } from 'react';
import {
  Truck,
  PlusCircle,
  Wrench,
  Archive,
  AlertCircle,
  CheckCircle,
  X,
  Pencil,
} from 'lucide-react';
import adminApi from '../../../../shared/api/adminApi';
import './VehicleManagement.css';

// ── Status styles ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  active:      { bg: '#E8F5E9', color: '#2E7D32' },
  maintenance: { bg: '#FFF8E1', color: '#F57F17' },
  retired:     { bg: '#FAFAFA', color: '#757575' },
};

const VEHICLE_TYPES  = ['bike', 'auto', 'van', 'truck', 'tempo'];
const STATUSES       = ['active', 'maintenance', 'retired'];
const TYPE_FILTERS   = ['All', ...VEHICLE_TYPES];

// ── Normalise API Vehicle → table row ─────────────────────────────────────────
const toRow = (v) => ({
  id:              v._id,
  regNo:           v.registrationNumber,
  type:            v.type,
  make:            v.make            ?? '—',
  model:           v.model           ?? '—',
  year:            v.year            ?? '—',
  capacity:        v.capacity        ?? 0,
  capacityUnit:    v.capacityUnit    ?? 'liters',
  status:          v.status          ?? 'active',
  fuelType:        v.fuelType        ?? '—',
  insuranceNumber: v.insuranceNumber ?? '',
  insuranceExpiry: v.insuranceExpiry ? v.insuranceExpiry.slice(0, 10) : '',
  notes:           v.notes           ?? '',
  joined:          v.createdAt       ? v.createdAt.slice(0, 10) : '—',
});

const BLANK_FORM = {
  regNo: '', type: '', make: '', model: '',
  year: '', capacity: '', fuelType: '', insuranceNumber: '', insuranceExpiry: '',
};

const BLANK_EDIT = {
  make: '', model: '', status: 'active', capacity: '',
  fuelType: '', insuranceNumber: '', insuranceExpiry: '', notes: '',
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, icon: Icon, color, bgColor }) => (
  <div className="vm-stat-card">
    <div className="vm-stat-left">
      <p className="vm-stat-title">{title}</p>
      <h2 className="vm-stat-value">{value}</h2>
      <p className="vm-stat-sub" style={{ color }}>{sub}</p>
    </div>
    <div className="vm-stat-icon" style={{ backgroundColor: bgColor }}>
      <Icon size={26} color={color} />
    </div>
  </div>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="vm-field">
    <label className="vm-label">{label}</label>
    {children}
    {error && (
      <span className="vm-field-error">
        <AlertCircle size={12} /> {error}
      </span>
    )}
  </div>
);

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Main Component ────────────────────────────────────────────────────────────
const VehicleManagement = () => {
  const [vehicles, setVehicles]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // vehicle id
  const [editVehicle, setEditVehicle]   = useState(null);   // row | null
  const [editForm, setEditForm]         = useState(BLANK_EDIT);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editErrors, setEditErrors]     = useState({});
  const [search, setSearch]             = useState('');
  const [typeFilter, setTypeFilter]     = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm]                 = useState(BLANK_FORM);
  const [errors, setErrors]             = useState({});

  // ── Load ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await adminApi.getVehicles({ all: true });
        if (cancelled) return;
        const data = res.data?.data ?? res.data ?? [];
        setVehicles(data.map(toRow));
      } catch {
        if (!cancelled) showToast('error', 'Failed to load vehicles. Please refresh.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: null }));
  };
  const setEdit = (field) => (e) => {
    setEditForm(f => ({ ...f, [field]: e.target.value }));
    if (editErrors[field]) setEditErrors(er => ({ ...er, [field]: null }));
  };
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e = {};
    if (!form.regNo.trim()) e.regNo = 'Registration number is required';
    if (!form.type)         e.type  = 'Select a vehicle type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Add ───────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        registrationNumber: form.regNo,
        type:               form.type,
        ...(form.make              && { make:            form.make }),
        ...(form.model             && { model:           form.model }),
        ...(form.year              && { year:            Number(form.year) }),
        ...(form.capacity          && { capacity:        Number(form.capacity) }),
        ...(form.fuelType          && { fuelType:        form.fuelType }),
        ...(form.insuranceNumber   && { insuranceNumber: form.insuranceNumber }),
        ...(form.insuranceExpiry   && { insuranceExpiry: form.insuranceExpiry }),
      };
      const res = await adminApi.createVehicle(payload);
      const newRow = toRow(res.data);
      setVehicles(v => [newRow, ...v]);
      setForm(BLANK_FORM);
      showToast('success', `Vehicle "${newRow.regNo}" registered successfully.`);
    } catch (err) {
      const msg = err.response?.status === 409
        ? 'Registration number already exists.'
        : err.response?.data?.message ?? 'Failed to register vehicle.';
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────────
  const openEdit = (row) => {
    setEditVehicle(row);
    setEditForm({
      make:            row.make    === '—' ? '' : row.make,
      model:           row.model   === '—' ? '' : row.model,
      status:          row.status,
      capacity:        row.capacity === 0  ? '' : String(row.capacity),
      fuelType:        row.fuelType === '—' ? '' : row.fuelType,
      insuranceNumber: row.insuranceNumber,
      insuranceExpiry: row.insuranceExpiry,
      notes:           row.notes,
    });
    setEditErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const payload = {
        status: editForm.status,
        ...(editForm.make            && { make:            editForm.make }),
        ...(editForm.model           && { model:           editForm.model }),
        ...(editForm.capacity        && { capacity:        Number(editForm.capacity) }),
        ...(editForm.fuelType        && { fuelType:        editForm.fuelType }),
        ...(editForm.insuranceNumber && { insuranceNumber: editForm.insuranceNumber }),
        ...(editForm.insuranceExpiry && { insuranceExpiry: editForm.insuranceExpiry }),
        ...(editForm.notes           && { notes:           editForm.notes }),
      };
      const res = await adminApi.updateVehicle(editVehicle.id, payload);
      const updated = toRow(res.data);
      setVehicles(v => v.map(r => r.id === updated.id ? updated : r));
      setEditVehicle(null);
      showToast('success', `Vehicle "${updated.regNo}" updated.`);
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'Failed to update vehicle.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleteConfirm(null);
    try {
      await adminApi.deleteVehicle(id);
      setVehicles(v => v.filter(r => r.id !== id));
      showToast('success', 'Vehicle removed.');
    } catch {
      showToast('error', 'Failed to remove vehicle. Please try again.');
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const total       = vehicles.length;
  const active      = vehicles.filter(v => v.status === 'active').length;
  const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
  const retired     = vehicles.filter(v => v.status === 'retired').length;

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      v.regNo.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q);
    const matchType   = typeFilter   === 'All' || v.type   === typeFilter;
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="vm-page">

      {/* Toast */}
      {toast && (
        <div className={`vm-toast vm-toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
          <button className="vm-toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="vm-modal-backdrop">
          <div className="vm-modal">
            <div className="vm-modal-icon">
              <AlertCircle size={32} color="#EF5350" />
            </div>
            <h3 className="vm-modal-title">Remove Vehicle</h3>
            <p className="vm-modal-sub">
              This will permanently delete the vehicle record. This action cannot be undone.
            </p>
            <div className="vm-modal-actions">
              <button className="vm-modal-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="vm-modal-confirm" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editVehicle && (
        <div className="vm-modal-backdrop">
          <div className="vm-modal vm-edit-modal">
            <div className="vm-modal-header">
              <div>
                <h3 className="vm-modal-title vm-modal-title-left">Edit Vehicle</h3>
                <p className="vm-modal-sub vm-modal-sub-left">
                  {editVehicle.regNo} · {capitalize(editVehicle.type)}
                </p>
              </div>
              <button className="vm-modal-x" onClick={() => setEditVehicle(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="vm-form-grid">
                <Field label="Make" error={editErrors.make}>
                  <input
                    className="vm-input"
                    placeholder="e.g. Toyota"
                    value={editForm.make}
                    onChange={setEdit('make')}
                  />
                </Field>
                <Field label="Model" error={editErrors.model}>
                  <input
                    className="vm-input"
                    placeholder="e.g. Hilux"
                    value={editForm.model}
                    onChange={setEdit('model')}
                  />
                </Field>
                <Field label="Status *" error={editErrors.status}>
                  <select className="vm-select" value={editForm.status} onChange={setEdit('status')}>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{capitalize(s)}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Capacity (liters)" error={editErrors.capacity}>
                  <input
                    className="vm-input"
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    value={editForm.capacity}
                    onChange={setEdit('capacity')}
                  />
                </Field>
                <Field label="Fuel Type" error={editErrors.fuelType}>
                  <input
                    className="vm-input"
                    placeholder="e.g. diesel"
                    value={editForm.fuelType}
                    onChange={setEdit('fuelType')}
                  />
                </Field>
                <Field label="Insurance No." error={editErrors.insuranceNumber}>
                  <input
                    className="vm-input"
                    placeholder="Insurance number"
                    value={editForm.insuranceNumber}
                    onChange={setEdit('insuranceNumber')}
                  />
                </Field>
                <Field label="Insurance Expiry" error={editErrors.insuranceExpiry}>
                  <input
                    className="vm-input"
                    type="date"
                    value={editForm.insuranceExpiry}
                    onChange={setEdit('insuranceExpiry')}
                  />
                </Field>
                <Field label="Notes" error={editErrors.notes}>
                  <input
                    className="vm-input"
                    placeholder="Optional notes"
                    value={editForm.notes}
                    onChange={setEdit('notes')}
                  />
                </Field>
              </div>
              <div className="vm-edit-modal-actions">
                <button type="button" className="vm-modal-cancel" onClick={() => setEditVehicle(null)}>
                  Cancel
                </button>
                <button type="submit" className="vm-submit-btn vm-submit-btn-sm" disabled={editSubmitting}>
                  {editSubmitting ? <><span className="vm-spinner" /> Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="vm-page-header">
        <div>
          <h1 className="vm-page-title">Vehicle Management</h1>
          <p className="vm-page-sub">Register and manage the Panni Flow tanker fleet.</p>
        </div>
        <div className="vm-header-badge">
          <span className="vm-live-dot" />
          {total} Vehicles Registered
        </div>
      </div>

      <div className="vm-content">

        {/* Stats */}
        <div className="vm-stats-row">
          <StatCard title="Total Vehicles" value={total}       sub="Registered"     icon={Truck}   color="#00A8E8" bgColor="#E3F2FD" />
          <StatCard title="Active"         value={active}      sub="In service"     icon={Truck}   color="#4CAF50" bgColor="#E8F5E9" />
          <StatCard title="Maintenance"    value={maintenance} sub="Being serviced" icon={Wrench}  color="#FF9800" bgColor="#FFF3E0" />
          <StatCard title="Retired"        value={retired}     sub="Out of service" icon={Archive} color="#9E9E9E" bgColor="#F5F5F5" />
        </div>

        <div className="vm-body">

          {/* ── Register Vehicle Form ── */}
          <div className="vm-form-card">
            <div className="vm-card-header">
              <PlusCircle size={20} color="#00A8E8" />
              <div>
                <h3 className="vm-card-title">Register Vehicle</h3>
                <p className="vm-card-sub">Add a new vehicle to the fleet</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="vm-form" noValidate>
              <div className="vm-form-grid">
                <Field label="Registration No. *" error={errors.regNo}>
                  <input
                    className={`vm-input ${errors.regNo ? 'vm-input-err' : ''}`}
                    placeholder="e.g. LHR-TK-2024"
                    value={form.regNo}
                    onChange={set('regNo')}
                  />
                </Field>

                <Field label="Type *" error={errors.type}>
                  <select
                    className={`vm-select ${errors.type ? 'vm-input-err' : ''}`}
                    value={form.type}
                    onChange={set('type')}>
                    <option value="">Select type</option>
                    {VEHICLE_TYPES.map(t => (
                      <option key={t} value={t}>{capitalize(t)}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Make" error={errors.make}>
                  <input className="vm-input" placeholder="e.g. Toyota" value={form.make} onChange={set('make')} />
                </Field>

                <Field label="Model" error={errors.model}>
                  <input className="vm-input" placeholder="e.g. Hilux" value={form.model} onChange={set('model')} />
                </Field>

                <Field label="Year" error={errors.year}>
                  <input
                    className="vm-input"
                    type="number"
                    placeholder="e.g. 2022"
                    value={form.year}
                    onChange={set('year')}
                  />
                </Field>

                <Field label="Capacity (liters)" error={errors.capacity}>
                  <input
                    className="vm-input"
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    value={form.capacity}
                    onChange={set('capacity')}
                  />
                </Field>

                <Field label="Fuel Type" error={errors.fuelType}>
                  <input
                    className="vm-input"
                    placeholder="e.g. diesel"
                    value={form.fuelType}
                    onChange={set('fuelType')}
                  />
                </Field>

                <Field label="Insurance No." error={errors.insuranceNumber}>
                  <input
                    className="vm-input"
                    placeholder="Optional"
                    value={form.insuranceNumber}
                    onChange={set('insuranceNumber')}
                  />
                </Field>

                <Field label="Insurance Expiry" error={errors.insuranceExpiry}>
                  <input
                    className="vm-input"
                    type="date"
                    value={form.insuranceExpiry}
                    onChange={set('insuranceExpiry')}
                  />
                </Field>
              </div>

              <button type="submit" className="vm-submit-btn" disabled={submitting}>
                {submitting
                  ? <><span className="vm-spinner" /> Registering…</>
                  : <><PlusCircle size={16} /> Register Vehicle</>
                }
              </button>
            </form>
          </div>

          {/* ── Vehicle List ── */}
          <div className="vm-list-card">
            <div className="vm-card-header">
              <Truck size={20} color="#00A8E8" />
              <div>
                <h3 className="vm-card-title">Fleet Vehicles</h3>
                <p className="vm-card-sub">{filtered.length} of {total} shown</p>
              </div>
            </div>

            <div className="vm-list-controls">
              <input
                className="vm-search"
                placeholder="Search by reg. no., make, model…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="vm-filter-select"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}>
                {TYPE_FILTERS.map(t => (
                  <option key={t} value={t}>{t === 'All' ? 'All Types' : capitalize(t)}</option>
                ))}
              </select>
              <select
                className="vm-filter-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}>
                {['All', ...STATUSES].map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'All Status' : capitalize(s)}</option>
                ))}
              </select>
            </div>

            <div className="vm-table-wrap">
              <table className="vm-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Fuel</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="vm-empty">Loading vehicles…</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="vm-empty">No vehicles found.</td>
                    </tr>
                  ) : filtered.map(v => {
                    const ss = STATUS_STYLE[v.status] ?? STATUS_STYLE.active;
                    const makeModel = v.make !== '—' && v.model !== '—'
                      ? `${v.make} ${v.model}`
                      : v.make !== '—' ? v.make : '—';
                    return (
                      <tr key={v.id} className="vm-table-row">
                        <td>
                          <div className="vm-vehicle-cell">
                            <div className="vm-vehicle-icon">
                              <Truck size={16} color="#00A8E8" />
                            </div>
                            <div>
                              <p className="vm-vehicle-reg">{v.regNo}</p>
                              <p className="vm-vehicle-sub">{makeModel}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="vm-type-badge">{v.type}</span>
                        </td>
                        <td className="vm-td-sub">
                          {v.capacity > 0 ? `${v.capacity} ${v.capacityUnit}` : '—'}
                        </td>
                        <td className="vm-td-sub">{v.fuelType}</td>
                        <td>
                          <span
                            className="vm-status-badge"
                            style={{ backgroundColor: ss.bg, color: ss.color }}>
                            {capitalize(v.status)}
                          </span>
                        </td>
                        <td className="vm-td-sub">{v.joined}</td>
                        <td>
                          <div className="vm-action-btns">
                            <button
                              className="vm-edit-btn"
                              onClick={() => openEdit(v)}
                              title="Edit vehicle">
                              <Pencil size={13} />
                            </button>
                            <button
                              className="vm-delete-btn"
                              onClick={() => setDeleteConfirm(v.id)}
                              title="Remove vehicle">
                              <X size={13} />
                            </button>
                          </div>
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

export default VehicleManagement;
