import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Devanagari,
} from "next/font/google";
import "./tokens.css";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexDevanagari = IBM_Plex_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Fieldwork", template: "%s · Fieldwork" },
  description:
    "A clearer way to buy and sell phones. Photo evidence, fairer deals, fewer disputes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F3EFE6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    plexSans.variable,
    plexSerif.variable,
    plexMono.variable,
    plexDevanagari.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
