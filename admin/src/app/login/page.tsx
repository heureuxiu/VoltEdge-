import type { Metadata } from "next";

import { LoginView } from "@/views/login/LoginView";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return <LoginView />;
}
