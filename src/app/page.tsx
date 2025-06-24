
import Layout from '@/components/layout';
import { HeroSection } from '@/components/hero-section';
import { PageContainer } from '@/components/page-container';
import { ServiceCard } from '@/components/service-card';
import { BlogPostCard } from '@/components/blog-post-card';
import { ProjectCard } from '@/components/project-card';
import { getAllCollectionItems } from '@/lib/data-service';
import type { Service, BlogPost, Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

async function getHomepageFeaturedData() {
  const services = await getAllCollectionItems<Service>("services");
  const blogPosts = await getAllCollectionItems<BlogPost>("blogPosts"); // Already sorted by date in service
  const projects = await getAllCollectionItems<Project>("projects"); // Already sorted by date in service

  return {
    featuredServices: services.slice(0, 3),
    recentBlogPosts: blogPosts.slice(0, 3),
    featuredProjects: projects.slice(0, 2),
  };
}

export default async function HomePage() {
  const { featuredServices, recentBlogPosts, featuredProjects } = await getHomepageFeaturedData();

  return (
    <Layout>
      <HeroSection />

      <PageContainer className="space-y-16 md:space-y-24">
        
        <section id="services" className="glass-card">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Our Core IT Services</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering your business with reliable, cutting-edge technology solutions.
            </p>
          </div>
          {featuredServices.length === 0 ? (
            <p className="text-center text-muted-foreground">Services will be listed here soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-sm hover:shadow-md transition-all">
              <Link href="/services">
                Discover All Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="blog" className="glass-card">
           <div className="px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Latest Tech Insights</h2>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay informed with our expert analysis, tutorials, and news from the IT world.
                </p>
            </div>
            {recentBlogPosts.length === 0 ? (
              <p className="text-center text-muted-foreground">Blog posts will be shown here soon.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            )}
            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                <Link href="/blog">
                  Explore Our Blog <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="portfolio" className="glass-card">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Showcasing Our Work</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse into the successful projects and solutions we've delivered.
            </p>
          </div>
          {featuredProjects.length === 0 ? (
            <p className="text-center text-muted-foreground">Featured projects will be displayed here soon.</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          )}
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-sm hover:shadow-md transition-all">
              <Link href="/portfolio">
                View Full Portfolio <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="cta" className="text-center glass-card">
          <div className="px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Ready to Elevate Your IT Infrastructure?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Let's discuss how ChinonsoIT can architect robust, scalable, and secure technology solutions to drive your business forward.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform transition-transform hover:scale-105">
                <Link href="/contact">
                  Schedule Your Free Consultation <CheckCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </Layout>
  );
}
