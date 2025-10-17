import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';
import { Providers } from './providers';
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Porter Real Estate | Northern Colorado Real Estate & Homes for Sale",
  description: "Find your dream home in Northern Colorado with Porter Real Estate. Browse homes for sale, get expert advice on buying and selling, and explore the best neighborhoods in the area.",
  keywords: "Northern Colorado real estate, homes for sale, Colorado real estate agent, buy home Colorado, sell home Colorado",
  openGraph: {
    title: "Porter Real Estate | Northern Colorado Real Estate",
    description: "Your ultimate resource for living in Northern Colorado",
    type: "website",
    locale: "en_US",
  },
  verification: {
    google: '8wmRJ6G23iy3Ljjj9c0xpuCLBstt54UZw1gmWLFFx7s',
  },
  twitter: {
    card: "summary_large_image",
    title: "Porter Real Estate",
    description: "Your ultimate resource for living in Northern Colorado",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-668025904"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-668025904');
          `}
        </Script>
        <Script id="local-business-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Porter Real Estate",
              "description": "Your ultimate resource for living in Northern Colorado",
              "areaServed": {
                "@type": "State",
                "name": "Colorado"
              },
              "knowsAbout": ["Real Estate", "Home Buying", "Home Selling", "Property Investment"],
              "url": "${process.env.NEXTAUTH_URL || 'https://nocoreator.com'}"
            }
          `}
        </Script>
        <CookiesProvider>
          <Providers>
            {children}
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  );
}
