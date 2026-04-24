import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

export function SettingsPage() {
  return (
    <PageFrame
      title="Settings"
      subtitle="Environment, integration, and access boundaries for restaurant-scoped operations."
    >
      <div className="card-grid">
        <InfoCard label="Authentication" title="Supabase JWT integration">
          <p>Configure backend verification against Supabase tokens and map membership through restaurant_users.</p>
        </InfoCard>
        <InfoCard label="Tenancy" title="Restaurant-scoped access">
          <p>Every protected query and mutation must resolve the restaurant from authenticated membership.</p>
        </InfoCard>
        <InfoCard label="Deployment" title="Production posture">
          <p>Separate environment files, secure Django settings, and backend-owned business logic are in place.</p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
