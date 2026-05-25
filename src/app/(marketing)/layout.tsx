import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Tabula — Turn chaos into clarity.",
    template: "%s — Tabula",
  },
  description:
    "Tabula transforms manual business workflows into AI-powered automated systems. We partner with operations teams to map, redesign, and automate the work that slows you down.",
  metadataBase: new URL("https://tabula.ai"),
  openGraph: {
    title: "Tabula — Turn chaos into clarity.",
    description:
      "Tabula transforms manual business workflows into AI-powered automated systems.",
    url: "https://tabula.ai",
    siteName: "Tabula",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabula — Turn chaos into clarity.",
    description:
      "Tabula transforms manual business workflows into AI-powered automated systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
