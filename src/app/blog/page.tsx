
import Layout from '@/components/layout';
import { PageContainer } from '@/components/page-container';
import { PageTitle } from '@/components/page-title';
import { BlogPostCard } from '@/components/blog-post-card';
import { getAllCollectionItems } from '@/lib/data-service';
import type { BlogPost } from '@/lib/types';

async function getBlogPosts(): Promise<BlogPost[]> {
  return getAllCollectionItems<BlogPost>('blogPosts');
}

export default async function BlogListPage() {
  const blogPostsData = await getBlogPosts();
  return (
    <Layout>
      <PageContainer>
        <PageTitle
          title="Technical Blog"
          subtitle="Insights, news, and updates from the world of IT."
        />
        {blogPostsData.length === 0 ? (
          <p className="text-center text-muted-foreground">No blog posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPostsData.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
