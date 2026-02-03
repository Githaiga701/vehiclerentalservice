// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

// Load fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700", "800"]
});

export const metadata: Metadata = {
  title: "VehicleRent Kenya - Premium Car Rental Service",
  description: "Kenya's premier vehicle rental platform. Rent cars, SUVs, and luxury vehicles with ease. Available in Nairobi, Mombasa, and nationwide.",
  keywords: ["car rental", "vehicle rental", "Kenya", "Nairobi", "Mombasa", "SUV rental", "luxury cars"],
  authors: [{ name: "VehicleRent Kenya" }],
  creator: "VehicleRent Kenya",
  publisher: "VehicleRent Kenya",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VehicleRent Kenya - Premium Car Rental Service",
    description: "Kenya's premier vehicle rental platform. Rent cars, SUVs, and luxury vehicles with ease.",
    url: "/",
    siteName: "VehicleRent Kenya",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VehicleRent Kenya - Car Rental Service",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VehicleRent Kenya - Premium Car Rental Service",
    description: "Kenya's premier vehicle rental platform. Rent cars, SUVs, and luxury vehicles with ease.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VehicleRent Kenya",
  },
  applicationName: "VehicleRent Kenya",
  category: "travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="VehicleRent Kenya" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VehicleRent Kenya" />
        <meta name="description" content="Kenya's premier vehicle rental platform" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={cn(
        inter.className,
        jakarta.variable,
        inter.variable,
        "min-h-screen bg-neutral-50 antialiased"
      )}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-center" />
          <PWAInstallPrompt />
          <OfflineIndicator />
          <ServiceWorkerRegistration />
        </AuthProvider>
      </body>
    </html>
  );
}