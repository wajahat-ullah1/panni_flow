// ─────────────────────────────────────────────────────────────────────────────
// TenantErrorPage
// Shown whenever the tenant ID in the URL is invalid, not found, inactive,
// or the server returned an unexpected error.
//
// Props:
//   reason: "format" | "not-found" | "inactive" | "error"
//   tenantId: the raw slug from the URL (for display in not-found case)
// ─────────────────────────────────────────────────────────────────────────────

const extraStyles = {
  exampleWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
    margin: "0 0 1rem",
  },
  label: { fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 },
  code: {
    background: "#f1f5f9",
    color: "#0ea5e9",
    padding: "0.2rem 0.65rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontFamily: "monospace",
    fontWeight: 600,
  },
};

const CONTENT = {
  format: {
    emoji: "🔗",
    accent: "#f59e0b",
    accentBg: "#fffbeb",
    badge: "Invalid URL",
    title: "Invalid Tenant ID",
    message:
      "The address you entered contains characters that are not allowed in a tenant ID. Tenant IDs may only contain letters, numbers, and hyphens, and must start and end with a letter or number.",
    extra: (
      <div style={extraStyles.exampleWrap}>
        <span style={extraStyles.label}>Valid examples:</span>
        <code style={extraStyles.code}>acme</code>
        <code style={extraStyles.code}>my-company</code>
        <code style={extraStyles.code}>waterco2</code>
      </div>
    ),
    footer: "Please check the link provided by your company.",
  },
  "not-found": {
    emoji: "🔍",
    accent: "#ef4444",
    accentBg: "#fef2f2",
    badge: "Not Found",
    title: "Company Not Found",
    message:
      "We couldn't find a company registered with this ID. The link may be outdated or the ID may have been typed incorrectly.",
    extra: null,
    footer: "Please double-check the link or contact the company that sent it to you.",
  },
  inactive: {
    emoji: "⏸️",
    accent: "#8b5cf6",
    accentBg: "#f5f3ff",
    badge: "Account Suspended",
    title: "Account Inactive",
    message:
      "This company's account is currently inactive. Access has been paused — this is usually temporary.",
    extra: null,
    footer: "Please contact your company administrator or Panni Flow support for assistance.",
  },
  error: {
    emoji: "⚡",
    accent: "#64748b",
    accentBg: "#f8fafc",
    badge: "Connection Error",
    title: "Something Went Wrong",
    message:
      "We were unable to reach our servers to verify this company. This is likely a temporary issue.",
    extra: null,
    footer: "Please try refreshing the page. If the problem persists, contact support.",
  },
};

// Inline SVG wave decoration
function WaveDecor({ color }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: 120, display: "block" }}
    >
      <path
        fill={color}
        fillOpacity="0.12"
        d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
      />
      <path
        fill={color}
        fillOpacity="0.07"
        d="M0,90 C480,30 960,110 1440,50 L1440,120 L0,120 Z"
      />
    </svg>
  );
}

export default function TenantErrorPage({ reason = "error", tenantId = "" }) {
  const c = CONTENT[reason] ?? CONTENT.error;

  const handleRetry = () => window.location.reload();

  return (
    <div style={{ ...styles.page, background: `linear-gradient(145deg, ${c.accentBg} 0%, #f8fafc 60%)` }}>
      {/* Background blobs */}
      <div style={{ ...styles.blob1, background: c.accent }} />
      <div style={{ ...styles.blob2, background: c.accent }} />

      <div style={styles.card}>
        {/* Top accent bar */}
        <div style={{ ...styles.accentBar, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}99)` }} />

        {/* Badge */}
        <div style={{ ...styles.badge, color: c.accent, background: `${c.accent}18`, border: `1px solid ${c.accent}30` }}>
          {c.badge}
        </div>

        {/* Emoji */}
        <div style={styles.emojiWrap}>
          <div style={{ ...styles.emojiCircle, background: `${c.accent}15`, border: `2px solid ${c.accent}25` }}>
            <span style={styles.emoji}>{c.emoji}</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={styles.title}>{c.title}</h1>

        {/* Slug pill (for not-found only) */}
        {reason === "not-found" && tenantId && (
          <div style={styles.slugPill}>
            <span style={styles.slugLabel}>Tried:</span>
            <code style={{ ...styles.slugCode, borderColor: c.accent, color: c.accent }}>
              /{tenantId}/
            </code>
          </div>
        )}

        {/* Message */}
        <p style={styles.message}>{c.message}</p>

        {/* Extra content (examples, etc.) */}
        {c.extra}

        {/* Divider */}
        <div style={styles.divider} />

        {/* Footer */}
        <p style={styles.footer}>{c.footer}</p>

        {/* Action buttons */}
        <div style={styles.actions}>
          {reason === "error" && (
            <button
              style={{ ...styles.btn, background: c.accent, boxShadow: `0 4px 16px ${c.accent}40` }}
              onClick={handleRetry}
            >
              Try Again
            </button>
          )}
          <a
            href="mailto:support@panniflow.com"
            style={{ ...styles.btnGhost, color: c.accent, border: `1.5px solid ${c.accent}40` }}
          >
            Contact Support
          </a>
        </div>

        {/* Branding */}
        <div style={styles.branding}>
          <div style={styles.brandDot} />
          <span style={styles.brandText}>Panni Flow</span>
        </div>
      </div>

      {/* Wave at bottom of page */}
      <div style={styles.waveWrap}>
        <WaveDecor color={c.accent} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "2rem",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    top: "-160px",
    right: "-120px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    opacity: 0.06,
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    bottom: "-120px",
    left: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    opacity: 0.05,
    filter: "blur(50px)",
    pointerEvents: "none",
  },
  waveWrap: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "none",
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)",
    padding: "0 2.5rem 2.5rem",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  accentBar: {
    height: "5px",
    borderRadius: "5px 5px 0 0",
    margin: "0 -2.5rem 2rem",
    width: "calc(100% + 5rem)",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.3rem 0.9rem",
    borderRadius: "100px",
    marginBottom: "1.5rem",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
  },
  emojiWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
  emojiCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: "2.2rem",
    lineHeight: 1,
  },
  title: {
    fontSize: "1.65rem",
    fontWeight: 800,
    color: "#0d1b2a",
    marginBottom: "1rem",
    lineHeight: 1.2,
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    letterSpacing: "-0.02em",
  },
  slugPill: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  slugLabel: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    fontWeight: 500,
  },
  slugCode: {
    fontSize: "0.85rem",
    fontFamily: "monospace",
    fontWeight: 700,
    padding: "0.25rem 0.75rem",
    borderRadius: "8px",
    background: "#f8fafc",
    border: "1.5px solid",
  },
  message: {
    fontSize: "0.95rem",
    color: "#64748b",
    lineHeight: 1.8,
    marginBottom: "1.25rem",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #e2e8f0, transparent)",
    margin: "1.25rem 0",
  },
  footer: {
    fontSize: "0.82rem",
    color: "#94a3b8",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "1.75rem",
  },
  btn: {
    padding: "0.65rem 1.75rem",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontFamily: "'Sora', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  btnGhost: {
    padding: "0.65rem 1.75rem",
    borderRadius: "10px",
    background: "transparent",
    fontFamily: "'Sora', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  branding: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  brandDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#0ea5e9",
  },
  brandText: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    fontWeight: 600,
    fontFamily: "'Sora', sans-serif",
  },
};
