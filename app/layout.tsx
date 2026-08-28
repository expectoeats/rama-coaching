import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rama Coaching Center — Certificate Generator",
  description:
    "Generate printable course completion certificates for Rama Coaching Center students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
