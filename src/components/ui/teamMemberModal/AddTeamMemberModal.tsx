'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';

import { teamStore } from '@/store/teamStore';
import { userStore } from '@/store/userStore';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Role = 'admin' | 'manager' | 'member';

export default function AddTeamMemberModal({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
}) {
  const teamSnap = useSnapshot(teamStore);
  const userSnap = useSnapshot(userStore);

  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState<
    Record<string, { checked: boolean; role: Role }>
  >({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as Role,
    department: '',
    skills: '',
  });


  const existingEmails = useMemo(() => {
    return new Set(
      teamSnap.list.map((m: any) => m.userId?.email),
    );
  }, [teamSnap.list]);


  useEffect(() => {
    if (open && mode === 'existing') {
      userStore.getAllUsers();
    }
  }, [open, mode]);

  const shouldShowResults = search.trim().length >= 2;

  const filteredUsers = useMemo(() => {
    if (!shouldShowResults) return [];
    return userSnap.list.filter(
      (u: any) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [userSnap.list, search, shouldShowResults]);

  const hasSelection = Object.entries(selected).some(
    ([email, v]) => v.checked && !existingEmails.has(email),
  );

  const submitExisting = async () => {
    for (const [email, v] of Object.entries(selected)) {
      if (v.checked && !existingEmails.has(email)) {
        await teamStore.addTeamMember({
          mode: 'existing',
          projectId,
          email,
          role: v.role,
        });
      }
    }

    await teamStore.getProjectTeam(projectId, teamSnap.page);
    onClose();
    setSearch('');
    setSelected({});
  };

  const submitNew = async () => {
    await teamStore.addTeamMember({
      mode: 'new',
      projectId,
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department,
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });

    await teamStore.getProjectTeam(projectId, teamSnap.page);
    onClose();
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'member',
      department: '',
      skills: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        {/* MODE SWITCH */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'existing' ? 'default' : 'outline'}
            onClick={() => setMode('existing')}
          >
            Existing Member
          </Button>
          <Button
            variant={mode === 'new' ? 'default' : 'outline'}
            onClick={() => setMode('new')}
          >
            New Member
          </Button>
        </div>

      
        {mode === 'existing' && (
          <div className="space-y-3">
            <Input
              placeholder="Search by name or email (min 2 chars)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {!shouldShowResults && (
              <p className="text-sm text-muted-foreground">
                Type at least 2 characters to search users
              </p>
            )}

            {shouldShowResults && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          No users found
                        </TableCell>
                      </TableRow>
                    )}

                    {filteredUsers.map((u: any) => {
                      const isAlready = existingEmails.has(u.email);
                      const row =
                        selected[u.email] || {
                          checked: isAlready,
                          role: 'member' as Role,
                        };

                      return (
                        <TableRow
                          key={u._id}
                          className={isAlready ? 'opacity-60' : ''}
                        >
                          <TableCell>
                            <Checkbox
                              checked={row.checked}
                              disabled={isAlready}
                              onCheckedChange={(val) =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [u.email]: {
                                    ...row,
                                    checked: Boolean(val),
                                  },
                                }))
                              }
                            />
                          </TableCell>

                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>

                          <TableCell>
                            <Select
                              value={row.role}
                              disabled={isAlready}
                              onValueChange={(v) =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [u.email]: {
                                    ...row,
                                    role: v as Role,
                                  },
                                }))
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  Admin
                                </SelectItem>
                                <SelectItem value="manager">
                                  Manager
                                </SelectItem>
                                <SelectItem value="member">
                                  Member
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!hasSelection}
              onClick={submitExisting}
            >
              Add Selected Members
            </Button>
          </div>
        )}

        {/* NEW MEMBER MODE */}
        {mode === 'new' && (
          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              type="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm({ ...form, role: v as Role })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
            />

            <Input
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={(e) =>
                setForm({
                  ...form,
                  skills: e.target.value,
                })
              }
            />

            <Button
              className="w-full"
              disabled={
                !form.name ||
                !form.email ||
                !form.password
              }
              onClick={submitNew}
            >
              Add New Member
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
