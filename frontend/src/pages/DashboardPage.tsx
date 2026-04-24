import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

const priorities = [
  "Monitor order flow and table pressure in one place.",
  "Review margins from backend-derived costing, never manual entry.",
  "Surface menu upload review tasks that still need human confirmation.",
];

export function DashboardPage() {
  return (
    <PageFrame
      title="Operational Dashboard"
      subtitle="A compact control surface for the day, centered on action rather than charts."
      actions={<button className="primary-button">Refresh Summary</button>}
    >
      <div className="card-grid card-grid--wide">
        <InfoCard label="Daily Rhythm" title="Shift priorities">
          <ul className="list-clean">
            {priorities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard label="Backend Truth" title="Awaiting live metrics">
          <p>
            Revenue, cost, margin, and delta figures should load from
            the dashboard summary endpoint once the Supabase-backed models are mapped.
          </p>
        </InfoCard>

        <InfoCard label="Attention Queue" title="Human review still required">
          <p>
            AI extraction can suggest menu updates, but no production data should change without
            explicit confirmation by staff.
          </p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
