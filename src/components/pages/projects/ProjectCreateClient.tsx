'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';




import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import projectStore from '@/store/projectStore';
import { useRouter } from 'next/navigation';

const schema = z.object({
  title: z.string().min(1),
  client: z.string().min(1),
  status: z.enum(['planned', 'active', 'completed', 'archived']),
});

type FormType = z.infer<typeof schema>;

export default function ProjectCreateClient() {
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      client: '',
      status: 'planned',
    },
  });

  const onSubmit = async (values: FormType) => {
    const [project, err] = await projectStore.createProject(values);
    if (!err && project) {
      router.replace(`/projects/${project._id}`);
    }
  };

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <Input placeholder="Project title" {...form.register('title')} />
            <Input placeholder="Client name" {...form.register('client')} />

            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
