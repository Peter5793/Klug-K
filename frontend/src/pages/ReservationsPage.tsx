import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";
import { useApiResource } from "../lib/useApiResource";

type Reservation = {
  id: string;
  customer_name: string;
  guest_count: number;
  start_time: string;
  status: string | null;
  table_name: string | null;
};

export function ReservationsPage() {
  const { data, error, refresh } = useApiResource<Reservation[]>("/reservations/");

  return (
    <PageFrame
      title="Reservations"
      subtitle="Front-of-house visibility without losing the kitchen’s view of the day."
      actions={<button className="secondary-button" onClick={() => void refresh()}>Refresh Reservations</button>}
    >
      <div className="card-grid">
        <InfoCard label="Coverage" title="Daily booking overview">
          {error ? <p>{error}</p> : data ? (
            <ul className="list-clean">
              {data.slice(0, 5).map((reservation) => (
                <li key={reservation.id}>{reservation.customer_name} for {reservation.guest_count} at {new Date(reservation.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</li>
              ))}
            </ul>
          ) : <p>Loading reservations...</p>}
        </InfoCard>
        <InfoCard label="Operations" title="Linked to floor planning">
          {data ? (
            <ul className="list-clean">
              {data.slice(0, 4).map((reservation) => (
                <li key={reservation.id}>{reservation.table_name ?? "Unassigned table"}: {reservation.status ?? "pending"}</li>
              ))}
            </ul>
          ) : <p>Reservation handling should coordinate with table availability and layout context.</p>}
        </InfoCard>
      </div>
    </PageFrame>
  );
}
