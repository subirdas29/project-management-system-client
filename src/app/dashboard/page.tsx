import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentProjects from '@/components/dashboard/RecentProjects';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';



export default async function DashboardPage() {
   const cookieStore = await cookies(); 
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your projects and tasks
        </p>
      </div>

      <DashboardStats />
      <RecentProjects />
    </div>
  );
}
