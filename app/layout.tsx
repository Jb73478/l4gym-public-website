import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.l4gym.com"),
  title: { default: "L4Gym | Connected Fitness Equipment Infrastructure", template: "%s | L4Gym" },
  description: "L4Gym connects fitness equipment, gym operations and technical service across the equipment lifecycle.",
  openGraph: { title: "L4Gym | Connected Fitness Equipment Infrastructure", description: "Connecting fitness equipment, gym operations and technical service across the equipment lifecycle.", url: "https://www.l4gym.com", siteName: "L4Gym", type: "website" },
  twitter: { card: "summary", title: "L4Gym", description: "Connected fitness equipment infrastructure." },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body>
    </html>
  );
}
