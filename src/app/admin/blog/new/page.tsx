
"use client";

// This page is likely no longer needed if Decap CMS is used for creating new posts.
// Redirect to the Decap CMS admin area.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { Loader2 } from 'lucide-react';

export default function NewBlogPostPageLegacy() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Decap CMS admin area for creating a new blog post.
    // The path would be /admin/#/collections/blog/new
    router.replace('/admin/#/collections/blog/new');
  }, [router]);

  return (
    <>
      <PageTitle title="Redirecting to CMS" subtitle="Blog post creation is now handled by Decap CMS." className="text-left mb-8" />
       <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="ml-2">Redirecting to Decap CMS...</p>
      </div>
      <p className="text-center mt-4">
        If you are not redirected, please go to <a href="/admin/#/collections/blog/new" className="underline text-accent">/admin/#/collections/blog/new</a>.
      </p>
    </>
  );
}
