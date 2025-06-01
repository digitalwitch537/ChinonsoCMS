
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <>
      <PageTitle 
        title="Admin Dashboard" 
        subtitle="Manage your website content using the CMS." 
        className="text-left mb-8" 
      />
      <p className="mb-4">
        Your website content (Blog Posts, Services, Portfolio Projects, Homepage Text, and Contact Information) 
        is managed through a Git-based CMS. 
      </p>
      <p className="mb-4">
        Click the button below to access the Content Management System (CMS). You may be prompted to log in 
        with your GitHub (or other configured Git provider) account.
      </p>
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/admin/">
          Go to Content Manager (Decap CMS)
        </Link>
      </Button>
      <p className="mt-6 text-sm text-muted-foreground">
        <strong>Note:</strong> The CMS interface at <code className="bg-muted px-1 py-0.5 rounded">/admin/</code> will look different from these Next.js admin pages. 
        The Next.js pages previously used for direct editing (like Blog CMS, Services CMS etc. in the sidebar) are no longer the primary way to edit content. 
        All content edits should now be done through the Decap CMS interface linked above.
        The "Admin Login" via username/password is for accessing this Next.js admin area, not the Decap CMS itself, which uses Git provider authentication.
      </p>
       <p className="mt-4 text-sm text-muted-foreground">
        To view contact form submissions, please check the <code className="bg-muted px-1 py-0.5 rounded">src/data/contactSubmissions.json</code> file in your project's codebase.
      </p>
    </>
  );
}
