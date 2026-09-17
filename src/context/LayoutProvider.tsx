import { useState, type ReactNode } from 'react';
import { LayoutContext } from './LayoutContext';
import type { BreadcrumbItem } from './LayoutContext';

export interface LayoutProviderProps {
  children: ReactNode;
  defaultActiveItem?: string;
  defaultBreadcrumbs?: string[];
}

export function LayoutProvider({
  children,
  defaultActiveItem = 'dashboard',
  defaultBreadcrumbs = ['Atlas Industries', 'Asset Management'],
}: LayoutProviderProps) {
  const [activeItem, setActiveItem] = useState(defaultActiveItem);
  const [breadcrumbs, setBreadcrumbs] = useState(defaultBreadcrumbs);
  const [breadcrumbLinks, setBreadcrumbLinks] = useState<BreadcrumbItem[]>(
    defaultBreadcrumbs.map((label) => ({ label }))
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const navigateToAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveItem('assets');
  };

  /** Sync plain labels and rich links together when plain setter is called */
  const handleSetBreadcrumbs = (crumbs: string[]) => {
    setBreadcrumbs(crumbs);
    // Preserve existing navIds where the label still matches
    setBreadcrumbLinks((prev) =>
      crumbs.map((label) => {
        const existing = prev.find((p) => p.label === label);
        return existing ?? { label };
      })
    );
  };

  return (
    <LayoutContext.Provider
      value={{
        activeItem,
        setActiveItem,
        breadcrumbs,
        setBreadcrumbs: handleSetBreadcrumbs,
        breadcrumbLinks,
        setBreadcrumbLinks: (crumbs) => {
          setBreadcrumbLinks(crumbs);
          setBreadcrumbs(crumbs.map((c) => c.label));
        },
        selectedAssetId,
        setSelectedAssetId,
        navigateToAsset,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
