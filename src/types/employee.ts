// ─── Employee Domain Type ─────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  /** Office / site location, e.g. "HQ — Bengaluru" */
  location: string;
}
