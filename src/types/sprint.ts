// types/sprint.ts
export interface Sprint {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  projectId?: string;
}
