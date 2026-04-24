import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";
import { useApiResource } from "../lib/useApiResource";

const priorities = [
  "Monitor order flow and table pressure in one place.",
  "Review margins from backend-derived costing, never manual entry.",
  "Surface menu upload review tasks that still need human confirmation.",
];

type DashboardSummary = {
  restaurant_id: string;
  menu_item_count: number;
  active_menu_item_count: number;
  order_count: number;
  reservation_count: number;
  supply_count: number;
  active_layout_count: number;
  pending_menu_upload_count: number;
  total_order_revenue: string;
};

export function DashboardPage() {
  const { data, error, isLoading, refresh } = useApiResource<DashboardSummary>("/dashboard/summary/");

  return (
    <PageFrame
      title="Operational Dashboard"
      subtitle="A compact control surface for the day, centered on action rather than charts."
      actions={<button className="primary-button" onClick={() => void refresh()}>Refresh Summary</button>}
    >
      <div className="card-grid card-grid--wide">
        <InfoCard label="Daily Rhythm" title="Shift priorities">
          <ul className="list-clean">
            {priorities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard label="Backend Truth" title={isLoading ? "Loading live metrics..." : "Live metrics"}>
          {error ? <p>{error}</p> : null}
          {data ? (
            <div className="metric-stack">
              <div className="metric-row"><span>Revenue</span><strong>{data.total_order_revenue}</strong></div>
              <div className="metric-row"><span>Orders</span><strong>{data.order_count}</strong></div>
              <div className="metric-row"><span>Reservations</span><strong>{data.reservation_count}</strong></div>
              <div className="metric-row"><span>Menu items</span><strong>{data.menu_item_count}</strong></div>
            </div>
          ) : null}
        </InfoCard>

        <InfoCard label="Attention Queue" title="Human review still required">
          {data ? (
            <div className="metric-stack">
              <div className="metric-row"><span>Pending upload reviews</span><strong>{data.pending_menu_upload_count}</strong></div>
              <div className="metric-row"><span>Active layouts</span><strong>{data.active_layout_count}</strong></div>
              <div className="metric-row"><span>Supplies tracked</span><strong>{data.supply_count}</strong></div>
            </div>
          ) : (
            <p>AI extraction can suggest menu updates, but no production data should change without explicit confirmation by staff.</p>
          )}
        </InfoCard>
      </div>
    </PageFrame>
  );
}
