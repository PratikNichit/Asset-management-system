// ─── Asset Domain Types ───────────────────────────────────────────────────────

export type AssetStatus = 'In Use' | 'Available' | 'Maintenance' | 'Under Maintenance' | 'Retired' | 'Disposed';

export type AssetCategory =
  | 'Laptops'
  | 'Monitors'
  | 'Machines'
  | 'Molds'
  | 'Forklifts'
  | 'Peripherals'
  | 'Furniture'
  | 'Software Licenses';

export interface Asset {
  id: string;
  /** Display name, e.g. "MacBook Pro 16" M3" */
  name: string;
  /** Short asset code, e.g. "AST-00184" */
  code: string;
  category: string;
  categoryId?: string;
  /** Serial / barcode number */
  serial: string;
  department: string;
  departmentId?: string;
  location: string;
  locationId?: string;
  /** Assigned employee name, null when unassigned */
  assignedTo: string | null;
  assignedToId?: string | null;
  /** ISO date string for warranty expiry, e.g. "2027-02-11" */
  warrantyExpiry: string | null;
  status: AssetStatus;
  brand?: string;
  model?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  vendor?: string;
  description?: string;
  images?: string[];
  documents?: string[];
}
