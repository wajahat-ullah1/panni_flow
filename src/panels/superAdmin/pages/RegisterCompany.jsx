import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerTenant, uploadTenantLogo, createSubscription, getSubscriptionPlans } from "../../../shared/api/superAdminApi";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  fontSize: 13.5,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  color: "#0f172a",
  background: "#f8fafc",
  transition: "border-color 0.15s, background 0.15s",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 36,
};

function Label({ children, required }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>
      {children}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function SectionCard({ iconBg, icon, title, children }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e8edf3",
      padding: "24px 28px",
      marginBottom: 20,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid #f1f5f9" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function FocusInput({ placeholder, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        borderColor: focused ? "#2563eb" : "#e2e8f0",
        background: focused ? "#fff" : "#f8fafc",
      }}
    />
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px", borderRadius: 10,
        border: `1.5px solid ${checked ? "#2563eb" : "#e2e8f0"}`,
        background: checked ? "#eff6ff" : "#f8fafc",
        cursor: "pointer", transition: "all 0.15s",
        userSelect: "none",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 5,
        background: checked ? "#2563eb" : "#fff",
        border: `2px solid ${checked ? "#2563eb" : "#cbd5e1"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s",
      }}>
        {checked && (
          <svg width="11" height="11" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: checked ? "#1d4ed8" : "#374151" }}>{label}</span>
    </div>
  );
}

function SuccessToast({ onClose }) {
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 200,
      background: "#fff", borderRadius: 12,
      border: "1px solid #bbf7d0",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 14,
      minWidth: 300,
      animation: "slideIn 0.3s ease",
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "#f0fdf4",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>Company Registered!</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>New company has been added successfully.</div>
      </div>
      <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "", slug: "", city: "", address: "",
    adminName: "", adminEmail: "", email: "", password: "",
    plan: "basic", billing: "monthly",
  });
  const [logo, setLogo] = useState(null);         // File object
  const [logoPreview, setLogoPreview] = useState(""); // object URL for <img>
  const [logoName, setLogoName] = useState("");
  const [features, setFeatures] = useState({
    orderManagement: true, liveTracking: true, aiForecasting: false, analytics: true,
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [plans, setPlans] = useState({});

  useEffect(() => {
    getSubscriptionPlans()
      .then((res) => setPlans(res?.data || res || {}))
      .catch(() => {});
  }, []);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  const appBaseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const appLink = form.slug ? `${appBaseUrl}/${form.slug}` : "";

  const handleCopyLink = () => {
    if (!appLink) return;
    navigator.clipboard.writeText(appLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm(p => ({
      ...p,
      [key]: value,
      // auto-generate slug from company name
      ...(key === "companyName" ? { slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } : {}),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = true;
    if (!form.slug.trim()) e.slug = true;
    if (!form.city.trim()) e.city = true;
    if (!form.adminName.trim()) e.adminName = true;
    if (!form.email.trim() || !form.email.includes("@")) e.email = true;
    if (form.password.length < 8) e.password = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await registerTenant({
        name:      form.companyName,
        slug:      form.slug,
        email:     form.email,
        address:   { city: form.city, street: form.address || undefined },
        adminUser: { fullName: form.adminName, email: form.email, password: form.password },
        plan:         form.plan,
        billingCycle: form.billing,
      });
      // Upload logo separately if a file was selected
      const tenantId = res?.data?.tenant?.id;
      if (logo && tenantId) {
        await uploadTenantLogo(tenantId, logo);
      }
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/super-admin/companies");
      }, 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to register company. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoName(file.name);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const errStyle = (key) => errors[key] ? { borderColor: "#ef4444", background: "#fff5f5" } : {};

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      {showToast && <SuccessToast onClose={() => setShowToast(false)} />}

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8edf3",
        padding: "18px 32px", display: "flex", alignItems: "center", gap: 20,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>
            Register New Company
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
            Add a new water delivery company to the platform
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#f1f5f9", borderRadius: 10, padding: "9px 16px", width: 240,
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input placeholder="Search..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ position: "absolute", top: -3, right: -3, width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }}/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#fff" opacity=".9"/>
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#fff" opacity=".7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>Super Admin</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>admin@system.com</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px 40px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Register New Company</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>Add a new water delivery company to the platform</div>
        </div>

        {/* Section 1 – Company Information */}
        <SectionCard
          iconBg="linear-gradient(135deg, #2563eb, #3b82f6)"
          icon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M3 21h18M9 21v-5h6v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="7" width="2" height="2" rx=".5" fill="#fff"/><rect x="13" y="7" width="2" height="2" rx=".5" fill="#fff"/>
              <rect x="9" y="11" width="2" height="2" rx=".5" fill="#fff"/><rect x="13" y="11" width="2" height="2" rx=".5" fill="#fff"/>
            </svg>
          }
          title="Company Information"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
            <div>
              <Label required>Company Name</Label>
              <FocusInput
                placeholder="e.g., Panni Flow"
                value={form.companyName}
                onChange={set("companyName")}
              />
              {errors.companyName && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Company name is required</div>}
            </div>
            <div>
              <Label required>Slug (unique ID)</Label>
              <FocusInput
                placeholder="e.g., panni-flow"
                value={form.slug}
                onChange={set("slug")}
              />
              {errors.slug && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Slug is required</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
            <div>
              <Label required>City / Region</Label>
              <FocusInput placeholder="e.g., Dubai" value={form.city} onChange={set("city")} />
              {errors.city && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>City is required</div>}
            </div>
            <div>
              <Label>Address</Label>
              <FocusInput placeholder="Full address" value={form.address} onChange={set("address")} />
            </div>
          </div>

          {/* App Link */}
          <div style={{ marginBottom: 18 }}>
            <Label>App Link</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <input
                readOnly
                value={appLink}
                placeholder="Enter a slug above to generate the link"
                style={{
                  ...inputStyle,
                  flex: 1,
                  borderRadius: "10px 0 0 10px",
                  color: appLink ? "#2563eb" : "#94a3b8",
                  background: "#f1f5f9",
                  cursor: "default",
                  borderRight: "none",
                }}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!appLink}
                title="Copy link"
                style={{
                  padding: "0 16px",
                  height: 44,
                  border: "1.5px solid #e2e8f0",
                  borderLeft: "none",
                  borderRadius: "0 10px 10px 0",
                  background: copied ? "#f0fdf4" : "#fff",
                  cursor: appLink ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", gap: 6,
                  color: copied ? "#16a34a" : "#64748b",
                  fontSize: 12.5, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s, color 0.15s",
                  flexShrink: 0,
                  opacity: appLink ? 1 : 0.45,
                }}
              >
                {copied ? (
                  <>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <Label>Company Logo</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={() => fileRef.current.click()}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 10,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: "#374151", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  flexShrink: 0, transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Upload Logo
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
              {logoPreview ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={logoPreview} alt="logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "1px solid #e2e8f0" }} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{logoName}</span>
                </div>
              ) : (
                <span style={{ fontSize: 13, color: "#94a3b8" }}>PNG, JPG up to 2MB</span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Section 2 – Admin Account */}
        <SectionCard
          iconBg="linear-gradient(135deg, #0d9488, #14b8a6)"
          icon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          }
          title="Admin Account"
        >
          <div style={{ marginBottom: 18 }}>
            <Label required>Admin Name</Label>
            <FocusInput placeholder="Full name" value={form.adminName} onChange={set("adminName")} />
            {errors.adminName && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Admin name is required</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <Label required>Email</Label>
              <FocusInput placeholder="admin@company.com" value={form.email} onChange={set("email")} type="email" />
              {errors.email && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Valid email is required</div>}
            </div>
            <div>
              <Label required>Password</Label>
              <FocusInput placeholder="Min. 8 characters" value={form.password} onChange={set("password")} type="password" />
              {errors.password && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Min. 8 characters required</div>}
            </div>
          </div>
        </SectionCard>

        {/* Section 3 – Subscription Setup */}
        <SectionCard
          iconBg="linear-gradient(135deg, #7c3aed, #a855f7)"
          icon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/>
              <path d="M2 10h20M6 15h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          }
          title="Subscription Setup"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
            <div>
              <Label>Plan</Label>
              <select value="basic" onChange={() => {}} disabled style={{ ...selectStyle, opacity: 1, cursor: "default", background: "#f1f5f9" }}>
                <option value="basic">Basic</option>
              </select>
            </div>
            <div>
              <Label>Billing Cycle</Label>
              <select value={form.billing} onChange={set("billing")} style={selectStyle}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <Label>Price</Label>
              <input
                readOnly
                value={plans?.basic?.[form.billing] != null ? `${plans.basic[form.billing]} PKR` : "—"}
                style={{ ...inputStyle, background: "#f1f5f9", cursor: "default" }}
              />
            </div>
          </div>
        </SectionCard>

        {/* Section 4 – Feature Access */}
        <SectionCard
          iconBg="linear-gradient(135deg, #16a34a, #22c55e)"
          icon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.8"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          }
          title="Feature Access"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "orderManagement", label: "Order Management" },
              { key: "liveTracking", label: "Live Tracking" },
              { key: "aiForecasting", label: "AI Forecasting" },
              { key: "analytics", label: "Analytics" },
            ].map(f => (
              <Checkbox
                key={f.key}
                label={f.label}
                checked={features[f.key]}
                onChange={(val) => setFeatures(p => ({ ...p, [f.key]: val }))}
              />
            ))}
          </div>
        </SectionCard>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
          {apiError && (
            <div style={{ fontSize: 13, color: "#ef4444", flex: 1 }}>{apiError}</div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              opacity: submitting ? 0.7 : 1,
              transition: "opacity 0.15s, transform 0.15s",
            }}
          >
            {submitting ? "Creating…" : "Create Company"}
          </button>
          <button
            onClick={() => navigate("/super-admin/companies")}
            style={{
              padding: "12px 28px",
              background: "#fff", color: "#475569",
              border: "1.5px solid #e2e8f0", borderRadius: 12,
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#94a3b8"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
