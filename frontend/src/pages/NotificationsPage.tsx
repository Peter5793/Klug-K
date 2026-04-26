import { useState } from "react";

import { PageFrame } from "../components/PageFrame";

export function NotificationsPage() {
  const [states, setStates] = useState({
    orderIncidents: true,
    reservationChanges: true,
    lowStock: true,
  });

  return (
    <PageFrame
      title="Notifications"
      subtitle="Control the operational alerts shown to this account in the admin workspace."
    >
      <section className="settings-panel settings-panel--narrow">
        <div className="settings-grid settings-grid--compact">
          <label className="toggle-field">
            <input
              checked={states.orderIncidents}
              onChange={(event) => setStates((current) => ({ ...current, orderIncidents: event.target.checked }))}
              type="checkbox"
            />
            Order incident alerts
          </label>
          <label className="toggle-field">
            <input
              checked={states.reservationChanges}
              onChange={(event) =>
                setStates((current) => ({ ...current, reservationChanges: event.target.checked }))
              }
              type="checkbox"
            />
            Reservation change notifications
          </label>
          <label className="toggle-field">
            <input
              checked={states.lowStock}
              onChange={(event) => setStates((current) => ({ ...current, lowStock: event.target.checked }))}
              type="checkbox"
            />
            Low-stock warnings
          </label>
        </div>
      </section>
    </PageFrame>
  );
}
