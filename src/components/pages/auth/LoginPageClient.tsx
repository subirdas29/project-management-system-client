'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import authStore from '@/store/authStore';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormType = z.infer<typeof schema>;

export default function LoginPageClient() {
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormType) => {
    const [me, err] = await authStore.login(values);
    if (!err && me) router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input placeholder="Email" {...form.register('email')} />
            <Input type="password" placeholder="Password" {...form.register('password')} />
            <Button className="w-full" type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
