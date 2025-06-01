
import Layout from '@/components/layout';
import { PageContainer } from '@/components/page-container';
import { PageTitle } from '@/components/page-title';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getAllCollectionItems } from '@/lib/data-service';
import type { Service } from '@/lib/types';
import { CheckCircle } from 'lucide-react';
import { iconMap } from '@/components/icon-map'; 

async function getServices(): Promise<Service[]> {
  return getAllCollectionItems<Service>('services');
}

export default async function ServicesPage() {
  const servicesData = await getServices();

  return (
    <Layout>
      <PageContainer>
        <PageTitle
          title="Our IT Services"
          subtitle="Comprehensive solutions to meet your technology needs."
        />
        {servicesData.length === 0 ? (
          <p className="text-center text-muted-foreground">No services available yet.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service) => {
            const IconComponent = service.iconName ? iconMap[service.iconName] : null;
            const serviceSlug = service.slug || service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            return (
              <Card key={service.id} id={serviceSlug} className="transform transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {IconComponent && <IconComponent className="h-10 w-10 text-accent" />}
                    <CardTitle className="text-2xl font-headline">{service.name}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-primary mb-4">{service.price}</p>
                  {service.details && service.details.length > 0 && (
                    <>
                      <h4 className="font-semibold text-sm mb-2 text-foreground">Key features include:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {service.details.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}
      </PageContainer>
    </Layout>
  );
}
