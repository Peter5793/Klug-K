import { useMemo, useState } from "react";

import { PageFrame } from "../components/PageFrame";
import {
  appendAdminActionLog,
  loadAdminConfiguration,
  saveAdminConfiguration,
  type AdminConfiguration,
  type EmployeeRecord,
  type UserRole,
} from "../lib/adminConfig";
import { useAuth } from "../lib/auth";

function buildEmptyEmployee(): Omit<EmployeeRecord, "id" | "active"> {
  return {
    name: "",
    email: "",
    role: "employee",
    department: "",
  };
}

type ConfigureSectionProps = {
  eyebrow: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function ConfigureSection({ eyebrow, title, defaultOpen = true, children }: ConfigureSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="settings-panel settings-panel--collapsible">
      <button
        aria-expanded={isOpen}
        className="settings-panel__toggle"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="settings-panel__header">
          <p className="page-frame__eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <span className={isOpen ? "settings-panel__chevron settings-panel__chevron--open" : "settings-panel__chevron"}>
          ▾
        </span>
      </button>

      <div className={isOpen ? "settings-panel__body-wrap settings-panel__body-wrap--open" : "settings-panel__body-wrap"}>
        <div className="settings-panel__body">{children}</div>
      </div>
    </section>
  );
}

export function ConfigurePage() {
  const { user, displayName, restaurantName } = useAuth();
  const userId = user?.id ?? "";
  const userEmail = user?.email ?? "";
  const [draftEmployee, setDraftEmployee] = useState(buildEmptyEmployee());
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configuration, setConfiguration] = useState<AdminConfiguration>(() =>
    loadAdminConfiguration(userId, userEmail, displayName, restaurantName),
  );

  const activeEmployees = useMemo(
    () => configuration.employees.filter((employee) => employee.active),
    [configuration.employees],
  );

  function updateConfiguration(next: AdminConfiguration) {
    setConfiguration(next);
    setMessage(null);
  }

  function persistConfiguration(next: AdminConfiguration, action: string, details: string) {
    const loggedConfiguration = appendAdminActionLog(next, userEmail, action, details);
    saveAdminConfiguration(userId, loggedConfiguration);
    setConfiguration(loggedConfiguration);
    setMessage("Configuration saved.");
    setErrorMessage(null);
  }

  function addEmployee() {
    if (!draftEmployee.name || !draftEmployee.email) {
      setErrorMessage("Employee name and email are required.");
      return;
    }

    persistConfiguration(
      {
        ...configuration,
        employees: [
          ...configuration.employees,
          {
            id: crypto.randomUUID(),
            active: true,
            ...draftEmployee,
          },
        ],
      },
      "Added employee",
      `${draftEmployee.name} was added to ${draftEmployee.department || "operations"}.`,
    );
    setDraftEmployee(buildEmptyEmployee());
  }

  function updateEmployee(employeeId: string, field: keyof EmployeeRecord, value: string | boolean) {
    const nextConfiguration = {
      ...configuration,
      employees: configuration.employees.map((employee) =>
        employee.id === employeeId ? { ...employee, [field]: value } : employee,
      ),
    };

    updateConfiguration(nextConfiguration);
  }

  function deactivateEmployee(employee: EmployeeRecord) {
    if (!window.confirm(`Deactivate ${employee.name}? They will lose access to the active roster.`)) {
      return;
    }

    persistConfiguration(
      {
        ...configuration,
        employees: configuration.employees.map((current) =>
          current.id === employee.id ? { ...current, active: false } : current,
        ),
      },
      "Deactivated employee",
      `${employee.name} was deactivated from the system roster.`,
    );
  }

  function saveAll() {
    persistConfiguration(
      configuration,
      "Updated system configuration",
      "Changed organization settings, role assignments, or operational defaults.",
    );
  }

  return (
    <PageFrame
      title="Configure System"
      subtitle="Admin-only controls for users, roles, defaults, feature flags, and audit history."
      actions={<button className="primary-button" onClick={saveAll}>Save changes</button>}
    >
      <div className="settings-stack">
        <ConfigureSection eyebrow="Organization" title="Kitchen identity and defaults">
          <div className="settings-grid">
            <label className="auth-field">
              <span>Organization name</span>
              <input
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    organizationName: event.target.value,
                  })
                }
                type="text"
                value={configuration.organizationName}
              />
            </label>
            <label className="auth-field">
              <span>Kitchen name</span>
              <input
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    kitchenName: event.target.value,
                  })
                }
                type="text"
                value={configuration.kitchenName}
              />
            </label>
            <label className="auth-field">
              <span>Default prep lead time (minutes)</span>
              <input
                min={5}
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    preferences: {
                      ...configuration.preferences,
                      defaultPreparationLeadMinutes: Number(event.target.value),
                    },
                  })
                }
                type="number"
                value={configuration.preferences.defaultPreparationLeadMinutes}
              />
            </label>
          </div>
        </ConfigureSection>

        <ConfigureSection eyebrow="Users & Employees" title={`${activeEmployees.length} active employees`}>
          <div className="settings-grid settings-grid--compact">
            <label className="auth-field">
              <span>Name</span>
              <input
                onChange={(event) => setDraftEmployee((current) => ({ ...current, name: event.target.value }))}
                type="text"
                value={draftEmployee.name}
              />
            </label>
            <label className="auth-field">
              <span>Email</span>
              <input
                onChange={(event) => setDraftEmployee((current) => ({ ...current, email: event.target.value }))}
                type="email"
                value={draftEmployee.email}
              />
            </label>
            <label className="auth-field">
              <span>Role</span>
              <select
                onChange={(event) =>
                  setDraftEmployee((current) => ({ ...current, role: event.target.value as UserRole }))
                }
                value={draftEmployee.role}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </label>
            <label className="auth-field">
              <span>Department</span>
              <input
                onChange={(event) =>
                  setDraftEmployee((current) => ({ ...current, department: event.target.value }))
                }
                type="text"
                value={draftEmployee.department}
              />
            </label>
          </div>
          <button className="secondary-button" onClick={addEmployee} type="button">
            Add employee
          </button>

          <div className="data-table">
            <div className="data-table__row data-table__row--header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Department</span>
              <span>Actions</span>
            </div>
            {configuration.employees.map((employee) => (
              <div className="data-table__row" key={employee.id}>
                <input
                  className="table-input"
                  onChange={(event) => updateEmployee(employee.id, "name", event.target.value)}
                  type="text"
                  value={employee.name}
                />
                <input
                  className="table-input"
                  onChange={(event) => updateEmployee(employee.id, "email", event.target.value)}
                  type="email"
                  value={employee.email}
                />
                <select
                  className="table-input"
                  onChange={(event) => updateEmployee(employee.id, "role", event.target.value)}
                  value={employee.role}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
                <input
                  className="table-input"
                  onChange={(event) => updateEmployee(employee.id, "department", event.target.value)}
                  type="text"
                  value={employee.department}
                />
                <div className="table-actions">
                  <span className={employee.active ? "status-pill status-pill--success" : "status-pill"}>
                    {employee.active ? "Active" : "Inactive"}
                  </span>
                  {employee.active ? (
                    <button className="table-link table-link--danger" onClick={() => deactivateEmployee(employee)} type="button">
                      Deactivate
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </ConfigureSection>

        <ConfigureSection eyebrow="Feature Toggles" title="Operational rules">
          <div className="settings-grid settings-grid--compact">
            <label className="toggle-field">
              <input
                checked={configuration.featureToggles.menuExtractionReview}
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    featureToggles: {
                      ...configuration.featureToggles,
                      menuExtractionReview: event.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              Menu extraction review required
            </label>
            <label className="toggle-field">
              <input
                checked={configuration.featureToggles.floorLayoutEditing}
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    featureToggles: {
                      ...configuration.featureToggles,
                      floorLayoutEditing: event.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              Floor layout editing enabled
            </label>
            <label className="toggle-field">
              <input
                checked={configuration.featureToggles.reservationNotifications}
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    featureToggles: {
                      ...configuration.featureToggles,
                      reservationNotifications: event.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              Reservation notifications enabled
            </label>
          </div>
        </ConfigureSection>

        <ConfigureSection eyebrow="Audit Trail" title="Admin action log" defaultOpen={false}>
          {configuration.actionLog.length === 0 ? (
            <div className="empty-state">
              <h4>No admin actions logged yet</h4>
              <p>Once admins change roles, employees, or settings, entries appear here.</p>
            </div>
          ) : (
            <div className="audit-log">
              {configuration.actionLog.map((entry) => (
                <article className="audit-log__entry" key={entry.id}>
                  <div>
                    <h4>{entry.action}</h4>
                    <p>{entry.details}</p>
                  </div>
                  <div className="audit-log__meta">
                    <span>{entry.actor}</span>
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </ConfigureSection>
      </div>

      {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
      {message ? <p className="auth-feedback auth-feedback--success">{message}</p> : null}
    </PageFrame>
  );
}
