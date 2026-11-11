import type { Metadata } from "next";

import { MessagesView } from "@/views/messages/MessagesView";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return <MessagesView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
