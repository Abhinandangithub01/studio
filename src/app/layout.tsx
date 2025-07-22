/**
 * @fileoverview This is the root layout for the entire application.
 * It sets up the basic HTML document structure, including the `<html>` and `<body>` tags,
 * imports global stylesheets, and includes the `Toaster` component for notifications.
 */

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

// Metadata for SEO and browser tabs.
export const metadata: Metadata = {
  title: 'Nebbulon',
  description: 'A community platform for professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Import custom fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
