import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

/* eslint-disable @next/next/no-page-custom-font, @next/next/google-font-display --
   The isolated integration mirrors the exact user-supplied Research font links. */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const matrixBody = Manrope({
  variable: "--font-matrix-body",
  subsets: ["latin"],
});

const matrixDisplay = Space_Grotesk({
  variable: "--font-matrix-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rookie ADP Hit Rates",
  description:
    "Fantasy football rookie hit rates by draft position and positional group.",
  icons: {
    icon: "/adp/favicon.svg",
    shortcut: "/adp/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Research navigation icons: use the same Font Awesome release as the
            Vanilla Research page so the isolated header remains visually exact. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@200;300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Product+Sans:wght@100;200;300;400;500;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Google+Sans:100,200,300,400,500,600,700"
        />
        {/* Shared Research editing fonts: these links expose the same font
            families on both isolated player hit-rate routes. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=MuseoModerno:ital,wght@0,100..900;1,100..900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${matrixBody.variable} ${matrixDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
