# Klug-K

Production-oriented monorepo scaffold for a kitchen and gastro administration SaaS.

## Principles baked into the structure

- Restaurant is the tenant boundary.
- Existing Supabase tables remain the single source of truth.
- Backend owns business logic for costing, margins, deltas, and authorization.
- Frontend is an admin tool that consumes derived backend APIs.

## Repository layout

```text
backend/   Django + Django REST Framework API
frontend/  React admin application
```

## Important implementation note

The Supabase table names are known, but the column definitions are not available in this repository yet. To avoid inventing schema details, the backend has been structured so Django models can be generated from the live database and then mapped into the existing apps without renaming tables or introducing shadow tables.

Recommended next step once the Supabase connection details are available:

```bash
cd backend
python manage.py inspectdb restaurants restaurant_users menu_categories menu_items menu_item_ingredients menu_allergens menu_uploads menu_extraction_results orders order_items reservations supplies tables table_layouts table_layout_items
```

Then split the generated models into the app modules under `backend/apps/` while preserving `Meta.db_table` values and restaurant scoping rules.

## Local development

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -e .[dev]
copy .env.example .env
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Delivery intent

This scaffold is designed to support:

- restaurant-scoped APIs
- Supabase JWT authentication integration
- service-led business logic
- React admin workflows for Dashboard, Menu, Orders, Reservations, Supplies, Floor Layout, and Settings
