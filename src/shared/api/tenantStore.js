// ─────────────────────────────────────────────────────────────────────────────
// tenantStore — module-level mutable store for the active tenant ID.
//
// Why not React context? The axios instance is created once at module load time,
// before React mounts. Using a plain module-level variable lets the axios
// request interceptor read the latest tenantId without importing React context
// (which would cause circular dependency issues).
//
// Usage:
//   import { getTenantId, setTenantId } from "./tenantStore";
// ─────────────────────────────────────────────────────────────────────────────

let _tenantId = "";

export function getTenantId() {
  return _tenantId;
}

export function setTenantId(id) {
  _tenantId = id ?? "";
}
