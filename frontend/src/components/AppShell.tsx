import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../lib/auth";

type NavigationIconProps = {
  className?: string;
};

function DashboardIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M3 3h6v6H3zM11 3h6v3h-6zM11 8h6v9h-6zM3 11h6v6H3z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function MenuIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M5 4h10M5 8h10M5 12h10M5 16h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function OrdersIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M6 4h8l2 3v9H4V7l2-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M4 7h12" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ReservationsIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M5 3v3M15 3v3M4 7h12M5 5h10a1 1 0 0 1 1 1v9H4V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function SuppliesIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M6 4h8v12H6z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 7h4M8 10h4M8 13h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function FloorLayoutIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="14" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="10" cy="14" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 7.5 9.5 12M12 7.5 10.5 12" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function SettingsIcon({ className }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path d="M10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 3v2M10 15v2M15 5l-1.4 1.4M6.4 13.6 5 15M17 10h-2M5 10H3M15 15l-1.4-1.4M6.4 6.4 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/menu", label: "Menu", icon: MenuIcon },
  { to: "/orders", label: "Orders", icon: OrdersIcon },
  { to: "/reservations", label: "Reservations", icon: ReservationsIcon },
  { to: "/supplies", label: "Supplies", icon: SuppliesIcon },
  { to: "/floor-layout", label: "Floor Layout", icon: FloorLayoutIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const pageMetadata: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Monitor service flow, margin signals, and team focus." },
  "/menu": { title: "Menu", subtitle: "Keep categories, items, and review workflows under control." },
  "/orders": { title: "Orders", subtitle: "Track live service pressure and operational throughput." },
  "/reservations": { title: "Reservations", subtitle: "Manage bookings and table demand without losing clarity." },
  "/supplies": { title: "Supplies", subtitle: "Maintain the source of truth for operational stock and cost inputs." },
  "/floor-layout": { title: "Floor Layout", subtitle: "Coordinate table placement and dining room readiness." },
  "/profile": { title: "Edit Profile", subtitle: "Update the account identity shown across the workspace." },
  "/account-settings": { title: "Account Settings", subtitle: "Review access posture and account-level controls." },
  "/notifications": { title: "Notifications", subtitle: "Tune alert visibility for critical operating signals." },
  "/subscription": { title: "Subscription & Billing", subtitle: "Manage plan status, payment details, and billing readiness." },
  "/configure": { title: "Configure System", subtitle: "Admin-only controls for users, roles, and system defaults." },
  "/settings": { title: "Settings", subtitle: "Inspect integration and tenancy-related environment state." },
};

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { displayName, isAdmin, role, user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentPage = useMemo(
    () => pageMetadata[location.pathname] ?? pageMetadata["/dashboard"],
    [location.pathname],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const profileMenuItems = [
    { label: "Edit Profile", path: "/profile", visible: true },
    { label: "Account Settings", path: "/account-settings", visible: true },
    { label: "Subscription & Billing", path: "/subscription", visible: true },
    { label: "Notifications", path: "/notifications", visible: true },
    { label: "Configure System", path: "/configure", visible: isAdmin },
  ];

  return (
    <div className={sidebarCollapsed ? "shell shell--collapsed" : "shell"}>
      <aside className="shell__sidebar">
        <div className="shell__sidebar-top">
          <button
            aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            className="shell__collapse-toggle"
            onClick={() => setSidebarCollapsed((current) => !current)}
            type="button"
          >
            {sidebarCollapsed ? ">" : "<"}
          </button>

          <div className="shell__brand">
            <p className="shell__eyebrow">Kitchen Operations</p>
            <h1 className="shell__title">Klug-K</h1>
            <p className="shell__subtitle">
              Admin tools for menu clarity, table control, and margin discipline.
            </p>
          </div>
        </div>

        <nav className="shell__nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }: NavLinkRenderProps) =>
                isActive ? "shell__nav-link shell__nav-link--active" : "shell__nav-link"
              }
              to={item.to}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="shell__nav-icon" />
              <span className="shell__nav-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shell__sidebar-footer">
          <div className="shell__status-card">
            <span className="status-dot" />
            Backend-owned costing and restaurant-scoped access patterns are enabled in the scaffold.
          </div>

          <div className="shell__account-card">
            <div>
              <p className="shell__account-label">Signed in as</p>
              <p className="shell__account-value">{user?.email ?? "Unknown account"}</p>
            </div>
            <button className="secondary-button shell__signout" onClick={() => void signOut()} type="button">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="shell__main">
        <header className="app-header">
          <div>
            <p className="app-header__eyebrow">Authenticated Workspace</p>
            <h2 className="app-header__title">{currentPage.title}</h2>
            <p className="app-header__subtitle">{currentPage.subtitle}</p>
          </div>

          <div className="profile-menu" ref={dropdownRef}>
            <button
              aria-expanded={menuOpen}
              className="profile-menu__trigger"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <span className="profile-menu__avatar">{displayName.slice(0, 1).toUpperCase() || "A"}</span>
              <span className="profile-menu__identity">
                <strong>{displayName}</strong>
                <span>{role}</span>
              </span>
            </button>

            {menuOpen ? (
              <div className="profile-menu__dropdown">
                {profileMenuItems
                  .filter((item) => item.visible)
                  .map((item) => (
                    <button
                      className="profile-menu__item"
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                <button
                  className="profile-menu__item profile-menu__item--danger"
                  onClick={() => {
                    setMenuOpen(false);
                    void signOut();
                  }}
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
