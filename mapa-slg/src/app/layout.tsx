import type { Metadata, Viewport } from "next";
import { Montserrat, Hind } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { esUY } from "@clerk/localizations";
import { siteConfig } from "./config";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const hind = Hind({
  subsets: ["latin"],
  variable: "--font-hind",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: siteConfig.title,
  authors: [{ name: "Renato Bicego", url: "https://renatobicego.com" }],
  category: "education",
  keywords: [
    "San Luis Gonzaga",
    "Colegio San Luis Gonzaga",
    "Mapa SLG",
    "Mapa San Luis Gonzaga",
    "Centenario San Luis Gonzaga",
    "100 años San Luis Gonzaga",
    "Alumnos San Luis Gonzaga",
    "Exalumnos San Luis Gonzaga",
    "Comunidad San Luis Gonzaga",
    "Educación",
    "Historia San Luis Gonzaga",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esUY}>
      <html lang="es">
        <body
          className={`${montserrat.variable} ${hind.variable} antialiased overflow-hidden`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
