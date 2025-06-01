
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google'; // Removed direct import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' }); // Removed font variable

export const metadata: Metadata = {
  title: 'ChinonsoIT - Expert IT Solutions',
  description: 'Professional IT support, services, and consultancy by Sandra Chinonso.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      {/* Applied suppressHydrationWarning directly to body as well if needed, but primarily for html tag */}
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
