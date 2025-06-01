
import Link from 'next/link';
import { Terminal } from 'lucide-react';

interface SiteLogoProps {
  className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold ${className}`}>
      <Terminal className="h-8 w-8 text-accent" />
      <span className="text-foreground">Chinonso<span className="text-primary">IT</span></span>
    </Link>
  );
}
