
"use client";

// This page is likely no longer needed if Decap CMS is used for editing.
// Redirect to the main Decap admin or the blog list in Decap.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { Loader2 } from 'lucide-react';

export default function EditBlogPostPageLegacy() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Decap CMS admin area for editing.
    // The specific path might be /admin/#/collections/blog/entries/[slug]
    // For simplicity, redirecting to the blog collection view in Decap.
    router.replace('/admin/#/collections/blog');
  }, [router]);

  return (
    <>
      <PageTitle title="Redirecting to CMS" subtitle="Blog post editing is now handled by Decap CMS." className="text-left mb-8" />
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="ml-2">Redirecting to Decap CMS for editing...</p>
      </div>
      <p className="text-center mt-4">
        If you are not redirected, please go to <a href="/admin/#/collections/blog" className="underline text-accent">/admin/#/collections/blog</a>.
      </p>
    </>
  );
}
