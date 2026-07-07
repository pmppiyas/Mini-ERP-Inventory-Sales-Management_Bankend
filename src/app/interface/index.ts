import { Role } from '../module/user/user,interface';

export interface IJwtPayload {
  userId: string;
  role: Role;
  email: string;
}
