import { createContext } from 'react';

/** A single breadcrumb entry. `path` is the route path to navigate to on click. */
export interface BreadcrumbItem {
  label: string;
  /** If provided, clicking this crumb navigates to this route path. Omit for the current (last) crumb. */
  path?: string;
}

export interface LayoutContextType {
  /** Breadcrumb navigation items (plain labels, for backward compat display) */
  breadcrumbs: string[];
  /** Function to update topbar breadcrumbs (plain labels only) */
  setBreadcrumbs: (crumbs: string[]) => void;
  /** Rich breadcrumb items with optional navigation targets */
  breadcrumbLinks: BreadcrumbItem[];
  /** Function to update rich breadcrumb links */
  setBreadcrumbLinks: (crumbs: BreadcrumbItem[]) => void;
  /** Currently selected asset ID for detailed view */
  selectedAssetId: string | null;
  /** Function to update selected asset ID */
  setSelectedAssetId: (id: string | null) => void;
  /** Helper function to navigate straight to an asset's detail page from anywhere */
  navigateToAsset: (assetId: string) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
