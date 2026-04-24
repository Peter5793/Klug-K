import { useState } from "react";

import { PageFrame } from "../components/PageFrame";
import { useAuth } from "../lib/auth";

export function ProfilePage() {
  const { displayName, user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(displayName);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave() {
    try {
      await updateProfile({ fullName });
      setMessage("Profile updated.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update profile.");
    }
  }

  return (
    <PageFrame title="Edit Profile" subtitle="Update the core account identity used across the admin workspace.">
      <section className="settings-panel settings-panel--narrow">
        <div className="settings-grid">
          <label className="auth-field">
            <span>Full name</span>
            <input onChange={(event) => setFullName(event.target.value)} type="text" value={fullName} />
          </label>
          <label className="auth-field">
            <span>Email address</span>
            <input disabled type="email" value={user?.email ?? ""} />
          </label>
        </div>
        {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
        {message ? <p className="auth-feedback auth-feedback--success">{message}</p> : null}
        <button className="primary-button" onClick={() => void handleSave()} type="button">
          Save profile
        </button>
      </section>
    </PageFrame>
  );
}
