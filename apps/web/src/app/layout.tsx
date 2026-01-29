// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

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
  title: "Vehicle Rental Service - Rent Cars in Kenya",
  description: "Affordable and reliable vehicle rentals in Nairobi and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        </AuthProvider>
      </body>
    </html>
  );
}