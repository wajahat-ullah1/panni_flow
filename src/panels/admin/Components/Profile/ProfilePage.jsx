import { useEffect, useState } from "react";
import customerApi from "../../../../shared/api/customerApi";
import useAuth from "../../../../shared/hooks/useAuth";

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
function KeyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="7.5" cy="15.5" r="5.5" stroke="#475569" strokeWidth="2" />
      <path d="M21 2l-9.6 9.6" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 7.5l2 2" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
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



// ─── Main Page ────────────────────────────────────────────────────────────────
const INITIAL_PREFS = {
  emailNotifications: true,
  smsNotifications: true,
  orderUpdates: true,
  promotionalOffers: false,
};

function normalizeProfile(payload) {
  const source = payload?.data?.user || payload?.data || payload?.user || payload || {};

  return {
    id: source.id || source._id || "",
    fullName: source.fullName || source.name || "",
    email: source.email || "",
    companyName: source.companyName || source.company || "",
    address: source.address || "",
  };
}

function buildProfileForm(profile, fallbackUser) {
  return {
    name: profile.fullName || fallbackUser?.fullName || fallbackUser?.name || "",
    email: profile.email || fallbackUser?.email || "",
    companyName: profile.companyName || fallbackUser?.companyName || fallbackUser?.company || "",
    address: profile.address || fallbackUser?.address || "",
  };
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(buildProfileForm({}, user));
  const [draft, setDraft] = useState(buildProfileForm({}, user));
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setErrorMessage("");

      try {
        const response = await customerApi.getProfile();
        const profile = normalizeProfile(response);
        const nextForm = buildProfileForm(profile, user);

        if (!isMounted) return;

        setForm(nextForm);
        setDraft(nextForm);
        setProfile(response?.data|| {});
        if (profile.fullName || profile.email || profile.companyName || profile.address) {
          updateUser({
            fullName: profile.fullName || nextForm.name,
            name: profile.fullName || nextForm.name,
            email: profile.email || nextForm.email,
            companyName: profile.companyName || nextForm.companyName,
            address: profile.address || nextForm.address,
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

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSavingProfile(true);
    setErrorMessage("");

    try {
      await customerApi.updateProfile({
        fullName: draft.name,
        email: draft.email,
        companyName: draft.companyName,
        address: draft.address,
      });

      setForm({ ...draft });
      updateUser({
        fullName: draft.name,
        name: draft.name,
        email: draft.email,
        companyName: draft.companyName,
        address: draft.address,
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

            {/* Company Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Company Name</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}><PersonIcon /></span>
                <input
                  style={inputStyle(!editing)}
                  disabled={!editing}
                  value={editing ? draft.companyName : form.companyName}
                  onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Address</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}><LocationIcon stroke="#94a3b8" /></span>
                <input
                  style={inputStyle(!editing)}
                  disabled={!editing}
                  value={editing ? draft.address : form.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                />
              </div>
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
              <button style={styles.actionBtn}>
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
  pageTitle: { fontSize: 32, fontWeight: 700, color: "#1a1a1a" },
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
