import { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LayoutProvider } from './context/LayoutProvider';
import { useLayout } from './hooks/useLayout';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import AssignAssetPage from './pages/AssignAssetPage';
import MaintenancePage from './pages/MaintenancePage';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import LocationsPage from './pages/LocationsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import { useAppSelector } from './app/hooks';
import { selectThemeMode } from './redux/themeSlice';
import { getAppTheme } from './theme/theme';

function AppContent() {
  const { activeItem, setActiveItem } = useLayout();
  
  // Check if initial URL includes login hash or path (e.g. http://localhost:5173/#login or /login)
  const isInitialLoginUrl = window.location.hash === '#login' || window.location.pathname === '/login';
  
  const [isAuthenticated, setIsAuthenticated] = useState(!isInitialLoginUrl);
  const [isCreatingNewAsset, setIsCreatingNewAsset] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    if (window.location.hash === '#login') {
      window.history.pushState(null, '', window.location.pathname);
    }
    setActiveItem('dashboard');
  };

  const handleNewAsset = () => {
    setIsCreatingNewAsset(true);
    setActiveItem('assets');
  };

  if (!isAuthenticated || activeItem === 'login' || window.location.hash === '#login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardPage onNewAssetClick={handleNewAsset} />;
      case 'assets':
        return <AssetsPage isCreatingAssetDirectly={isCreatingNewAsset} />;
      case 'assign-asset':
        return <AssignAssetPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'employees':
        return <EmployeesPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'locations':
        return <LocationsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNewAssetClick={handleNewAsset} />;
    }
  };

  return (
    <AppLayout onNewAssetClick={handleNewAsset}>
      {renderCurrentPage()}
    </AppLayout>
  );
}

export default function App() {
  const themeMode = useAppSelector(selectThemeMode);
  const appTheme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <LayoutProvider>
        <AppContent />
      </LayoutProvider>
    </ThemeProvider>
  );
}
