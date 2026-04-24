import { useState } from "react";

import { PageFrame } from "../components/PageFrame";
import { useAuth } from "../lib/auth";

export function SubscriptionPage() {
  const { restaurantName, user } = useAuth();
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingEmail, setBillingEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState<string | null>(null);

  function handlePaymentSave() {
    setMessage("Subscription details captured. Connect this action to your payment processor checkout or billing API.");
  }

  return (
    <PageFrame
      title="Subscription & Billing"
      subtitle="Review the active plan, maintain billing details, and prepare the workspace for recurring subscription payments."
    >
      <div className="card-grid card-grid--wide subscription-layout">
        <section className="settings-panel subscription-plan-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Active Plan</p>
            <h3>Growth kitchen suite</h3>
          </div>
          <p className="subscription-price">EUR 89<span>/month</span></p>
          <p className="settings-copy">
            Designed for a single restaurant team that needs menu control, reservations, supplies, and service visibility in one admin surface.
          </p>
          <div className="subscription-plan-list">
            <p className="subscription-plan-item">Restaurant workspace: {restaurantName || "Pending assignment"}</p>
            <p className="subscription-plan-item">Included admin seats: 5</p>
            <p className="subscription-plan-item">Billing cycle: Monthly recurring</p>
            <p className="subscription-plan-item">Renewal window: Auto-renews every 30 days</p>
          </div>
        </section>

        <section className="settings-panel subscription-payment-panel">
          <div className="settings-panel__header">
            <p className="page-frame__eyebrow">Payment Method</p>
            <h3>Add or replace card</h3>
          </div>

          <div className="settings-grid">
            <label className="auth-field">
              <span>Cardholder name</span>
              <input
                onChange={(event) => setCardholderName(event.target.value)}
                placeholder="Alex Kitchen"
                type="text"
                value={cardholderName}
              />
            </label>

            <label className="auth-field">
              <span>Billing email</span>
              <input
                onChange={(event) => setBillingEmail(event.target.value)}
                placeholder="billing@restaurant.com"
                type="email"
                value={billingEmail}
              />
            </label>

            <label className="auth-field subscription-field-wide">
              <span>Card number</span>
              <input
                inputMode="numeric"
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="1234 5678 9012 3456"
                type="text"
                value={cardNumber}
              />
            </label>

            <label className="auth-field">
              <span>Expiry date</span>
              <input
                inputMode="numeric"
                onChange={(event) => setExpiryDate(event.target.value)}
                placeholder="MM/YY"
                type="text"
                value={expiryDate}
              />
            </label>

            <label className="auth-field">
              <span>CVC</span>
              <input
                inputMode="numeric"
                onChange={(event) => setCvc(event.target.value)}
                placeholder="123"
                type="text"
                value={cvc}
              />
            </label>
          </div>

          <div className="subscription-note">
            <p className="settings-copy">
              Wire this form to Stripe Checkout, Stripe Elements, or your preferred PCI-compliant billing provider before taking production payments.
            </p>
          </div>

          {message ? <p className="auth-feedback auth-feedback--success">{message}</p> : null}

          <div className="settings-actions">
            <button className="secondary-button" type="button">Download invoice sample</button>
            <button className="primary-button" onClick={handlePaymentSave} type="button">Save payment details</button>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}