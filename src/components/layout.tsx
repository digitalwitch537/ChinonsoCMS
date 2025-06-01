
import type React from 'react';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <MainNav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
