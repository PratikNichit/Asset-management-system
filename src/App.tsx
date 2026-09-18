import { useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LayoutProvider } from './context/LayoutProvider';
import AppLayout from './layouts/AppLayout';
import RequireAuth from './router/RequireAuth';

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
import { selectAuthStatus, signIn, restoreSession, setUser } from './redux/authSlice';
import { fetchAssets } from './redux/assetsSlice';
import { fetchEmployees } from './redux/employeesSlice';
import { fetchWorkOrders } from './redux/maintenanceSlice';
import { fetchDepartments } from './redux/departmentsSlice';
import { fetchCategories } from './redux/categoriesSlice';
import { fetchLocations } from './redux/locationsSlice';
import { fetchDashboardStats } from './redux/dashboardSlice';
import { getAppTheme } from './theme/theme';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// --- Login Wrapper -----------------------------------------------------------
function LoginWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);

  // Where to go after login -- default to /dashboard if no prior location saved.
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    if (status === 'authenticated') navigate(from, { replace: true });
  }, [status, navigate, from]);

  const handleLogin = async (email: string, password: string) => {
    // Navigation is handled by the effect above once status flips to 'authenticated'.
    await dispatch(signIn({ email, password }));
  };

  return <LoginPage onLogin={handleLogin} />;
}

// --- Protected App Shell (Layout Route) -------------------------------------
function AppShell() {
  return (
    <LayoutProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </LayoutProvider>
  );
}

// --- Root --------------------------------------------------------------------
export default function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const appTheme = useMemo(() => getAppTheme(themeMode), [themeMode]);
  const authStatus = useAppSelector(selectAuthStatus);

  // Effect 1: Set up the auth listener (single source of truth for auth state)
  //
  // For Supabase mode: onAuthStateChange fires INITIAL_SESSION on boot, which
  // sets status to 'authenticated' or 'unauthenticated'. No extra getSession()
  // call needed. restoreSession is NOT called here.
  //
  // For local/fallback mode: dispatch restoreSession() which resolves status
  // from 'loading' to 'authenticated' or 'unauthenticated'.
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        // setUser atomically updates user + status + legacy flags.
        if (session?.user) {
          dispatch(setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
          }));
        } else {
          dispatch(setUser(null));
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback: restoreSession determines status immediately.
      dispatch(restoreSession());
    }
  }, [dispatch]);

  // Effect 2: Fetch all app data once -- and only once -- auth is confirmed.
  //
  // Fires when authStatus transitions TO 'authenticated' (from 'loading' on boot,
  // or from 'unauthenticated' after login). TOKEN_REFRESHED events keep status
  // as 'authenticated' so they do NOT trigger redundant re-fetches.
  useEffect(() => {
    if (authStatus === 'authenticated') {
      dispatch(fetchDashboardStats());
      dispatch(fetchAssets());
      dispatch(fetchEmployees());
      dispatch(fetchWorkOrders());
      dispatch(fetchDepartments());
      dispatch(fetchCategories());
      dispatch(fetchLocations());
    }
  }, [authStatus, dispatch]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginWrapper />} />

        {/* Protected routes guarded by RequireAuth.
            RequireAuth shows a spinner while status==='loading', redirects to
            /login (with from state) when status==='unauthenticated', and renders
            <Outlet /> only when status==='authenticated'.
            Child pages never mount (and never fire fetch useEffects) until auth
            is fully confirmed. */}
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"             element={<DashboardPage onNewAssetClick={() => {}} />} />
            <Route path="assets"                element={<AssetsPage isCreatingAssetDirectly={false} />} />
            <Route path="assets/new"            element={<NewAssetPage />} />
            <Route path="assign-asset"          element={<AssignAssetPage />} />
            <Route path="maintenance"           element={<MaintenancePage onScheduleWork={() => {}} />} />
            <Route path="maintenance/schedule"  element={<ScheduleWorkPage onCancel={() => {}} />} />
            <Route path="employees"             element={<EmployeesPage />} />
            <Route path="employees/new"         element={<AddEmployeePage />} />
            <Route path="departments"           element={<DepartmentsPage />} />
            <Route path="departments/new"       element={<NewDepartmentPage />} />
            <Route path="locations"             element={<LocationsPage />} />
            <Route path="categories"            element={<CategoriesPage />} />
            <Route path="categories/new"        element={<NewCategoryPage />} />
            <Route path="reports"               element={<ReportsPage />} />
            <Route path="notifications"         element={<NotificationsPage />} />
            <Route path="settings"              element={<SettingsPage />} />
            <Route path="*"                     element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
