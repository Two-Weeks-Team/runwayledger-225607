import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunwayLedger",
  description: "Visualize every dollar as a point on your runway \u2013 the interactive cash\u2011flow atlas for founders and freelancers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
