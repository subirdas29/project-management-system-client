import ProjectList from "@/components/pages/projects/ProjectList";



export default function ProjectsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Projects
      </h1>

      <ProjectList />
    </div>
  );
}
