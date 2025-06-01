
"use client";

// This page's functionality for listing/managing blog posts is superseded by Decap CMS.
// It can be simplified to a message and a link to Decap CMS.
import Link from 'next/link';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function AdminBlogPageLegacy() {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <PageTitle title="Manage Blog Posts (via CMS)" subtitle="Create, edit, or delete articles using Decap CMS." className="text-left mb-0" />
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/#/collections/blog" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> Open Blog CMS
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        All blog post management is now handled through the Decap CMS interface. 
        Use the "Open Blog CMS" button above to access it.
      </p>
    </>
  );
}
