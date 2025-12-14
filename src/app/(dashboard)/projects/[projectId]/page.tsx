import ProjectOverviewClient from '@/components/pages/projects/ProjectOverviewClient';

export default function Page({
  params,
}: {
  params: { projectId: string };
}) {
  return <ProjectOverviewClient projectId={params.projectId} />;
}
