import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User extends JwtPayload {
      userId: string;
      email: string;
      role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
