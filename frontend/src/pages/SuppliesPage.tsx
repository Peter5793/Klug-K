import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

export function SuppliesPage() {
  return (
    <PageFrame
      title="Supplies"
      subtitle="Price discipline starts here because every menu margin depends on supply truth."
      actions={<button className="primary-button">Add Supply</button>}
    >
      <div className="card-grid">
        <InfoCard label="Pricing" title="Single source for unit cost">
          <p>Backend services should pull supply prices directly from the supplies table.</p>
        </InfoCard>
        <InfoCard label="Impact" title="Margin visibility downstream">
          <p>Changes here should cascade into menu costing and margin summaries at runtime.</p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
