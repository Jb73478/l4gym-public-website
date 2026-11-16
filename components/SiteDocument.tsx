"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteDocument({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  return <html lang={pathname === "/de" || pathname.startsWith("/de/") ? "de" : "en"}>
    <body>{children}</body>
  </html>;
}
