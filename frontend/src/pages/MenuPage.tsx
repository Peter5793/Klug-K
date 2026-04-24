import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";
import { useApiResource } from "../lib/useApiResource";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  currency: string | null;
  is_available: boolean | null;
  category: { id: string; name: string; sort_order: number | null } | null;
  allergens: Array<{ id: string; label: string | null }>;
};

type MenuUpload = {
  id: string;
  file_url: string;
  status: string | null;
  extraction_results: Array<{ id: string; reviewed: boolean | null }>;
};

export function MenuPage() {
  const itemsState = useApiResource<MenuItem[]>("/menu/items/");
  const uploadsState = useApiResource<MenuUpload[]>("/menu/uploads/");
  const availableCount = itemsState.data?.filter((item) => item.is_available).length ?? 0;

  return (
    <PageFrame
      title="Menu Management"
      subtitle="Category structure, item composition, allergen visibility, and controlled AI review."
      actions={<button className="secondary-button" onClick={() => void uploadsState.refresh()}>Review Uploads</button>}
    >
      <div className="card-grid">
        <InfoCard label="Categories" title="Restaurant-scoped catalog">
          {itemsState.error ? <p>{itemsState.error}</p> : null}
          {itemsState.data ? (
            <ul className="list-clean">
              {itemsState.data.slice(0, 5).map((item) => (
                <li key={item.id}>{item.category?.name ?? "Uncategorized"}: {item.name}</li>
              ))}
            </ul>
          ) : <p>Loading menu items...</p>}
        </InfoCard>
        <InfoCard label="Costing" title="Backend-derived only">
          <div className="metric-stack">
            <div className="metric-row"><span>Total items</span><strong>{itemsState.data?.length ?? 0}</strong></div>
            <div className="metric-row"><span>Available now</span><strong>{availableCount}</strong></div>
          </div>
        </InfoCard>
        <InfoCard label="Allergens" title="Operational clarity">
          {itemsState.data?.length ? (
            <ul className="list-clean">
              {itemsState.data.slice(0, 4).map((item) => (
                <li key={item.id}>{item.name}: {item.allergens.map((allergen) => allergen.label ?? "Unknown").join(", ") || "No allergens listed"}</li>
              ))}
            </ul>
          ) : (
            <p>{uploadsState.data ? `Uploads awaiting completion: ${uploadsState.data.filter((upload) => upload.status !== "completed").length}` : "Allergen data stays attached to items through menu_allergens for safe service flow."}</p>
          )}
        </InfoCard>
      </div>
    </PageFrame>
  );
}
