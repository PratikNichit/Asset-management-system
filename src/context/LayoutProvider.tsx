import { useState, type ReactNode } from 'react';
import { LayoutContext } from './LayoutContext';

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

  return (
    <LayoutContext.Provider
      value={{
        activeItem,
        setActiveItem,
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
