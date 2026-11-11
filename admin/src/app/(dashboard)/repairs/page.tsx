import type { Metadata } from "next";

import { RepairsView } from "@/views/repairs/RepairsView";

export const metadata: Metadata = { title: "Repairs" };

export default function RepairsPage() {
  return <RepairsView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
