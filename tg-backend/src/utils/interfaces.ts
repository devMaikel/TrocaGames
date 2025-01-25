interface IUserAuthReq {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface AuthenticatedRequest extends Request {
  user: IUserAuthReq;
}
