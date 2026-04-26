import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";
import { useApiResource } from "../lib/useApiResource";

type TableLayout = {
  id: string;
  name: string;
  is_active: boolean | null;
  items: Array<{ id: string; table: { id: string; name: string; capacity: number } | null }>;
};

export function FloorLayoutPage() {
  const { data, error, refresh } = useApiResource<TableLayout[]>("/floor/layouts/");
  const activeLayout = data?.find((layout) => layout.is_active) ?? null;

  return (
    <PageFrame
      title="Floor Layout"
      subtitle="Coordinate physical tables, seating flow, and service reality without visual clutter."
      actions={<button className="secondary-button" onClick={() => void refresh()}>Refresh Layouts</button>}
    >
      <div className="card-grid">
        <InfoCard label="Tables" title="Physical service units">
          {error ? <p>{error}</p> : activeLayout ? <p>{activeLayout.items.length} tables are placed in the active layout.</p> : <p>Loading layouts...</p>}
        </InfoCard>
        <InfoCard label="Coordinates" title="Placement driven by layout items">
          {data?.length ? (
            <ul className="list-clean">
              {data.map((layout) => (
                <li key={layout.id}>{layout.name}: {layout.items.map((item) => item.table?.name).filter(Boolean).join(", ") || "No tables placed"}</li>
              ))}
            </ul>
          ) : <p>Table coordinates and placement belong to table_layout_items, not to ad hoc UI state.</p>}
        </InfoCard>
      </div>
    </PageFrame>
  );
}
