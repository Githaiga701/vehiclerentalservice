import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import './globals.css';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Vehicle Rental Service',
    template: '%s | Vehicle Rental Service'
  },
  description: 'Web frontend for the Vehicle Rental Service',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Vehicle Rental Service',
    description: 'Book and manage vehicle rentals.',
    url: 'http://localhost:3000',
    siteName: 'Vehicle Rental Service',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vehicle Rental Service',
    description: 'Book and manage vehicle rentals.'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

