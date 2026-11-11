import type { ReactNode } from "react";

/** Re-mounts on every navigation, giving each page a soft entrance. */
export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return <div className="ve-fade">{children}</div>;
}
