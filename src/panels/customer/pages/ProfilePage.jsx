import { useEffect, useState } from "react";
import customerApi from "../../../shared/api/customerApi";
import useAuth from "../../../shared/hooks/useAuth";

// ─── Icons ───────────────────────────────────────────────────────────────────
function UserIcon({ size = 40, stroke = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={stroke} strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function EditIcon({ stroke = "#475569" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <polyline points="3 6 5 6 21 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
        stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#94a3b8" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function LocationIcon({ stroke = "white" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="3" stroke={stroke} strokeWidth="2" />
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke={stroke} strokeWidth="2" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="13" r="4" stroke="#475569" strokeWidth="2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function KeyIcon({ stroke = "#475569" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="7.5" cy="15.5" r="5.5" stroke={stroke} strokeWidth="2" />
      <path d="M21 2l-9.6 9.6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 7.5l2 2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon({ visible }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="#94a3b8" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 1l22 22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <polyline points="7 10 12 15 17 10" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? "#0ea5e9" : "#e2e8f0",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: 3,
        left: on ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [fields, setFields] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (fields.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (fields.newPassword !== fields.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await customerApi.changePassword({
        currentPassword: fields.currentPassword,
        newPassword: fields.newPassword,
      });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const pwInputStyle = {
    width: "100%",
    padding: "11px 40px 11px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    fontSize: 13.5,
    color: "#0f172a",
    background: "white",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.box} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={modalStyles.headerIcon}>
            <KeyIcon stroke="white" />
          </div>
          <div>
            <div style={modalStyles.title}>Change Password</div>
            <div style={modalStyles.subtitle}>Update your account password</div>
          </div>
          <button style={modalStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div style={modalStyles.successMsg}>✓ Password changed successfully!</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <div style={modalStyles.errorMsg}>{error}</div>}

            {[
              { key: "currentPassword", label: "Current Password" },
              { key: "newPassword",     label: "New Password" },
              { key: "confirmPassword", label: "Confirm New Password" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={modalStyles.label}>{label}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={show[key] ? "text" : "password"}
                    required
                    style={pwInputStyle}
                    value={fields[key]}
                    onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    style={modalStyles.eyeBtn}
                    onClick={() => setShow({ ...show, [key]: !show[key] })}
                  >
                    <EyeIcon visible={show[key]} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" style={modalStyles.cancelBtn} onClick={onClose}>Cancel</button>
              <button type="submit" style={modalStyles.saveBtn} disabled={saving}>
                {saving ? "Saving..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "white",
    borderRadius: 16,
    padding: "28px",
    width: 400,
    maxWidth: "90vw",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  title: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  subtitle: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  closeBtn: {
    marginLeft: "auto", background: "none", border: "none",
    fontSize: 16, color: "#94a3b8", cursor: "pointer", padding: 4,
  },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center",
    padding: 0,
  },
  saveBtn: {
    flex: 1, padding: "10px 0", border: "none", borderRadius: 10,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  cancelBtn: {
    flex: 1, padding: "10px 0", border: "1px solid #e2e8f0", borderRadius: 10,
    background: "white", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  errorMsg: {
    background: "#fff5f5", border: "1px solid #fee2e2",
    color: "#ef4444", borderRadius: 8, padding: "10px 14px", fontSize: 13,
  },
  successMsg: {
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    color: "#16a34a", borderRadius: 8, padding: "14px",
    fontSize: 14, fontWeight: 600, textAlign: "center",
  },
};

// ─── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({ label, isDefault, address, city, phone, onEdit, onDelete, onSetDefault }) {
  return (
    <div style={addrStyles.card}>
      <div style={addrStyles.iconWrap}>
        <LocationIcon stroke="white" />
      </div>
      <div style={addrStyles.info}>
        <div style={addrStyles.labelRow}>
          <span style={addrStyles.label}>{label}</span>
          {isDefault && <span style={addrStyles.defaultBadge}>Default</span>}
        </div>
        <div style={addrStyles.line}>{address}</div>
        <div style={addrStyles.line}>{city}</div>
        <div style={addrStyles.phoneLine}>
          <PhoneIcon /> {phone}
        </div>
      </div>
      <div style={addrStyles.actions}>
        {!isDefault ? (
          <button style={addrStyles.defaultBtn} onClick={onSetDefault}>Set Default</button>
        ) : null}
        <button style={addrStyles.editBtn} onClick={onEdit}><EditIcon /></button>
        <button style={addrStyles.deleteBtn} onClick={onDelete}><TrashIcon /></button>
      </div>
    </div>
  );
}

const addrStyles = {
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "16px 18px",
    border: "1px solid #f1f5f9",
    borderRadius: 12,
    background: "white",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1 },
  labelRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  label: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  defaultBadge: {
    fontSize: 10,
    fontWeight: 700,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    padding: "2px 8px",
    borderRadius: 20,
  },
  line: { fontSize: 13, color: "#64748b", lineHeight: 1.6 },
  phoneLine: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  actions: { display: "flex", gap: 6, alignItems: "center" },
  defaultBtn: {
    border: "1px solid #bae6fd",
    borderRadius: 999,
    background: "#f0f9ff",
    color: "#0369a1",
    fontSize: 11,
    fontWeight: 700,
    padding: "6px 10px",
    cursor: "pointer",
  },
  editBtn: {
    width: 32,
    height: 32,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  deleteBtn: {
    width: 32,
    height: 32,
    border: "1px solid #fee2e2",
    borderRadius: 8,
    background: "#fff5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const INITIAL_PREFS = {
  emailNotifications: true,
  smsNotifications: true,
  orderUpdates: true,
  promotionalOffers: false,
};

const EMPTY_ADDRESS_FORM = {
  label: "",
  address: "",
  city: "",
  phone: "",
};

function normalizeProfile(payload) {
  const source = payload?.data?.user || payload?.data || payload?.user || payload || {};

  return {
    id: source.id || source._id || "",
    fullName: source.fullName || source.name || "",
    email: source.email || "",
    phone: source.phone || source.phoneNumber || "",
    addresses: Array.isArray(source.addresses) ? source.addresses : [],
  };
}

function normalizeAddress(address, index = 0) {
  return {
    id: address?.id || address?._id || address?.addrId || `address-${index}`,
    label: address?.label || address?.name || `Address ${index + 1}`,
    isDefault: Boolean(address?.isDefault ?? address?.default),
    address: address?.address || address?.street || address?.line1 || "",
    city: address?.city || address?.area || address?.cityState || "",
    phone: address?.phone || address?.phoneNumber || "",
  };
}

function buildProfileForm(profile, fallbackUser) {
  return {
    name: profile.fullName || fallbackUser?.fullName || fallbackUser?.name || "",
    email: profile.email || fallbackUser?.email || "",
    phone: profile.phone || fallbackUser?.phone || fallbackUser?.phoneNumber || "",
  };
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(buildProfileForm({}, user));
  const [draft, setDraft] = useState(buildProfileForm({}, user));
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [addresses, setAddresses] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressDraft, setAddressDraft] = useState(EMPTY_ADDRESS_FORM);
  const [summaryStats, setSummaryStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setErrorMessage("");

      try {
        const response = await customerApi.getProfile();
        const profile = normalizeProfile(response);
        const nextForm = buildProfileForm(profile, user);
        const nextAddresses = profile.addresses.map(normalizeAddress);

        if (!isMounted) return;

        setForm(nextForm);
        setDraft(nextForm);
        setAddresses(nextAddresses);
        setProfile(response?.data|| {});
        if (profile.fullName || profile.email || profile.phone) {
          updateUser({
            fullName: profile.fullName || nextForm.name,
            name: profile.fullName || nextForm.name,
            email: profile.email || nextForm.email,
            phone: profile.phone || nextForm.phone,
            addresses: profile.addresses,
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error?.response?.data?.message || "Failed to load profile.");
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    customerApi.getDashboardStats()
      .then(res => {
        const d = res.data;
        console.log("Dashboard stats:", d);
        setSummaryStats(d);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const resetAddressEditor = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressDraft(EMPTY_ADDRESS_FORM);
  };

  const handleSave = async () => {
    setSavingProfile(true);
    setErrorMessage("");

    try {
      await customerApi.updateProfile({
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
      });

      setForm({ ...draft });
      updateUser({
        fullName: draft.name,
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
      });
      setEditing(false);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancel = () => {
    setDraft({ ...form });
    setEditing(false);
  };

  const handleAddAddressClick = () => {
    setEditingAddressId(null);
    setAddressDraft(EMPTY_ADDRESS_FORM);
    setShowAddressForm(true);
  };

  const handleEditAddressClick = (address) => {
    setEditingAddressId(address.id);
    setAddressDraft({
      label: address.label,
      address: address.address,
      city: address.city,
      phone: address.phone,
    });
    setShowAddressForm(true);
  };

  const handleAddressInputChange = (field, value) => {
    setAddressDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSubmit = async () => {
    if (!addressDraft.label || !addressDraft.address || !addressDraft.city || !addressDraft.phone) {
      setErrorMessage("Please complete all address fields.");
      return;
    }

    setAddressSaving(true);
    setErrorMessage("");

    try {
      const payload = {
        label: addressDraft.label,
        address: addressDraft.address,
        city: addressDraft.city,
        phone: addressDraft.phone,
      };

      if (editingAddressId) {
        await customerApi.updateAddress(editingAddressId, payload);
        setAddresses((prev) =>
          prev.map((address) =>
            address.id === editingAddressId ? { ...address, ...payload } : address
          )
        );
      } else {
        const response = await customerApi.addAddress(payload);
        const createdAddress = normalizeAddress(
          response?.data?.address || response?.address || response?.data || payload,
          addresses.length
        );
        setAddresses((prev) => [...prev, createdAddress]);
      }

      resetAddressEditor();
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to save address.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    setAddressSaving(true);
    setErrorMessage("");

    try {
      await customerApi.deleteAddress(id);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to delete address.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    setAddressSaving(true);
    setErrorMessage("");

    try {
      await customerApi.setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((address) => ({ ...address, isDefault: address.id === id }))
      );
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to update default address.");
    } finally {
      setAddressSaving(false);
    }
  };

  const inputStyle = (disabled) => ({
    width: "100%",
    padding: "11px 14px 11px 38px",
    border: `1px solid ${disabled ? "#f1f5f9" : "#cbd5e1"}`,
    borderRadius: 10,
    fontSize: 13.5,
    color: disabled ? "#64748b" : "#0f172a",
    background: disabled ? "#f8fafc" : "white",
    outline: "none",
    boxSizing: "border-box",
  });

  return (
    <div style={styles.page}>
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
      <div style={styles.pageTitle}>Profile</div>
      <div style={styles.pageSubtitle}>Manage your account information and preferences</div>

      {errorMessage ? <div style={styles.messageError}>{errorMessage}</div> : null}

      {profileLoading ? <div style={styles.messageInfo}>Loading your profile...</div> : null}

      <div style={styles.layout}>
        {/* ── Left Column ── */}
        <div style={styles.leftCol}>

          {/* Personal Information */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTitle}>Personal Information</div>
                <div style={styles.cardSubtitle}>Update your personal details</div>
              </div>
              {!editing ? (
                <button style={styles.editProfileBtn} onClick={() => setEditing(true)}>
                  <EditIcon stroke="#475569" /> Edit Profile
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                  <button style={styles.saveBtn} onClick={handleSave} disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}><PersonIcon /></span>
                <input
                  style={inputStyle(!editing)}
                  disabled={!editing}
                  value={editing ? draft.name : form.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}><MailIcon /></span>
                <input
                  style={inputStyle(!editing)}
                  disabled={!editing}
                  value={editing ? draft.email : form.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}><PhoneIcon /></span>
                <input
                  style={inputStyle(!editing)}
                  disabled={!editing}
                  value={editing ? draft.phone : form.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTitle}>Saved Addresses</div>
                <div style={styles.cardSubtitle}>Manage your delivery locations</div>
              </div>
              <button style={styles.addAddressBtn} onClick={handleAddAddressClick}>
                <PlusIcon /> Add Address
              </button>
            </div>

            {showAddressForm ? (
              <div style={styles.addressEditorCard}>
                <div style={styles.addressEditorTitle}>
                  {editingAddressId ? "Edit Address" : "Add Address"}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Label</label>
                  <input
                    style={styles.addressInput}
                    value={addressDraft.label}
                    onChange={(e) => handleAddressInputChange("label", e.target.value)}
                    placeholder="Home"
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Address</label>
                  <input
                    style={styles.addressInput}
                    value={addressDraft.address}
                    onChange={(e) => handleAddressInputChange("address", e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div style={styles.addressGrid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>City</label>
                    <input
                      style={styles.addressInput}
                      value={addressDraft.city}
                      onChange={(e) => handleAddressInputChange("city", e.target.value)}
                      placeholder="New York, NY"
                    />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Phone</label>
                    <input
                      style={styles.addressInput}
                      value={addressDraft.phone}
                      onChange={(e) => handleAddressInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div style={styles.addressEditorActions}>
                  <button style={styles.cancelBtn} onClick={resetAddressEditor}>Cancel</button>
                  <button style={styles.saveBtn} onClick={handleAddressSubmit} disabled={addressSaving}>
                    {addressSaving ? "Saving..." : editingAddressId ? "Update Address" : "Add Address"}
                  </button>
                </div>
              </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  {...addr}
                  onEdit={() => handleEditAddressClick(addr)}
                  onDelete={() => handleDeleteAddress(addr.id)}
                  onSetDefault={() => handleSetDefaultAddress(addr.id)}
                />
              ))}

              {!addresses.length ? (
                <div style={styles.emptyState}>No saved addresses yet.</div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div style={styles.rightCol}>

          {/* Avatar Card */}
          <div style={{ ...styles.card, alignItems: "center", textAlign: "center" }}>
            <div style={styles.avatarCircle}>
              <UserIcon size={52} stroke="white" />
            </div>
            <div style={styles.profileName}>{form.name}</div>
            <div style={styles.profileRole}>Premium Customer</div>
            <div style={styles.memberBadge}>Member since {new Date(profile?.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" })}</div>
            <button style={styles.changePhotoBtn}>
              <CameraIcon /> Change Photo
            </button>
          </div>

          {/* Account Stats */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Account Stats</div>
            <div style={styles.statsList}>
              {[
                { label: "Total Orders",        value: summaryStats?.totalOrders?.value || 0,     color: "#0f172a" },
                { label: "Total Spent",         value: `PKR ${summaryStats?.totalSpent?.toFixed(2) || "0.00"}`,   color: "#0f172a" },
                { label: "Active Subscriptions",value: "-",      color: "#0f172a" },
                { label: "Loyalty Points",      value: "-",  color: "#a855f7" },
              ].map((s) => (
                <div key={s.label} style={styles.statRow}>
                  <span style={styles.statLabel}>{s.label}</span>
                  <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Preferences</div>
            <div style={styles.prefsList}>
              {[
                { key: "emailNotifications", label: "Email Notifications" },
                { key: "smsNotifications",   label: "SMS Notifications" },
                { key: "orderUpdates",       label: "Order Updates" },
                { key: "promotionalOffers",  label: "Promotional Offers" },
              ].map(({ key, label }) => (
                <div key={key} style={styles.prefRow}>
                  <span style={styles.prefLabel}>{label}</span>
                  <Toggle
                    on={prefs[key]}
                    onChange={(val) => setPrefs({ ...prefs, [key]: val })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Account Actions</div>
            <div style={styles.actionsList}>
              <button style={styles.actionBtn} onClick={() => setShowPasswordModal(true)}>
                <KeyIcon /> Change Password
              </button>
              <button style={styles.actionBtn}>
                <DownloadIcon /> Download Data
              </button>
              <button style={{ ...styles.actionBtn, ...styles.deleteBtn }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: { flex: 1, overflowY: "auto", padding: "24px 28px" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
  pageSubtitle: { fontSize: 13, color: "#94a3b8", marginTop: 2, marginBottom: 22 },

  layout: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: { display: "flex", flexDirection: "column", gap: 16 },

  card: {
    background: "white",
    borderRadius: 14,
    padding: "22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  cardSubtitle: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  editProfileBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    background: "white",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "7px 16px",
    border: "none",
    borderRadius: 9,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "7px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    background: "white",
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
  },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },

  addAddressBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    border: "none",
    borderRadius: 9,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  // Avatar
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#a855f7,#7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  profileName: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  profileRole: { fontSize: 13, color: "#94a3b8", marginTop: 2 },
  memberBadge: {
    fontSize: 11,
    fontWeight: 700,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    padding: "4px 12px",
    borderRadius: 20,
    marginTop: 10,
    display: "inline-block",
  },
  changePhotoBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    marginTop: 14,
    padding: "9px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "white",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
  },

  // Stats
  statsList: { display: "flex", flexDirection: "column", gap: 0, marginTop: 14 },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f8fafc",
  },
  statLabel: { fontSize: 13, color: "#64748b" },
  statValue: { fontSize: 15, fontWeight: 700 },

  // Preferences
  prefsList: { display: "flex", flexDirection: "column", gap: 0, marginTop: 14 },
  prefRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f8fafc",
  },
  prefLabel: { fontSize: 13, color: "#374151" },

  // Account Actions
  actionsList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 14 },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "white",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
    textAlign: "left",
  },
  deleteBtn: {
    border: "1px solid #fee2e2",
    color: "#ef4444",
    background: "#fff5f5",
    justifyContent: "center",
  },
};
