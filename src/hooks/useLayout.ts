import { useContext } from 'react';
import { LayoutContext, type LayoutContextType } from '../context/LayoutContext';

/**
 * Custom hook to access layout context state and update breadcrumbs/active navigation.
 */
export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
