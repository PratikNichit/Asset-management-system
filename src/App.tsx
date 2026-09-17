import { useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LayoutProvider } from './context/LayoutProvider';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './router/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import NewAssetPage from './pages/NewAssetPage';
import AssignAssetPage from './pages/AssignAssetPage';
import MaintenancePage from './pages/MaintenancePage';
import ScheduleWorkPage from './pages/ScheduleWorkPage';
import EmployeesPage from './pages/EmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import DepartmentsPage from './pages/DepartmentsPage';
import NewDepartmentPage from './pages/NewDepartmentPage';
import LocationsPage from './pages/LocationsPage';
import CategoriesPage from './pages/CategoriesPage';
import NewCategoryPage from './pages/NewCategoryPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

// Redux & Supabase
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectThemeMode } from './redux/themeSlice';
import { selectIsAuthenticated, signIn, restoreSession, setUser } from './redux/authSlice';
import { fetchAssets } from './redux/assetsSlice';
import { fetchEmployees } from './redux/employeesSlice';
import { fetchWorkOrders } from './redux/maintenanceSlice';
import { fetchDepartments } from './redux/departmentsSlice';
import { fetchCategories } from './redux/categoriesSlice';
import { fetchLocations } from './redux/locationsSlice';
import { getAppTheme } from './theme/theme';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// ─── Login Wrapper ─────────────────────────────────────────────────────────────
function LoginWrapper() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(signIn({ email, password }));
    if (signIn.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}

// ─── Protected App Shell (Layout Route) ────────────────────────────────────────
function AppShell() {
  return (
    <LayoutProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </LayoutProvider>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const appTheme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  useEffect(() => {
    // Restore auth session from Supabase
    dispatch(restoreSession());

    // Fetch initial data
    dispatch(fetchAssets());
    dispatch(fetchEmployees());
    dispatch(fetchWorkOrders());
    dispatch(fetchDepartments());
    dispatch(fetchCategories());
    dispatch(fetchLocations());

    // Listen to Supabase auth state changes if configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email ?? '',
              name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
            })
          );
        } else {
          dispatch(setUser(null));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginWrapper />} />

        {/* Protected layout route */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage onNewAssetClick={() => {}} />} />
            <Route path="assets" element={<AssetsPage isCreatingAssetDirectly={false} />} />
            <Route path="assets/new" element={<NewAssetPage />} />
            <Route path="assign-asset" element={<AssignAssetPage />} />
            <Route path="maintenance" element={<MaintenancePage onScheduleWork={() => {}} />} />
            <Route path="maintenance/schedule" element={<ScheduleWorkPage onCancel={() => {}} />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/new" element={<AddEmployeePage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="departments/new" element={<NewDepartmentPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/new" element={<NewCategoryPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
