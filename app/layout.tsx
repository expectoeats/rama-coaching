import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

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
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins antialiased">{children}</body>
    </html>
  );
}
