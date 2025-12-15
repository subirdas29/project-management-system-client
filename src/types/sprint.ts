// types/sprint.ts
export interface Sprint {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  projectId?: string;
}
