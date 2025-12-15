'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import authStore from '@/store/authStore';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'manager', 'member']),
});

type FormType = z.infer<typeof schema>;

export default function SignupPageClient() {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'member',
    },
  });

  const onSubmit = async (values: FormType) => {
    try {
      await authStore.signup(values);

      toast.success('Account created successfully');
      router.replace('/login');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Signup failed',
      );
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <Input
              placeholder="Full name"
              {...form.register('name')}
            />

            <Input
              placeholder="Email"
              {...form.register('email')}
            />

            <Input
              type="password"
              placeholder="Password"
              {...form.register('password')}
            />

            <Select
              value={form.watch('role')}
              onValueChange={(v) =>
                form.setValue('role', v as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </form>


          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
