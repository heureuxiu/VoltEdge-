import type { Metadata } from "next";

import { ActivityView } from "@/views/activity/ActivityView";

export const metadata: Metadata = { title: "Activity log" };

export default function ActivityPage() {
  return <ActivityView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
