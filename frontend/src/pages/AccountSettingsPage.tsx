import { PageFrame } from "../components/PageFrame";
import { useAuth } from "../lib/auth";

export function AccountSettingsPage() {
  const { role, restaurantName } = useAuth();

  return (
    <PageFrame
      title="Account Settings"
      subtitle="Review the active access level, workspace assignment, and authentication posture."
    >
      <div className="card-grid">
        <section className="settings-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Access</p>
            <h3>Role and workspace</h3>
          </div>
          <p className="settings-copy">Current role: {role}</p>
          <p className="settings-copy">Restaurant workspace: {restaurantName || "Unassigned"}</p>
        </section>
        <section className="settings-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Security</p>
            <h3>Authentication notes</h3>
          </div>
          <p className="settings-copy">
            Email/password authentication is handled by Supabase. Sensitive access changes still
            require backend enforcement on protected routes.
          </p>
        </section>
      </div>
    </PageFrame>
  );
}
