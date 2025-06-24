
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getHomepageContent, processMarkdown } from '@/lib/data-service';
import type { HomepageContent } from '@/lib/types';
import { ArrowRight, User } from 'lucide-react'; 

async function getHomepageData(): Promise<HomepageContent & { htmlBio?: string }> {
  try {
    const data = await getHomepageContent();
    let htmlBio = "";
    if (data.bio) {
        htmlBio = await processMarkdown(data.bio);
    }
    return {
        ...data,
        professionalPhotoUrl: data.professionalPhotoUrl || "",
        imageDataUri: data.imageDataUri || "",
        bio: data.bio || "Welcome to ChinonsoIT. We offer expert IT solutions tailored to your needs.",
        htmlBio: htmlBio || "<p>Welcome to ChinonsoIT. We offer expert IT solutions tailored to your needs.</p>"
    };
  } catch (error) {
    console.error("Failed to load homepage data for HeroSection:", error);
    return { 
        bio: "<p>Welcome to ChinonsoIT. We offer expert IT solutions tailored to your needs.</p>", 
        htmlBio: "<p>Welcome to ChinonsoIT. We offer expert IT solutions tailored to your needs.</p>",
        professionalPhotoUrl: "", 
        imageDataUri: "" 
    };
  }
}

export async function HeroSection() {
  const homepageData = await getHomepageData();
  const imageSrc = homepageData.imageDataUri || homepageData.professionalPhotoUrl;

  return (
    <section className="glass-card">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-y-12 gap-x-8 lg:grid-cols-2 lg:items-start">
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline leading-tight">
              Expert IT Solutions for a Digital Age
            </h1>
            {homepageData.htmlBio && (
                 <div 
                    className="mt-6 text-lg leading-relaxed text-muted-foreground prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: homepageData.htmlBio }} 
                />
            )}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 lg:justify-start">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform transition-transform hover:scale-105 w-full sm:w-auto">
                <Link href="/contact">
                  Get a Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-md w-full sm:w-auto">
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end relative group">
            {imageSrc ? (
              <div className="relative w-[280px] h-[370px] sm:w-[320px] sm:h-[420px] lg:w-[350px] lg:h-[460px] rounded-xl shadow-2xl overflow-hidden border-4 border-card group-hover:border-accent transition-all duration-300">
                <Image
                  src={imageSrc}
                  alt="Sandra Chinonso - IT Professional"
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint="professional woman"
                  priority
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-all duration-300"></div>
              </div>
            ) : (
                <div className="w-[300px] h-[400px] bg-muted rounded-xl shadow-2xl flex items-center justify-center border-4 border-dashed border-border" data-ai-hint="placeholder profile">
                   <User className="h-32 w-32 text-muted-foreground/50" />
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
