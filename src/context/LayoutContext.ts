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
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
