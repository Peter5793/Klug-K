import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

export function OrdersPage() {
  return (
    <PageFrame
      title="Orders"
      subtitle="Track service flow, line pressure, and revenue-driving activity from backend events."
      actions={<button className="primary-button">New Order</button>}
    >
      <div className="card-grid">
        <InfoCard label="Scope" title="Restaurant inferred from auth">
          <p>Orders should never rely on client-supplied restaurant identifiers.</p>
        </InfoCard>
        <InfoCard label="Revenue" title="Derived from order_items">
          <p>Consumption and sales analytics are calculated in the backend from the order stream.</p>
        </InfoCard>
        <InfoCard label="Workflow" title="Kitchen-first pacing">
          <p>Keep the view optimized for dispatch, state changes, and exceptions during service.</p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
