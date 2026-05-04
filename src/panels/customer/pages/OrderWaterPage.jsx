import { useState, useEffect } from "react";
import { DropIcon, TruckIcon } from "../components/icons/Icons";
import customerApi from "../../../shared/api/customerApi";
import CheckoutDrawer from "../components/checkout/CheckoutDrawer";

function CartIcon({ stroke = "#0ea5e9" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="21" r="1.5" fill={stroke} />
      <circle cx="19" cy="21" r="1.5" fill={stroke} />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
        stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon({ stroke = "#64748b" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="#16a34a" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const FEATURES = [
  {
    label: "Premium Quality",
    desc: "7-stage purification",
    iconBg: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    icon: <DropIcon stroke="white" />,
  },
  {
    label: "Certified Safe",
    desc: "Lab tested water",
    iconBg: "linear-gradient(135deg,#10b981,#059669)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Easy Ordering",
    desc: "Order in 2 clicks",
    iconBg: "linear-gradient(135deg,#a855f7,#7c3aed)",
    icon: <CartIcon stroke="white" />,
  },
  {
    label: "Flexible Plans",
    desc: "Daily or weekly",
    iconBg: "linear-gradient(135deg,#f97316,#ea580c)",
    icon: <CalendarIcon stroke="white" />,
  },
];

export default function OrderWaterPage() {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("one-time");
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    customerApi
      .getProducts({ page: 1, limit: 1 })
      .then((res) => {
        const items = res.data?.data ?? [];
        if (items && items.length > 0) setProduct(items[0]);
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => setLoading(false));
  }, []);

  const pricePerBottle = product?.unitPrice ?? 0;
  const total = (pricePerBottle * quantity).toFixed(2);

  const handleOrder = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#94a3b8", fontSize: 15 }}>Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#ef4444", fontSize: 15 }}>{error || "No product available."}</span>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.pageTitle}>Order Water</div>
      <div style={styles.pageSubtitle}>Select your bottles and delivery preferences</div>

      <div style={styles.layout}>
        {/* Left — Product Card */}
        <div style={styles.productCard}>
          {/* Product Image + Info */}
          <div style={styles.productTop}>
            <div style={styles.imageWrap}>
              <div style={styles.imageInner}>
                <svg width="90" height="90" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                    stroke="#0ea5e9" strokeWidth="1.5" strokeLinejoin="round" fill="#bae6fd" />
                  <path d="M9 13c0 1.66 1.34 3 3 3s3-1.34 3-3"
                    stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={styles.stockBadge}>
                <CheckIcon /> In Stock
              </div>
            </div>

            <div style={styles.productInfo}>
              <div style={styles.productName}>{product.name}</div>
              <div style={styles.productDesc}>{product.description}</div>
              <div style={styles.ratingRow}>
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
                <span style={styles.ratingText}>4.9 (2.4k reviews)</span>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.price}>PKR {pricePerBottle}</span>
                <span style={styles.perBottle}>per bottle</span>
              </div>

              {/* Quantity */}
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Quantity</div>
                <div style={styles.qtyRow}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <MinusIcon />
                  </button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              {/* Order Type */}
              {/* <div style={styles.section}>
                <div style={styles.sectionLabel}>Order Type</div>
                <div style={styles.typeRow}>
                  <button
                    style={{
                      ...styles.typeBtn,
                      ...(orderType === "one-time" ? styles.typeBtnActive : {}),
                    }}
                    onClick={() => setOrderType("one-time")}
                  >
                    <CartIcon stroke={orderType === "one-time" ? "#0ea5e9" : "#94a3b8"} />
                    <span style={{ color: orderType === "one-time" ? "#0ea5e9" : "#64748b", fontWeight: orderType === "one-time" ? 600 : 400 }}>
                      One-Time Order
                    </span>
                  </button>
                  <button
                    style={{
                      ...styles.typeBtn,
                      ...(orderType === "subscription" ? styles.typeBtnActive : {}),
                    }}
                    onClick={() => setOrderType("subscription")}
                  >
                    <CalendarIcon stroke={orderType === "subscription" ? "#0ea5e9" : "#94a3b8"} />
                    <span style={{ color: orderType === "subscription" ? "#0ea5e9" : "#64748b", fontWeight: orderType === "subscription" ? 600 : 400 }}>
                      Subscription
                    </span>
                  </button>
                </div>
              </div> */}

              {/* Actions */}
              <div style={styles.actionRow}>
                <button style={styles.orderBtn} onClick={handleOrder}>
                  {added ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
                {/* <button style={styles.cartIconBtn}>
                  <CartIcon stroke="white" />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>Order Summary</div>
          <div style={styles.summaryRows}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Product</span>
              <span style={styles.summaryValue}>{product.name}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Quantity</span>
              <span style={styles.summaryValue}>{quantity}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Unit Price</span>
              <span style={styles.summaryValue}>PKR {pricePerBottle}</span>
            </div>
            {/* <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Type</span>
              <span style={styles.summaryValue}>
                {orderType === "one-time" ? "One-Time" : "Subscription"}
              </span>
            </div> */}
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Discount</span>
              <span style={styles.summaryValue}>0
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax</span>
              <span style={styles.summaryValue}>0
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Shipping</span>
              <span style={styles.summaryValue}>Free
              </span>
            </div>
          </div>
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>PKR {total}</span>
          </div>

          <button style={styles.checkoutBtn} onClick={() => setCheckoutOpen(true)}>
            Proceed to Checkout
          </button>

          {/* Delivery Info */}
          {/* <div style={styles.deliveryCard}>
            <div style={styles.deliveryHeader}>
              <TruckIcon stroke="#0ea5e9" />
              <span style={styles.deliveryTitle}>Delivery Information</span>
            </div>
            <ul style={styles.deliveryList}>
              {[
                "Same-day delivery available",
                "Free delivery on orders above $50",
                "Contactless delivery option",
                "Track your order in real-time",
              ].map((item) => (
                <li key={item} style={styles.deliveryItem}>
                  <span style={styles.dot} />
                  {item}
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      <CheckoutDrawer
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
        quantity={quantity}
        total={total}
      />

      {/* Why Choose Section */}
      <div style={styles.whyCard}>
        <div style={styles.whyTitle}>Why Choose Panni Flow?</div>
        <div style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.label} style={styles.featureItem}>
              <div style={{ ...styles.featureIcon, background: f.iconBg }}>
                {f.icon}
              </div>
              <div>
                <div style={styles.featureLabel}>{f.label}</div>
                <div style={styles.featureDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { flex: 1, overflowY: "auto", padding: "24px 28px" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
  pageSubtitle: { fontSize: 13, color: "#94a3b8", marginTop: 2, marginBottom: 22 },

  layout: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 },

  productCard: {
    background: "white",
    borderRadius: 14,
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  productTop: { display: "flex", gap: 28 },

  imageWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 },
  imageInner: {
    width: 160,
    height: 160,
    borderRadius: 16,
    background: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stockBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: 20,
    width: "100%",
    justifyContent: "center",
  },

  productInfo: { flex: 1 },
  productName: { fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 6 },
  productDesc: { fontSize: 13.5, color: "#64748b", marginBottom: 10, lineHeight: 1.5 },
  ratingRow: { display: "flex", alignItems: "center", gap: 3, marginBottom: 12 },
  ratingText: { fontSize: 12, color: "#64748b", marginLeft: 4 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 },
  price: { fontSize: 28, fontWeight: 800, color: "#0ea5e9" },
  perBottle: { fontSize: 13, color: "#94a3b8" },

  section: { marginBottom: 18 },
  sectionLabel: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 },
  qtyRow: { display: "flex", alignItems: "center", gap: 0 },
  qtyBtn: {
    width: 36,
    height: 36,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    width: 52,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderLeft: "none",
    borderRight: "none",
    height: 36,
    lineHeight: "36px",
  },

  typeRow: { display: "flex", gap: 10 },
  typeBtn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "14px 10px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    background: "white",
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.15s",
  },
  typeBtnActive: { border: "2px solid #0ea5e9", background: "#f0f9ff" },

  actionRow: { display: "flex", gap: 10, marginTop: 4, width: "30%" },
  orderBtn: {
    flex: 1,
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
  cartIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  // Summary
  summaryCard: {
    background: "white",
    borderRadius: 14,
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    alignSelf: "start",
  },
  summaryTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16 },
  summaryRows: { display: "flex", flexDirection: "column", gap: 10 },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 13, color: "#94a3b8" },
  summaryValue: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  divider: { height: 1, background: "#f1f5f9", margin: "14px 0" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  totalLabel: { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  totalValue: { fontSize: 22, fontWeight: 800, color: "#0f172a" },

  checkoutBtn: {
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

  deliveryCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px",
  },
  deliveryHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  deliveryTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  deliveryList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 },
  deliveryItem: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#475569" },
  dot: { width: 5, height: 5, borderRadius: "50%", background: "#0ea5e9", flexShrink: 0 },

  // Why section
  whyCard: {
    background: "white",
    borderRadius: 14,
    padding: "22px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  whyTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 18 },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureLabel: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  featureDesc: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
};
