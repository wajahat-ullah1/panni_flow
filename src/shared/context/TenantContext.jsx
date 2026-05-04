import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setTenantId } from "../api/tenantStore";
import tenantApi from "../api/tenantApi";

// ─────────────────────────────────────────────────────────────────────────────
// TenantContext
//
// Reads :tenantId from the URL, validates format, then confirms the tenant
// exists and is active by calling the backend. Exposes loading state, tenant
// profile data, and a structured error reason to child components.
//
// Error reasons:
//   "format"   — slug fails regex (bad chars, leading/trailing hyphens, etc.)
//   "not-found"— backend returned 404 (unknown tenant slug)
//   "inactive" — tenant exists but status !== "active"
//   "error"    — network failure or unexpected server error
// ─────────────────────────────────────────────────────────────────────────────

const SLUG_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1")
  .replace(/\/api\/v\d+\/?$/, "");

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const { tenantId } = useParams();

  const [loading, setLoading]       = useState(true);
  const [tenantData, setTenantData] = useState(null);   // profile from API
  const [tenantError, setTenantError] = useState(null); // "format" | "not-found" | "inactive" | "error"

  useEffect(() => {
    setLoading(true);
    setTenantData(null);
    setTenantError(null);

    // ── Step 1: format check ─────────────────────────────────────────────────
    if (!SLUG_REGEX.test(tenantId ?? "")) {
      setTenantError("format");
      setLoading(false);
      return;
    }

    // ── Step 2: sync to store so axios attaches X-Tenant-ID header ───────────
    setTenantId(tenantId);

    // ── Step 3: confirm tenant exists and is active via API ──────────────────
    tenantApi.getProfile(tenantId)
      .then((res) => {
        const data = res?.data ?? res;
        if (data?.status && data.status !== "active") {
          setTenantError("inactive");
        } else {
          setTenantData(data);
        }
      })
      .catch((err) => {
        const status = err?.response?.status;
        setTenantError(status === 404 ? "not-found" : "error");
        // Clear store — tenant is invalid, don't send header for subsequent calls
        setTenantId("");
      })
      .finally(() => setLoading(false));

    return () => setTenantId("");
  }, [tenantId]);

  const logoUrl = tenantData?.logo ? `${API_ORIGIN}${tenantData.logo}` : null;

  return (
    <TenantContext.Provider
      value={{
        tenantId: tenantError ? "" : (tenantId ?? ""),
        loading,
        tenantData,
        tenantError,
        logoUrl,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

// Custom hook — use this anywhere inside <TenantProvider>
export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used inside <TenantProvider>");
  return ctx;
}

export default TenantContext;
