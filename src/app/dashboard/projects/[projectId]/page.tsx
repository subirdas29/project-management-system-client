import ProjectOverview from '@/components/pages/projects/ProjectOverview';

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  console.log('projectId:', projectId);

  return <ProjectOverview projectId={projectId} />;
}
