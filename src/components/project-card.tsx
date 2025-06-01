
import type { Project } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imageSrc = project.imageDataUri || project.imageUrl;

  return (
    <Card className="flex flex-col h-full overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {imageSrc ? (
        <div className="relative h-56 w-full">
          <Image
            src={imageSrc}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="tech project"
          />
        </div>
      ) : (
         <div className="relative h-56 w-full bg-muted flex items-center justify-center">
            <Tags className="h-16 w-16 text-muted-foreground/50" /> {/* Placeholder Icon */}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-headline">{project.title}</CardTitle>
        {project.client && <p className="text-sm text-muted-foreground">Client: {project.client}</p>}
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{project.description}</CardDescription>
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center">
              <Tags className="h-3 w-3 mr-1" /> Technologies Used:
            </h4>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {project.liveLink && project.liveLink !== '#' && (
          <Button variant="outline" size="sm" asChild>
            <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
              View Live <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

