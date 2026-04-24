import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

export function FloorLayoutPage() {
  return (
    <PageFrame
      title="Floor Layout"
      subtitle="Coordinate physical tables, seating flow, and service reality without visual clutter."
      actions={<button className="secondary-button">Edit Layout</button>}
    >
      <div className="card-grid">
        <InfoCard label="Tables" title="Physical service units">
          <p>Use tables as the operational anchor and layouts as selectable configurations.</p>
        </InfoCard>
        <InfoCard label="Coordinates" title="Placement driven by layout items">
          <p>Table coordinates and placement belong to table_layout_items, not to ad hoc UI state.</p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
