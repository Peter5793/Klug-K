import { ReactNode } from "react";

type PageFrameProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageFrame({ title, subtitle, actions, children }: PageFrameProps) {
  return (
    <section className="page-frame">
      <header className="page-frame__header">
        <div>
          <p className="page-frame__eyebrow">Admin Workspace</p>
          <h2>{title}</h2>
          <p className="page-frame__subtitle">{subtitle}</p>
        </div>
        {actions ? <div className="page-frame__actions">{actions}</div> : null}
      </header>
      <div className="page-frame__body">{children}</div>
    </section>
  );
}
