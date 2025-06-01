
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/site-logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Briefcase, FileText, MessageSquare, Users } from 'lucide-react'; // Users might be a good icon for Blog
import type { NavItem } from '@/lib/types';

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/portfolio', label: 'Portfolio', icon: FileText }, // Using FileText for Portfolio
  { href: '/blog', label: 'Blog', icon: Users }, // Using Users for Blog as an example
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export function MainNav() {
  const pathname = usePathname();

  const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
    navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={`transition-colors hover:text-primary ${
          pathname === item.href
            ? 'text-primary font-semibold' 
            : 'text-foreground/80'
        } ${isMobile ? 'flex items-center gap-2 py-2 text-lg' : 'text-sm'}`}
      >
        {isMobile && item.icon && <item.icon className="h-5 w-5" />}
        {item.label}
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <SiteLogo />
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 p-4">
                <SiteLogo className="mb-4" />
                <NavLinks isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
