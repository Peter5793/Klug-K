import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "../components/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { FloorLayoutPage } from "../pages/FloorLayoutPage";
import { MenuPage } from "../pages/MenuPage";
import { OrdersPage } from "../pages/OrdersPage";
import { ReservationsPage } from "../pages/ReservationsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SuppliesPage } from "../pages/SuppliesPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="supplies" element={<SuppliesPage />} />
          <Route path="floor-layout" element={<FloorLayoutPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
