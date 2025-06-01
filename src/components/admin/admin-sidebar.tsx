
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Loader2, ExternalLink, Settings, FileJson } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/admin/login/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard & CMS Link', icon: LayoutDashboard },
  // Links to old CMS editing pages can be removed or updated to point to Decap CMS if needed.
  // For now, the dashboard page will instruct users to go to /admin/ for Decap.
  // { href: '/admin/homepage', label: 'Homepage CMS', icon: Home }, (Handled by Decap)
  // { href: '/admin/services', label: 'Services CMS', icon: Briefcase }, (Handled by Decap)
  // { href: '/admin/portfolio', label: 'Portfolio CMS', icon: ImageIcon }, (Handled by Decap)
  // { href: '/admin/blog', label: 'Blog CMS', icon: FileText }, (Handled by Decap)
  // { href: '/admin/contact-info', label: 'Contact Info CMS', icon: Mail }, (Handled by Decap)
  { href: '/admin/', label: 'Open Decap CMS', icon: ExternalLink, isExternal: true }, // Direct link to Decap
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        router.push('/admin/login');
        router.refresh(); 
      } else {
        toast({
          title: "Logout Failed",
          description: "Could not log you out. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Error",
          description: "An unexpected error occurred during logout.",
          variant: "destructive",
        });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 p-4 flex flex-col space-y-6">
      <div className="px-2">
        <SiteLogo />
      </div>
      <nav className="space-y-1 flex-grow">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noopener noreferrer" : undefined}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
              ${
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href) && !item.isExternal)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.label}</span>
          </Link>
        ))}
         <div className="pt-4 border-t border-border mt-4">
            <p className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase">Developer Info</p>
            <a 
                href="https://decapcms.org/docs/intro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
                <FileJson className="h-5 w-5" />
                <span>Decap CMS Docs</span>
            </a>
        </div>
      </nav>
      <div className="space-y-2 border-t border-border pt-4">
         <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            target="_blank" rel="noopener noreferrer"
          >
            <Settings className="h-5 w-5" />
            <span>View Main Site</span>
          </Link>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start space-x-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            <span>{isLoggingOut ? "Logging out..." : "Logout (Admin Area)"}</span>
          </Button>
      </div>
    </aside>
  );
}
