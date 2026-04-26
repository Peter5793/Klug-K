import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";
import { useApiResource } from "../lib/useApiResource";

type Supply = {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  current_stock: string | null;
  low_stock_threshold: string | null;
};

export function SuppliesPage() {
  const { data, error, refresh } = useApiResource<Supply[]>("/supplies/");
  const lowStockItems =
    data?.filter((supply) => Number(supply.current_stock ?? 0) <= Number(supply.low_stock_threshold ?? 0)) ?? [];

  return (
    <PageFrame
      title="Supplies"
      subtitle="Price discipline starts here because every menu margin depends on supply truth."
      actions={<button className="primary-button" onClick={() => void refresh()}>Refresh Supplies</button>}
    >
      <div className="card-grid">
        <InfoCard label="Pricing" title="Single source for unit cost">
          {error ? <p>{error}</p> : <p>{data ? `${data.length} supplies are available from the backend.` : "Loading supplies..."}</p>}
        </InfoCard>
        <InfoCard label="Impact" title="Margin visibility downstream">
          {lowStockItems.length ? (
            <ul className="list-clean">
              {lowStockItems.slice(0, 5).map((supply) => (
                <li key={supply.id}>{supply.name}: {supply.current_stock ?? "0"} {supply.unit ?? "units"}</li>
              ))}
            </ul>
          ) : <p>Changes here should cascade into menu costing and margin summaries at runtime.</p>}
        </InfoCard>
      </div>
    </PageFrame>
  );
}
