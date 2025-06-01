
"use client";

// This page's functionality for managing contact info is superseded by Decap CMS.
// It can be simplified to a message and a link to Decap CMS.
import Link from 'next/link';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function AdminContactInfoPageLegacy() {
 return (
    <>
      <PageTitle title="Manage Contact Information (via CMS)" subtitle="Update your publicly displayed contact details using Decap CMS." className="text-left mb-8" />
      <Card>
        <CardHeader>
          <CardTitle>Access Contact Info CMS</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="mb-4">
                Contact information (email, phone, address, business hours) is now managed through the Decap CMS.
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/admin/#/collections/site_config/entries/contact_info" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Open Contact Info Editor in CMS
                </Link>
            </Button>
        </CardContent>
      </Card>
    </>
  );
}
