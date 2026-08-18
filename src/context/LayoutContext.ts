import { createContext } from 'react';

export interface LayoutContextType {
  /** Currently active sidebar navigation item ID */
  activeItem: string;
  /** Function to update active navigation item */
  setActiveItem: (id: string) => void;
  /** Breadcrumb navigation items */
  breadcrumbs: string[];
  /** Function to update topbar breadcrumbs */
  setBreadcrumbs: (crumbs: string[]) => void;
  /** Currently selected asset ID for detailed view */
  selectedAssetId: string | null;
  /** Function to update selected asset ID */
  setSelectedAssetId: (id: string | null) => void;
  /** Helper function to navigate straight to an asset's detail page from anywhere */
  navigateToAsset: (assetId: string) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
