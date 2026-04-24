import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

export function ReservationsPage() {
  return (
    <PageFrame
      title="Reservations"
      subtitle="Front-of-house visibility without losing the kitchen’s view of the day."
      actions={<button className="secondary-button">Add Reservation</button>}
    >
      <div className="card-grid">
        <InfoCard label="Coverage" title="Daily booking overview">
          <p>Present the service load by time slot and table demand, scoped to one restaurant.</p>
        </InfoCard>
        <InfoCard label="Operations" title="Linked to floor planning">
          <p>Reservation handling should coordinate with table availability and layout context.</p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
