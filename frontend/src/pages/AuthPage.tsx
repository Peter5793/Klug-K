import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth, type AppRole } from "../lib/auth";

type AuthMode = "sign-in" | "sign-up";
type AccountRole = AppRole;

export function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [accountRole, setAccountRole] = useState<AccountRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSignUp = mode === "sign-up";

  if (user) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      if (mode === "sign-in") {
        await signIn(email, password);
        setMessage("Signed in. Redirecting to the admin workspace.");
      } else {
        await signUp({
          email,
          password,
          fullName,
          restaurantName,
          role: accountRole,
        });
        setMessage(
          "Account created. Check your email for the confirmation link. Admin accounts will see the optional system setup step after first login.",
        );
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <p className="auth-hero__eyebrow">Klug-K Access</p>
        <h1 className="auth-hero__title">Run the kitchen from one controlled admin surface.</h1>
        <p className="auth-hero__copy">
          Restaurant owners and admins can sign in or create an account here. The initial signup
          captures who you are, which restaurant you are setting up, and the intended access role.
        </p>

        <div className="auth-hero__grid">
          <article className="auth-callout">
            <span className="auth-callout__badge">1</span>
            <div>
              <h2>Authenticate with Supabase</h2>
              <p>Email and password auth is handled through your configured Supabase project.</p>
            </div>
          </article>
          <article className="auth-callout">
            <span className="auth-callout__badge">2</span>
            <div>
              <h2>Set up the restaurant account</h2>
              <p>
                Owners can start onboarding by capturing restaurant intent now, while backend
                membership and tenant setup continue server-side.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={isSignUp ? "auth-panel auth-panel--sign-up" : "auth-panel auth-panel--sign-in"}>
        <div className="auth-panel__tabs" role="tablist" aria-label="Authentication mode">
          <span aria-hidden="true" className="auth-panel__tab-indicator" />
          <button
            className={mode === "sign-in" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => setMode("sign-in")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={mode === "sign-up" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => setMode("sign-up")}
            type="button"
          >
            Set up account
          </button>
        </div>

        <form className={isSignUp ? "auth-form auth-form--sign-up" : "auth-form auth-form--sign-in"} onSubmit={handleSubmit}>
          <header className="auth-form__header">
            <p className="page-frame__eyebrow">Admin Access</p>
            <h2>{isSignUp ? "Create the restaurant admin account" : "Welcome back"}</h2>
            <p className="page-frame__subtitle">
              {isSignUp
                ? "Owners and managers can open the account here before completing tenant membership provisioning."
                : "Use the credentials connected to your Supabase project."}
            </p>
          </header>

          <div className={isSignUp ? "auth-mode-panel auth-mode-panel--open" : "auth-mode-panel"}>
            <div className="auth-mode-panel__inner">
              <label className="auth-field">
                <span>Full name</span>
                <input
                  autoComplete="name"
                  disabled={!isSignUp}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Alex Kitchen"
                  required={isSignUp}
                  type="text"
                  value={fullName}
                />
              </label>

              <label className="auth-field">
                <span>Restaurant name</span>
                <input
                  disabled={!isSignUp}
                  onChange={(event) => setRestaurantName(event.target.value)}
                  placeholder="Copper Spoon Berlin"
                  required={isSignUp}
                  type="text"
                  value={restaurantName}
                />
              </label>

              <fieldset className="auth-role-picker" disabled={!isSignUp}>
                <legend>Account type</legend>
                <label>
                  <input
                    checked={accountRole === "admin"}
                    name="accountRole"
                    onChange={() => setAccountRole("admin")}
                    type="radio"
                  />
                  Restaurant owner or admin
                </label>
                <label>
                  <input
                    checked={accountRole === "manager"}
                    name="accountRole"
                    onChange={() => setAccountRole("manager")}
                    type="radio"
                  />
                  Admin or manager
                </label>
                <label>
                  <input
                    checked={accountRole === "employee"}
                    name="accountRole"
                    onChange={() => setAccountRole("employee")}
                    type="radio"
                  />
                  Employee
                </label>
              </fieldset>

              <div className={isSignUp && accountRole === "admin" ? "auth-inline-note auth-inline-note--visible" : "auth-inline-note"}>
                <strong>Optional next step:</strong> after first login, admins can set up the system,
                add employees, and configure operating defaults. This step is skippable.
              </div>
            </div>
          </div>

          <label className="auth-field">
            <span>Email address</span>
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="owner@restaurant.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
          {message ? <p className="auth-feedback auth-feedback--success">{message}</p> : null}

          <button className="primary-button auth-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Working..."
              : mode === "sign-in"
                ? "Sign in to admin"
                : "Create admin account"}
          </button>
        </form>
      </section>
    </div>
  );
}
