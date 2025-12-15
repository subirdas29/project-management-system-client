export type TTeamRole = 'admin' | 'manager' | 'member';

export type TUserRef = {
  _id: string;
  name?: string;
  email?: string;
  role?: TTeamRole;
};

export type TTeamMember = {
  _id: string;

  projectId: string;
  userId: string | TUserRef; // populated বা raw id

  role: TTeamRole;
  department?: string;
  skills?: string[];

  createdAt?: string;
  updatedAt?: string;
};
