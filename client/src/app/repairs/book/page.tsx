import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingWizard } from "@/components/repairs/BookingWizard";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Book a repair",
  description: "Book a same-day phone, tablet or laptop repair in four quick steps.",
};

export default function BookRepairPage() {
  return (
    <Container className="mx-auto max-w-[1240px] pt-6">
      {/* The wizard reads today's date for the slot picker, so it renders per request. */}
      <Suspense fallback={<div className="h-[720px] animate-pulse rounded-panel bg-white ring-1 ring-line" />}>
        <BookingWizard />
      </Suspense>
    </Container>
  );
}
