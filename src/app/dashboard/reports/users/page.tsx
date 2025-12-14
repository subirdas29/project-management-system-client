'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/userStore';


export default function AllUsersReportPage() {
  const snap = useSnapshot(userStore);

  useEffect(() => {
    userStore.getAllUsers();
  }, []);

  if (snap.loading) {
    return <p className="p-6">Loading users...</p>;
  }

  if (snap.list.length === 0) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        No users found
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Users Report
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snap.list.map((user) => (
          <Link
            key={user._id}
            href={`/dashboard/reports/users/${user._id}`}
            className="block border rounded-lg p-4 hover:bg-muted transition"
          >
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs capitalize mt-1">
              Role: {user.role}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
