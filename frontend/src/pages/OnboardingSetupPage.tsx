import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function emptyEmployee(): Omit<EmployeeRecord, "id" | "active"> {
  return {
    name: "",
    email: "",
    role: "employee",
    department: "",
  };
}

export function OnboardingSetupPage() {
  const navigate = useNavigate();
  const { user, displayName, restaurantName, completeAdminSetup, skipAdminSetup } = useAuth();
  const [draftEmployee, setDraftEmployee] = useState(emptyEmployee());
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const userId = user?.id ?? "";
  const userEmail = user?.email ?? "";

  const [configuration, setConfiguration] = useState<AdminConfiguration>(() =>
    loadAdminConfiguration(userId, userEmail, displayName, restaurantName),
  );

  const employeeCountLabel = useMemo(
    () => `${configuration.employees.filter((employee) => employee.active).length} active team members`,
    [configuration.employees],
  );

  function updateConfiguration(next: AdminConfiguration) {
    setConfiguration(next);
  }

  function addEmployee() {
    if (!draftEmployee.name || !draftEmployee.email) {
      setErrorMessage("Employee name and email are required before adding them.");
      return;
    }

    const nextConfiguration = appendAdminActionLog(
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
      userEmail,
      "Added employee",
      `${draftEmployee.name} was added as ${draftEmployee.role}.`,
    );

    updateConfiguration(nextConfiguration);
    setDraftEmployee(emptyEmployee());
    setErrorMessage(null);
  }

  async function handleSkip() {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await skipAdminSetup();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to skip setup.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleComplete() {
    setIsSaving(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      const nextConfiguration = appendAdminActionLog(
        configuration,
        userEmail,
        "Completed onboarding setup",
        "Saved organization details, employees, and basic operating preferences.",
      );

      saveAdminConfiguration(userId, nextConfiguration);
      await completeAdminSetup();
      setMessage("System setup saved. Redirecting to the admin workspace.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to complete setup.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageFrame
      title="Set up your system"
      subtitle="Optional for admins. Use safe defaults now and return later from the profile menu if needed."
      actions={
        <button className="secondary-button" onClick={() => void handleSkip()} type="button">
          Skip for now
        </button>
      }
    >
      <div className="card-grid card-grid--wide">
        <section className="settings-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Organization</p>
            <h3>Kitchen details</h3>
          </div>
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
          </div>
        </section>

        <section className="settings-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Initial Team</p>
            <h3>{employeeCountLabel}</h3>
          </div>
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
                  setDraftEmployee((current) => ({
                    ...current,
                    role: event.target.value as UserRole,
                  }))
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
        </section>

        <section className="settings-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Defaults</p>
            <h3>Basic system preferences</h3>
          </div>
          <div className="settings-grid settings-grid--compact">
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
            <label className="toggle-field">
              <input
                checked={configuration.preferences.autoAcceptReservations}
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    preferences: {
                      ...configuration.preferences,
                      autoAcceptReservations: event.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              Auto-accept reservations
            </label>
            <label className="toggle-field">
              <input
                checked={configuration.preferences.lowStockAlerts}
                onChange={(event) =>
                  updateConfiguration({
                    ...configuration,
                    preferences: {
                      ...configuration.preferences,
                      lowStockAlerts: event.target.checked,
                    },
                  })
                }
                type="checkbox"
              />
              Low-stock alerts
            </label>
          </div>
        </section>
      </div>

      {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
      {message ? <p className="auth-feedback auth-feedback--success">{message}</p> : null}

      <div className="settings-actions">
        <button className="secondary-button" onClick={() => void handleSkip()} type="button">
          Explicitly skip
        </button>
        <button className="primary-button" disabled={isSaving} onClick={() => void handleComplete()} type="button">
          Save setup
        </button>
      </div>
    </PageFrame>
  );
}
