import type { Metadata } from "next";

import { TradeInsView } from "@/views/trade-ins/TradeInsView";

export const metadata: Metadata = { title: "Trade-ins" };

export default function TradeInsPage() {
  return <TradeInsView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
