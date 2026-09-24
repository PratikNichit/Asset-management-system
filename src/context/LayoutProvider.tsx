import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutContext } from './LayoutContext';
import type { BreadcrumbItem } from './LayoutContext';

export interface LayoutProviderProps {
  children: ReactNode;
  defaultBreadcrumbs?: string[];
}

export function LayoutProvider({
  children,
  defaultBreadcrumbs = ['Atlas Industries', 'Asset Management'],
}: LayoutProviderProps) {
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState(defaultBreadcrumbs);
  const [breadcrumbLinks, setBreadcrumbLinks] = useState<BreadcrumbItem[]>(
    defaultBreadcrumbs.map((label) => ({ label }))
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const navigateToAsset = useCallback((assetId: string) => {
    setSelectedAssetId(assetId);
    navigate('/assets');
  }, [navigate]);

  /** Sync plain labels and rich links together when plain setter is called */
  const handleSetBreadcrumbs = useCallback((crumbs: string[]) => {
    setBreadcrumbs(crumbs);
    // Preserve existing paths where the label still matches
    setBreadcrumbLinks((prev) =>
      crumbs.map((label) => {
        const existing = prev.find((p) => p.label === label);
        return existing ?? { label };
      })
    );
  }, []);

  const handleSetBreadcrumbLinks = useCallback((crumbs: BreadcrumbItem[]) => {
    setBreadcrumbLinks(crumbs);
    setBreadcrumbs(crumbs.map((c) => c.label));
  }, []);

  const contextValue = useMemo(() => ({
    breadcrumbs,
    setBreadcrumbs: handleSetBreadcrumbs,
    breadcrumbLinks,
    setBreadcrumbLinks: handleSetBreadcrumbLinks,
    selectedAssetId,
    setSelectedAssetId,
    navigateToAsset,
  }), [
    breadcrumbs,
    handleSetBreadcrumbs,
    breadcrumbLinks,
    handleSetBreadcrumbLinks,
    selectedAssetId,
    navigateToAsset
  ]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}
