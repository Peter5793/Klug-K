import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "../components/AppShell";
import { useAuth, AuthProvider } from "../lib/auth";
import { AccountSettingsPage } from "../pages/AccountSettingsPage";
import { AuthPage } from "../pages/AuthPage";
import { ConfigurePage } from "../pages/ConfigurePage";
import { DashboardPage } from "../pages/DashboardPage";
import { FloorLayoutPage } from "../pages/FloorLayoutPage";
import { MenuPage } from "../pages/MenuPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { OnboardingSetupPage } from "../pages/OnboardingSetupPage";
import { OrdersPage } from "../pages/OrdersPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ReservationsPage } from "../pages/ReservationsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SubscriptionPage } from "../pages/SubscriptionPage";
import { SuppliesPage } from "../pages/SuppliesPage";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { isReady, isAdmin, needsAdminSetup, user } = useAuth();

  if (!isReady) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <p className="page-frame__eyebrow">Klug-K</p>
          <h1>Loading admin workspace...</h1>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate replace to={needsAdminSetup ? "/onboarding/setup" : "/dashboard"} /> : <AuthPage />}
      />
      <Route
        path="/onboarding/setup"
        element={
          user ? (
            isAdmin ? (
              needsAdminSetup ? (
                <OnboardingSetupPage />
              ) : (
                <Navigate replace to="/dashboard" />
              )
            ) : (
              <Navigate replace to="/dashboard" />
            )
          ) : (
            <Navigate replace to="/login" />
          )
        }
      />
      <Route
        path="/"
        element={
          user ? (
            needsAdminSetup ? (
              <Navigate replace to="/onboarding/setup" />
            ) : (
              <AppShell />
            )
          ) : (
            <Navigate replace to="/login" />
          )
        }
      >
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="supplies" element={<SuppliesPage />} />
        <Route path="floor-layout" element={<FloorLayoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="account-settings" element={<AccountSettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="configure" element={<AdminOnlyRoute><ConfigurePage /></AdminOnlyRoute>} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function AdminOnlyRoute({ children }: { children: JSX.Element }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}
