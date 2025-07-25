import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';
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
  title: "Fred Porter Realty",
  description: "Your ultimate resource to living in Northern Colorado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CookiesProvider>
            {children}
        </CookiesProvider>
      </body>
    </html>
  );
}
