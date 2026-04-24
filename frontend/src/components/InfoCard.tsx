import { ReactNode } from "react";

type InfoCardProps = {
  label: string;
  title: string;
  children: ReactNode;
};

export function InfoCard({ label, title, children }: InfoCardProps) {
  return (
    <article className="info-card">
      <p className="info-card__label">{label}</p>
      <h3 className="info-card__title">{title}</h3>
      <div className="info-card__content">{children}</div>
    </article>
  );
}
