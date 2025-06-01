
import type React from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// This layout is for the Next.js admin pages (like the dashboard stub and login).
// Decap CMS will have its own UI at /admin/ (index.html).
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <ScrollArea className="flex-1">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
}
