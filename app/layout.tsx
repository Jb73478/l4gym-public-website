import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, SkipLink } from "@/components/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.l4gym.com"),
  title: { default: "L4Gym | Connected Fitness Equipment Infrastructure", template: "%s | L4Gym" },
  description: "L4Gym connects fitness equipment, gym operations and technical service across the equipment lifecycle.",
  alternates: { canonical: "./" },
  openGraph: {
    title: "L4Gym | Connected Fitness Equipment Infrastructure",
    description: "Connecting fitness equipment, gym operations and technical service across the equipment lifecycle.",
    url: "./",
    siteName: "L4Gym",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/l4gym-logo-dark.jpg", width: 1536, height: 512, alt: "L4Gym — connected fitness equipment infrastructure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "L4Gym | Connected Fitness Equipment Infrastructure",
    description: "Connecting fitness equipment, gym operations and technical service across the equipment lifecycle.",
    images: ["/l4gym-logo-dark.jpg"],
  },
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
      <body><SkipLink/><Header/><main id="main">{children}</main><Footer/></body>
    </html>
  );
}
