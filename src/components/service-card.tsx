
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
    <Card className="flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          {IconComponent && <IconComponent className="h-10 w-10 text-accent" />}
          <CardTitle className="text-2xl font-headline">{service.name}</CardTitle>
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
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">{service.price}</p>
        <Button variant="ghost" asChild className="text-accent hover:text-accent/90">
          <Link href={`/services#${serviceSlug}`}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
