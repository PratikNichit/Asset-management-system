// ─── Category Domain Types ───────────────────────────────────────────────────

export type CategoryIconType =
  | 'laptop'
  | 'monitor'
  | 'machine'
  | 'mold'
  | 'forklift'
  | 'peripheral'
  | 'furniture'
  | 'software'
  | 'generic';

export interface AssetCategoryItem {
  id: string;
  name: string;
  assetsCount: number;
  iconType: CategoryIconType;
  bgColor: string;
  iconColor: string;
  description?: string;
  parentCategory?: string;
  depreciationMethod?: string;
  usefulLifeYears?: number;
  maintenanceInterval?: string;
  requiresCalibration?: boolean;
}
