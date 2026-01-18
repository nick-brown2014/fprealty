import type { Metadata } from "next";
import { CookiesProvider } from 'next-client-cookies/server';
import { Providers } from './providers';
import "./globals.css";

export const metadata: Metadata = {
  title: "Your App Name | Real Estate Search",
  description: "Search for homes and properties. Browse listings, save favorites, and find your next home.",
  openGraph: {
    title: "Your App Name | Real Estate Search",
    description: "Search for homes and properties",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CookiesProvider>
          <Providers>
            {children}
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  );
}
