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
  createdAt?: string;
  updatedAt?: string;
}

export interface TSprintStats {
  totalSprints: number;
  totalTasks: number;
  completedTasks: number;
}

export interface TProjectOverview {
  project: TProject;
  sprintStats: TSprintStats;
  progress: number;
}
