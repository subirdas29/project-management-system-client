'use client';

import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { teamStore } from '@/store/teamStore';

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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import AddTeamMemberModal from '@/components/ui/teamMemberModal/AddTeamMemberModal';

export default function TeamTable({
  projectId,
}: {
  projectId: string;
}) {
  const snap = useSnapshot(teamStore);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    department: '',
    skills: '',
  });

  useEffect(() => {
    teamStore.getProjectTeam(projectId);
  }, [projectId]);

  const startEdit = (m: any) => {
    setEditId(m._id);
    setEditForm({
      department: m.department || '',
      skills: m.skills?.join(', ') || '',
    });
  };

  const saveEdit = async (teamId: string) => {
    await teamStore.updateTeamMember(teamId, {
      department: editForm.department || '',
      skills: editForm.skills
        ? editForm.skills
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    });

    setEditId(null);
    setEditForm({ department: '', skills: '' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ department: '', skills: '' });
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          Team & Roles
        </h2>

        <Button onClick={() => setOpen(true)}>
          + Add Member
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {snap.list.map((m) => {
            const isEditing = editId === m._id;

            return (
              <TableRow key={m._id}>
                <TableCell>{m.userId.name}</TableCell>
                <TableCell>{m.userId.email}</TableCell>

         
                <TableCell>
                  <Select
                    defaultValue={m.role}
                    onValueChange={(v) =>
                      teamStore.updateTeamMember(
                        m._id,
                        { role: v },
                      )
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

                {/* DEPARTMENT */}
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editForm.department}
                      placeholder="Department"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          department: e.target.value,
                        })
                      }
                    />
                  ) : (
                    m.department || 'N/A'
                  )}
                </TableCell>

                {/* SKILLS */}
                <TableCell className="max-w-[200px]">
                  {isEditing ? (
                    <Input
                      value={editForm.skills}
                      placeholder="Skills (comma separated)"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          skills: e.target.value,
                        })
                      }
                    />
                  ) : m.skills?.length ? (
                    m.skills.join(', ')
                  ) : (
                    'N/A'
                  )}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(m._id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(m)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          teamStore.removeTeamMember(m._id)
                        }
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 p-3">
        <span className="text-sm text-muted-foreground">
          Page {snap.page}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={snap.page === 1}
          onClick={() =>
            teamStore.getProjectTeam(
              projectId,
              snap.page - 1,
            )
          }
        >
          Prev
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={
            snap.page * snap.limit >= snap.total
          }
          onClick={() =>
            teamStore.getProjectTeam(
              projectId,
              snap.page + 1,
            )
          }
        >
          Next
        </Button>
      </div>

      <AddTeamMemberModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
