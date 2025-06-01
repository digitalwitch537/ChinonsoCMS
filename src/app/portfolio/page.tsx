
import Layout from '@/components/layout';
import { PageContainer } from '@/components/page-container';
import { PageTitle } from '@/components/page-title';
import { ProjectCard } from '@/components/project-card';
import { getAllCollectionItems } from '@/lib/data-service';
import type { Project } from '@/lib/types';

async function getProjects(): Promise<Project[]> {
  return getAllCollectionItems<Project>('projects');
}

export default async function PortfolioPage() {
  const projectsData = await getProjects();
  return (
    <Layout>
      <PageContainer>
        <PageTitle
          title="Project Portfolio"
          subtitle="A selection of our successfully completed projects."
        />
        {projectsData.length === 0 ? (
           <p className="text-center text-muted-foreground">No projects available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
