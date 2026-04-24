import { InfoCard } from "../components/InfoCard";
import { PageFrame } from "../components/PageFrame";

export function MenuPage() {
  return (
    <PageFrame
      title="Menu Management"
      subtitle="Category structure, item composition, allergen visibility, and controlled AI review."
      actions={<button className="secondary-button">Review Uploads</button>}
    >
      <div className="card-grid">
        <InfoCard label="Categories" title="Restaurant-scoped catalog">
          <p>Menu items should be filtered by the active restaurant and grouped by menu_categories.</p>
        </InfoCard>
        <InfoCard label="Costing" title="Backend-derived only">
          <p>
            Menu costs come from supplies and menu_item_ingredients on the backend. The UI only
            presents the result.
          </p>
        </InfoCard>
        <InfoCard label="Allergens" title="Operational clarity">
          <p>Allergen data stays attached to items through menu_allergens for safe service flow.</p>
        </InfoCard>
      </div>
    </PageFrame>
  );
}
