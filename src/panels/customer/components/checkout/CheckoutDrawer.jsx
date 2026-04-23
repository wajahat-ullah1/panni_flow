import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../../../shared/api/customerApi";
import { useAuthContext } from "../../../../shared/context/AuthContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="#0ea5e9" strokeWidth="2" fill="#e0f2fe" />
      <circle cx="12" cy="9" r="2.5" stroke="#0ea5e9" strokeWidth="2" />
    </svg>
  );
}

function CodIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="#10b981" strokeWidth="2" fill="#d1fae5" />
      <path d="M2 10h20" stroke="#10b981" strokeWidth="2" />
      <circle cx="8" cy="16" r="1.5" fill="#10b981" />
      <circle cx="12" cy="16" r="1.5" fill="#10b981" />
    </svg>
  );
}

function CheckCircleIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10"
        stroke={active ? "#0ea5e9" : "#cbd5e1"}
        strokeWidth="2"
        fill={active ? "#e0f2fe" : "white"} />
      {active && (
        <polyline points="8 12 11 15 16 9"
          stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="#94a3b8" strokeWidth="2" />
      <polyline points="14 2 14 8 20 8" stroke="#94a3b8" strokeWidth="2" />
      <line x1="8" y1="13" x2="16" y2="13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="17" x2="12" y2="17" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutDrawer({ open, onClose, product, quantity, total }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [note, setNote] = useState("");

  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null); // placed order response

  // Fetch addresses whenever the drawer opens
  useEffect(() => {
    if (!open) return;
    setAddrError(null);
    setOrderError(null);
    setOrderSuccess(null);
    setAddrLoading(true);
    customerApi
      .getProfile()
      .then((res) => {
        const profile = res.data ?? {};
        setUserProfile(profile);
        const addrs = profile?.addresses ?? [];
        setAddresses(addrs);
        const def = addrs.find((a) => a.isDefault) ?? addrs[0];
        if (def) setSelectedAddressId(def._id);
      })
      .catch(() => setAddrError("Could not load addresses."))
      .finally(() => setAddrLoading(false));
  }, [open]);

  if (!open) return null;

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
  console.log("user:", user);
  console.log("userProfile:", userProfile);


  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError("Please select a delivery address.");
      return;
    }
    setOrderError(null);
    setPlacing(true);
    try {
      const payload = {
        customerId: userProfile?._id ?? user?.id ?? "",
        customerName: userProfile?.name,
        customerPhone: userProfile?.phone,
        deliveryAddress: {
          label: selectedAddress.label ?? "",
          street: selectedAddress.address ?? "",
          landmark: selectedAddress.landmark ?? "",
          city: selectedAddress.city ?? "",
          state: selectedAddress.state ?? "",
          postalCode: selectedAddress.postalCode ?? "",
          coordinates: selectedAddress.coordinates ?? {},
        },
        items: [
          {
            productId: product._id,
            productName: product.name,
            quantity,
            unitPrice: product.unitPrice,
          },
        ],
        paymentMethod: "cod",
        notes: note.trim(),
      };
      const res = await customerApi.placeOrder(payload);
      console.log("Place order response:", res);
      if(!res?.success) {
        throw new Error("Failed to place order. Please try again.");
        }
        setOrderSuccess("Order placed successfully!");
        onClose();
    } catch (err) {
        console.error("Error placing order:", err);
        setOrderError("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <>
        <div style={styles.backdrop} onClick={onClose} />
        <div style={styles.drawer}>
          <div style={styles.successScreen}>
            <div style={styles.successIconWrap}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
                <polyline points="7 12 10.5 15.5 17 8.5"
                  stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={styles.successTitle}>Order Placed!</div>
            <div style={styles.successSub}>
              Your order has been confirmed. We'll notify you when it's on the way.
            </div>
            {orderSuccess._id && (
              <div style={styles.successOrderId}>
                Order ID: <strong>{orderSuccess._id}</strong>
              </div>
            )}
            <div style={styles.successSummaryBox}>
              <div style={styles.successLine}>
                <span style={styles.successLineLabel}>Product</span>
                <span style={styles.successLineValue}>{product.name}</span>
              </div>
              <div style={styles.successLine}>
                <span style={styles.successLineLabel}>Quantity</span>
                <span style={styles.successLineValue}>{quantity} bottles</span>
              </div>
              <div style={styles.successLine}>
                <span style={styles.successLineLabel}>Total</span>
                <span style={{ ...styles.successLineValue, color: "#0ea5e9", fontWeight: 800 }}>${total}</span>
              </div>
              <div style={styles.successLine}>
                <span style={styles.successLineLabel}>Payment</span>
                <span style={styles.successLineValue}>Cash on Delivery</span>
              </div>
            </div>
            <button style={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        </div>
      </>
    );
  }

  // ── Normal checkout screen ──────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Drawer */}
      <div style={styles.drawer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerTitle}>Checkout</div>
            <div style={styles.headerSub}>Review and confirm your order</div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={styles.body}>

          {/* ── Order Summary ─────────────────────────────────────────── */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Order Summary</div>
            <div style={styles.summaryBox}>
              <div style={styles.summaryProductRow}>
                <div style={styles.summaryIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                      stroke="#0ea5e9" strokeWidth="1.5" strokeLinejoin="round" fill="#bae6fd" />
                    <path d="M9 13c0 1.66 1.34 3 3 3s3-1.34 3-3"
                      stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={styles.summaryProductInfo}>
                  <div style={styles.summaryProductName}>{product?.name ?? "19L Water Bottle"}</div>
                  <div style={styles.summaryProductMeta}>
                    ${product?.unitPrice ?? 0} × {quantity} bottles
                  </div>
                </div>
                <div style={styles.summaryProductTotal}>${total}</div>
              </div>

              <div style={styles.summaryDivider} />

              <div style={styles.summaryLines}>
                <div style={styles.summaryLine}>
                  <span style={styles.summaryLineLabel}>Subtotal</span>
                  <span style={styles.summaryLineValue}>${total}</span>
                </div>
                <div style={styles.summaryLine}>
                  <span style={styles.summaryLineLabel}>Discount</span>
                  <span style={styles.summaryLineValue}>—</span>
                </div>
                <div style={styles.summaryLine}>
                  <span style={styles.summaryLineLabel}>Tax</span>
                  <span style={styles.summaryLineValue}>—</span>
                </div>
                <div style={styles.summaryLine}>
                  <span style={styles.summaryLineLabel}>Shipping</span>
                  <span style={{ ...styles.summaryLineValue, color: "#10b981", fontWeight: 600 }}>Free</span>
                </div>
              </div>

              <div style={styles.summaryTotalRow}>
                <span style={styles.summaryTotalLabel}>Total</span>
                <span style={styles.summaryTotalValue}>${total}</span>
              </div>
            </div>
          </div>

          {/* ── Delivery Address ─────────────────────────────────────── */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <LocationIcon />
              Delivery Address
            </div>

            {addrLoading && (
              <div style={styles.infoNote}>Loading addresses...</div>
            )}
            {addrError && !addrLoading && (
              <div style={styles.errorNote}>{addrError}</div>
            )}
            {!addrLoading && !addrError && addresses.length === 0 && (
              <div style={styles.noAddressCard}>
                <div style={styles.noAddressIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="#94a3b8" strokeWidth="1.5" fill="#f1f5f9" />
                    <circle cx="12" cy="9" r="2.5" stroke="#94a3b8" strokeWidth="1.5" />
                  </svg>
                </div>
                <div style={styles.noAddressText}>No delivery addresses saved yet.</div>
                <div style={styles.noAddressSub}>Add an address in your profile to place an order.</div>
                <button
                  style={styles.goToProfileBtn}
                  onClick={() => { onClose(); navigate("/customer/profile"); }}
                >
                  Go to Profile &rarr;
                </button>
              </div>
            )}

            {!addrLoading && addresses.length > 0 && (
              <>
                <div style={styles.addressList}>
                  {addresses.map((addr) => {
                    const active = addr._id === selectedAddressId;
                    return (
                      <button
                        key={addr._id}
                        style={{ ...styles.addressCard, ...(active ? styles.addressCardActive : {}) }}
                        onClick={() => setSelectedAddressId(addr._id)}
                      >
                        <div style={styles.addressCardTop}>
                          <div style={styles.addressLabelRow}>
                            <span style={styles.addressLabel}>{addr.label}</span>
                            {addr.isDefault && (
                              <span style={styles.defaultBadge}>Default</span>
                            )}
                          </div>
                          <CheckCircleIcon active={active} />
                        </div>
                        <div style={styles.addressStreet}>{addr.address}</div>
                        <div style={styles.addressCity}>{addr.city}</div>
                      </button>
                    );
                  })}
                </div>

                {selectedAddress && (
                  <div style={styles.selectedAddressNote}>
                    <LocationIcon />
                    <span>
                      Delivering to: <strong>{selectedAddress.address}, {selectedAddress.city}</strong>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Payment Method ───────────────────────────────────────── */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Payment Method</div>
            <div style={styles.paymentCard}>
              <div style={styles.paymentLeft}>
                <CodIcon />
                <div>
                  <div style={styles.paymentName}>Cash on Delivery</div>
                  <div style={styles.paymentDesc}>Pay when your order arrives</div>
                </div>
              </div>
              <CheckCircleIcon active={true} />
            </div>
            <div style={styles.codNote}>
              Only Cash on Delivery is available at the moment. More payment options coming soon.
            </div>
          </div>

          {/* ── Order Notes ──────────────────────────────────────────── */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <NoteIcon />
              Order Notes
              <span style={styles.optionalTag}>Optional</span>
            </div>
            <textarea
              style={styles.noteInput}
              rows={3}
              placeholder="Any special instructions? (e.g., leave at door, call on arrival...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* ── Order Error ───────────────────────────────────────────── */}
          {orderError && (
            <div style={styles.errorNote}>{orderError}</div>
          )}

        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerTotal}>
            <span style={styles.footerTotalLabel}>Total to pay</span>
            <span style={styles.footerTotalValue}>${total}</span>
          </div>
          <button
            style={{
              ...styles.placeOrderBtn,
              opacity: (placing || addresses.length === 0) ? 0.5 : 1,
              cursor: addresses.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={handlePlaceOrder}
            disabled={placing || addresses.length === 0}
          >
            {placing ? "Placing Order..." : "Place Order — COD"}
          </button>
          <button style={styles.cancelBtn} onClick={onClose} disabled={placing}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.4)",
    zIndex: 100,
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: 420,
    background: "white",
    zIndex: 101,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
  },

  // Success screen
  successScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 28px",
    gap: 12,
    textAlign: "center",
  },
  successIconWrap: { marginBottom: 4 },
  successTitle: { fontSize: 22, fontWeight: 800, color: "#0f172a" },
  successSub: { fontSize: 13, color: "#64748b", lineHeight: 1.6, maxWidth: 300 },
  successOrderId: {
    fontSize: 12,
    color: "#94a3b8",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "6px 14px",
  },
  successSummaryBox: {
    width: "100%",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  successLine: { display: "flex", justifyContent: "space-between" },
  successLineLabel: { fontSize: 12, color: "#94a3b8" },
  successLineValue: { fontSize: 12, fontWeight: 600, color: "#0f172a" },
  doneBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 8,
  },

  // Header
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 22px 16px",
    borderBottom: "1px solid #f1f5f9",
    flexShrink: 0,
  },
  headerLeft: {},
  headerTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  headerSub: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // Body
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  // Section
  section: { display: "flex", flexDirection: "column", gap: 10 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 6,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  optionalTag: {
    fontSize: 10,
    fontWeight: 500,
    color: "#94a3b8",
    background: "#f1f5f9",
    padding: "2px 7px",
    borderRadius: 10,
    textTransform: "none",
    letterSpacing: 0,
    marginLeft: 4,
  },

  // Info / error notes
  infoNote: {
    fontSize: 12,
    color: "#94a3b8",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 12px",
  },
  errorNote: {
    fontSize: 12,
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "8px 12px",
  },

  // Order Summary box
  summaryBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 16px",
  },
  summaryProductRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  summaryProductInfo: { flex: 1 },
  summaryProductName: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  summaryProductMeta: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  summaryProductTotal: { fontSize: 15, fontWeight: 800, color: "#0f172a" },
  summaryDivider: { height: 1, background: "#e2e8f0", margin: "10px 0" },
  summaryLines: { display: "flex", flexDirection: "column", gap: 6 },
  summaryLine: { display: "flex", justifyContent: "space-between" },
  summaryLineLabel: { fontSize: 12, color: "#94a3b8" },
  summaryLineValue: { fontSize: 12, fontWeight: 600, color: "#475569" },
  summaryTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #e2e8f0",
  },
  summaryTotalLabel: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  summaryTotalValue: { fontSize: 18, fontWeight: 800, color: "#0f172a" },

  // Address
  addressList: { display: "flex", flexDirection: "column", gap: 8 },
  addressCard: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    background: "white",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
  },
  addressCardActive: {
    border: "2px solid #0ea5e9",
    background: "#f0f9ff",
  },
  addressCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addressLabelRow: { display: "flex", alignItems: "center", gap: 6 },
  addressLabel: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  defaultBadge: {
    fontSize: 10,
    fontWeight: 600,
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "2px 7px",
    borderRadius: 10,
  },
  addressStreet: { fontSize: 12, color: "#475569" },
  addressCity: { fontSize: 12, color: "#94a3b8", marginTop: 1 },
  selectedAddressNote: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#475569",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 8,
    padding: "8px 12px",
  },

  // Payment
  paymentCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    border: "2px solid #10b981",
    borderRadius: 12,
    background: "#f0fdf4",
    cursor: "default",
  },
  paymentLeft: { display: "flex", alignItems: "center", gap: 12 },
  paymentName: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  paymentDesc: { fontSize: 11, color: "#64748b", marginTop: 1 },
  codNote: {
    fontSize: 11,
    color: "#94a3b8",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 12px",
    lineHeight: 1.5,
  },

  // Notes
  noteInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    color: "#0f172a",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },

  // Footer
  footer: {
    padding: "16px 22px",
    borderTop: "1px solid #f1f5f9",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "white",
  },
  footerTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTotalLabel: { fontSize: 13, color: "#64748b" },
  footerTotalValue: { fontSize: 22, fontWeight: 800, color: "#0f172a" },
  placeOrderBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  cancelBtn: {
    width: "100%",
    padding: "11px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#64748b",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },

  // No address empty state
  noAddressCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "22px 16px",
    border: "1.5px dashed #cbd5e1",
    borderRadius: 12,
    background: "#f8fafc",
    textAlign: "center",
  },
  noAddressIcon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  noAddressText: { fontSize: 13, fontWeight: 700, color: "#374151" },
  noAddressSub: { fontSize: 12, color: "#94a3b8", lineHeight: 1.5 },
  goToProfileBtn: {
    marginTop: 6,
    padding: "9px 20px",
    borderRadius: 10,
    border: "1.5px solid #0ea5e9",
    background: "white",
    color: "#0ea5e9",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
};