import { LayoutProvider } from './context/LayoutProvider';
import { useLayout } from './hooks/useLayout';
import AppLayout from './layouts/AppLayout';
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

function AppContent() {
  const { activeItem } = useLayout();

  const handleNewAsset = () => {
    alert('New asset dialog triggered');
  };

  const renderCurrentPage = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardPage onNewAssetClick={handleNewAsset} />;
      case 'assets':
        return <AssetsPage />;
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
  return (
    <LayoutProvider>
      <AppContent />
    </LayoutProvider>
  );
}
