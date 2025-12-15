export type TUserRef = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type TTaskComment = {
  _id: string;
  taskId: string;
  userId: string | TUserRef; 
  content: string;
  parentComment?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
