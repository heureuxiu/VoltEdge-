import type { ReactNode } from "react";

/**
 * Optional sub-header under the top bar: a one-line description on the left
 * and the page's primary actions on the right. The title itself lives in the Topbar.
 */
export function PageHeader({ description, actions }: { description?: string; actions?: ReactNode }) {
  if (!description && !actions) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      {description ? <p className="m-0 text-sm text-ink-2">{description}</p> : <span />}
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
