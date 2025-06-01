
import { SiteLogo } from '@/components/site-logo';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <SiteLogo />
            <p className="mt-4 text-sm text-muted-foreground">
              Providing expert IT solutions to help your business grow.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="mailto:sandra@chinonsoit.com" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <p className="font-medium text-foreground">Services</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link href="/services#it-support" className="text-muted-foreground hover:text-primary transition-colors">IT Support</Link>
                <Link href="/services#network" className="text-muted-foreground hover:text-primary transition-colors">Network Solutions</Link>
                <Link href="/services#cloud" className="text-muted-foreground hover:text-primary transition-colors">Cloud Services</Link>
                <Link href="/services#cybersecurity" className="text-muted-foreground hover:text-primary transition-colors">Cybersecurity</Link>
              </nav>
            </div>
            <div>
              <p className="font-medium text-foreground">Resources</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</Link>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              </nav>
            </div>
            <div>
              <p className="font-medium text-foreground">Legal</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} ChinonsoIT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
