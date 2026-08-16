// ─── Asset Domain Types ───────────────────────────────────────────────────────

export type AssetStatus = 'In Use' | 'Available' | 'Maintenance' | 'Retired';

export type AssetCategory =
  | 'Laptops'
  | 'Monitors'
  | 'Machines'
  | 'Molds'
  | 'Forklifts'
  | 'Peripherals';

export interface Asset {
  id: string;
  /** Display name, e.g. "MacBook Pro 16" M3" */
  name: string;
  /** Short asset code, e.g. "AST-00184" */
  code: string;
  category: AssetCategory;
  /** Serial / barcode number */
  serial: string;
  department: string;
  location: string;
  /** Assigned employee name, null when unassigned */
  assignedTo: string | null;
  /** ISO date string for warranty expiry, e.g. "2027-02-11" */
  warrantyExpiry: string | null;
  status: AssetStatus;
}
