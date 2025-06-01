
import type { BlogPost } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, UserCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlogPostCardProps {
  post: BlogPost;
}

function getReadingTimeShort(content: string): number {
  const wordsPerMinute = 200;
  const textLength = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.ceil(textLength / wordsPerMinute);
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const imageSrc = post.imageDataUri || post.imageUrl;
  const readingTime = getReadingTimeShort(post.content);

  return (
    <Card className="flex flex-col h-full overflow-hidden group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border/70 hover:border-accent/50">
      {imageSrc && (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="tech article"
            className="transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.slice(0, 2).map((tag) => ( // Show max 2 tags
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
        <CardTitle className="text-xl font-headline group-hover:text-accent transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <div className="flex flex-wrap space-x-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center"><CalendarDays className="mr-1 h-3 w-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="flex items-center"><UserCircle className="mr-1 h-3 w-3" /> {post.author}</span>
          <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {readingTime} min read</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4">
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-accent hover:text-accent/90 p-0 font-medium group-hover:underline">
          <Link href={`/blog/${post.slug}`}>
            Read Article <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    