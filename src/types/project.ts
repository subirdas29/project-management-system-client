export type TProjectStatus =
  | 'planned'
  | 'active'
  | 'completed'
  | 'archived';

export interface TProject {
  _id: string;
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  status: TProjectStatus;
  thumbnail?: string;
  createdBy?: string;
  taskStats: {
    total: number;
    completed: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TProjectOverview {
  project: TProject;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  sprints: {
    _id: string;
    title: string;
    sprintNumber: number;
  }[];
}
