// ─────────────────────────────────────────────────────────────────────────────
// driverStore — module-level store for the authenticated driver's profile.
//
// Same pattern as tenantStore: a plain module variable so any file can read
// the driverId synchronously without React context or circular imports.
//
// Populated once in DriverApp on mount via GET /drivers/me.
//
// Usage:
//   import { getDriverId, setDriverProfile, getDriverProfile } from "./driverStore";
// ─────────────────────────────────────────────────────────────────────────────

let _driverProfile = null;

export function getDriverId() {
  return _driverProfile?._id ?? null;
}

export function getDriverProfile() {
  return _driverProfile;
}

export function setDriverProfile(profile) {
  _driverProfile = profile ?? null;
}

export function clearDriverProfile() {
  _driverProfile = null;
}
