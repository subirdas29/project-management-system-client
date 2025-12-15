import TeamTable from "@/components/pages/projects/team/TeamTable";


export default async function ProjectTeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
      const { projectId } = await params;
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Team & Role Management
      </h1>

      <TeamTable projectId={projectId} />
    </div>
  );
}
