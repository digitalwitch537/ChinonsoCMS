
import Layout from '@/components/layout';
import { PageContainer } from '@/components/page-container';
import { PageTitle } from '@/components/page-title';
import { ContactForm } from '@/components/forms/contact-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getContactInfo } from '@/lib/data-service'; 
import type { ContactInfo } from '@/lib/types';
import { processMarkdown } from '@/lib/data-service';

async function getContactDetails(): Promise<ContactInfo & { htmlBusinessHours?: string }> {
  const details = await getContactInfo();
  let htmlBusinessHours = "";
  if (details.businessHours) {
    htmlBusinessHours = await processMarkdown(details.businessHours);
  }
  return { ...details, htmlBusinessHours };
}

export default async function ContactPage() {
  const contactDetails = await getContactDetails();

  return (
    <Layout>
      <PageContainer>
        <PageTitle
          title="Get In Touch"
          subtitle="We'd love to hear from you. Reach out with any questions or to discuss your IT needs."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    {contactDetails.email ? (
                      <a href={`mailto:${contactDetails.email}`} className="text-primary hover:underline break-all">
                        {contactDetails.email}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">Not available</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    {contactDetails.phone ? (
                    <a href={`tel:${contactDetails.phone}`} className="text-primary hover:underline">
                      {contactDetails.phone}
                    </a>
                    ) : (
                      <p className="text-muted-foreground">Not available</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    {contactDetails.address ? (
                        <p className="text-foreground/90 whitespace-pre-line">{contactDetails.address}</p>
                    ) : (
                        <p className="text-muted-foreground">Not available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                {contactDetails.htmlBusinessHours ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90" dangerouslySetInnerHTML={{ __html: contactDetails.htmlBusinessHours }} />
                ) : (
                  <>
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM (By appointment)</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
}
