import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";
import { useApiResource } from "../lib/useApiResource";

type Order = {
  id: string;
  order_type: string | null;
  status: string | null;
  created_at: string | null;
  items: Array<{ id: string; menu_item_name: string | null; quantity: number; price_at_order: string }>;
};

export function OrdersPage() {
  const { data, error, refresh } = useApiResource<Order[]>("/orders/");

  return (
    <PageFrame
      title="Orders"
      subtitle="Track service flow, line pressure, and revenue-driving activity from backend events."
      actions={<button className="primary-button" onClick={() => void refresh()}>Refresh Orders</button>}
    >
      <div className="card-grid">
        <InfoCard label="Scope" title="Restaurant inferred from auth">
          {error ? <p>{error}</p> : <p>{data ? `${data.length} orders loaded from the restaurant-scoped backend endpoint.` : "Loading orders..."}</p>}
        </InfoCard>
        <InfoCard label="Revenue" title="Derived from order_items">
          {data ? (
            <ul className="list-clean">
              {data.slice(0, 4).map((order) => (
                <li key={order.id}>{order.status ?? "pending"}: {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</li>
              ))}
            </ul>
          ) : <p>Consumption and sales analytics are calculated in the backend from the order stream.</p>}
        </InfoCard>
        <InfoCard label="Workflow" title="Kitchen-first pacing">
          {data?.length ? (
            <ul className="list-clean">
              {data.slice(0, 3).map((order) => (
                <li key={order.id}>{order.order_type ?? "service"} order with {order.items.map((item) => item.menu_item_name).filter(Boolean).join(", ") || "no item names"}</li>
              ))}
            </ul>
          ) : <p>Keep the view optimized for dispatch, state changes, and exceptions during service.</p>}
        </InfoCard>
      </div>
    </PageFrame>
  );
}
