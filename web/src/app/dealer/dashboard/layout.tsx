"use client";

import React from "react";
import { DealerGuard } from "@/components/dealer/DealerGuard";

export default function DealerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DealerGuard>{children}</DealerGuard>;
}
