
import type { Service } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { iconMap } from './icon-map';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = service.iconName ? iconMap[service.iconName] : null;
  const serviceSlug = service.slug || service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
          <CardTitle className="text-2xl font-headline text-foreground">{service.name}</CardTitle>
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {service.details && service.details.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
            {service.details.slice(0,3).map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
            <p className="text-lg font-semibold text-foreground">{service.price}</p>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 p-0">
            <Link href={`/services#${serviceSlug}`}>
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
