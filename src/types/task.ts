export type TTaskStatus = string;
export type TTaskPriority = string;

export type TUserRef = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

export type TTimeLog = {
  userId: string | TUserRef;
  hours: number;
  date: string;
};

export type TSubTask = {
  title: string;
  isDone?: boolean;
};

export type TAttachment = {
  url: string;
  type: 'image' | 'pdf';
};

export type TTaskActivity = {
  action: string;
  userId: string | TUserRef;
  createdAt: string;
};

export type TTask = {
  _id: string;

  title: string;
  description?: string;

  estimateHours?: number;
  loggedHours?: number;
  timeLogs?: TTimeLog[];

  projectId: string;
  sprintId: string | { _id: string };

  assignees?: (string | TUserRef)[];

  priority: TTaskPriority;
  status: TTaskStatus;

  dueDate?: string;
  attachments?: TAttachment[];
  subtasks?: TSubTask[];

  isDeleted?: boolean;
  activityLog?: TTaskActivity[];

  createdAt?: string;
  updatedAt?: string;
};
