import { NavLink, Outlet } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";

const navigation = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/menu", label: "Menu" },
  { to: "/orders", label: "Orders" },
  { to: "/reservations", label: "Reservations" },
  { to: "/supplies", label: "Supplies" },
  { to: "/floor-layout", label: "Floor Layout" },
  { to: "/settings", label: "Settings" },
];

export function AppShell() {
  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div>
          <p className="shell__eyebrow">Kitchen Operations</p>
          <h1 className="shell__title">Klug-K</h1>
          <p className="shell__subtitle">
            Admin tools for menu clarity, table control, and margin discipline.
          </p>
        </div>

        <nav className="shell__nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }: NavLinkRenderProps) =>
                isActive ? "shell__nav-link shell__nav-link--active" : "shell__nav-link"
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shell__status-card">
          <span className="status-dot" />
          Backend-owned costing and restaurant-scoped access patterns are enabled in the scaffold.
        </div>
      </aside>

      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  );
}
