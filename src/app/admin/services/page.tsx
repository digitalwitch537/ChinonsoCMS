
"use client"; 

// This page's functionality for managing services is superseded by Decap CMS.
// It can be simplified to a message and a link to Decap CMS.
import Link from 'next/link';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';


export default function AdminServicesPageLegacy() {
  return (
    <>
      <PageTitle title="Manage Services (via CMS)" subtitle="Add, edit, or update IT service offerings using Decap CMS." className="text-left mb-8" />
      <div className="mb-6">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/#/collections/services" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> Open Services CMS
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        All service management is now handled through the Decap CMS interface. 
        Use the "Open Services CMS" button above to access it.
      </p>
    </>
  );
}
