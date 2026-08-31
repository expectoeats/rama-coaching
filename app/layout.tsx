import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rama Coaching Center And Computer Education Center - Quality Computer Education in Fatehpur, UP",
  description:
    "Rama Coaching Center And Computer Education Center provides quality computer education including RSCIT, Tally Prime, Digital Marketing, and more. Located in Fatehpur, Uttar Pradesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins antialiased">{children}</body>
    </html>
  );
}
