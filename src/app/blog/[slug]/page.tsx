
import Layout from '@/components/layout';
import { PageContainer } from '@/components/page-container';
import { getCollectionItemBySlugOrId, getAllCollectionItems, processMarkdown } from '@/lib/data-service'; 
import type { BlogPost } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Removed AvatarImage as not used
import removeMarkdown from 'remove-markdown';


interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllCollectionItems<BlogPost>('blogPosts');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const post = await getCollectionItemBySlugOrId<BlogPost>('blogPosts', slug);
  if (post && post.content) {
    post.htmlContent = await processMarkdown(post.content);
  }
  return post;
}

// Helper function to estimate reading time
function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // Strip HTML tags for word count if content is already HTML, or use removeMarkdown for Markdown
  const textOnly = content.includes('<') ? content.replace(/<[^>]+>/g, '') : removeMarkdown(content);
  const textLength = textOnly.split(/\s+/).length; 
  return Math.ceil(textLength / wordsPerMinute);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const imageSrc = post.imageDataUri || post.imageUrl;
  const readingTime = getReadingTime(post.content); // Pass raw markdown content
  const authorInitials = post.author.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU';

  return (
    <Layout>
      <PageContainer className="max-w-4xl py-8 md:py-12">
        <div className="mb-8">
          <Button variant="outline" size="sm" asChild className="group">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to All Articles
            </Link>
          </Button>
        </div>

        <article className="bg-card p-6 sm:p-8 md:p-10 rounded-xl shadow-xl">
          {imageSrc && (
            <div className="relative aspect-[16/9] w-full mb-8 rounded-lg overflow-hidden shadow-lg border border-border">
              <Image
                src={imageSrc}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint="tech article detail"
                priority
                className="transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}
          
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline mb-4 text-foreground leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author}</span>
              </div>
              <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> {readingTime} min read</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="hover:bg-secondary/80 transition-colors">{tag}</Badge>
                ))}
              </div>
            )}
          </header>
          
          {post.htmlContent && (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:font-headline prose-headings:text-foreground
                        prose-p:text-foreground/90 prose-p:leading-relaxed
                        prose-a:text-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-em:text-foreground/90
                        prose-blockquote:border-accent prose-blockquote:text-foreground/80
                        prose-ul:list-disc prose-ol:list-decimal 
                        prose-li:marker:text-accent
                        prose-img:rounded-md prose-img:shadow-md prose-img:border prose-img:border-border
                        prose-code:bg-muted prose-code:text-foreground prose-code:p-1 prose-code:rounded-sm prose-code:font-code
                        prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: post.htmlContent }} 
            />
          )}
        </article>
      </PageContainer>
    </Layout>
  );
}
