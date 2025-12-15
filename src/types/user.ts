export type TUserRole = 'admin' | 'manager' | 'member';

export type TUser = {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;

  department?: string;
  skills?: string[];

  createdAt?: string;
  updatedAt?: string;
};
