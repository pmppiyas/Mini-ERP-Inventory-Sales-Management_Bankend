import { Document } from 'mongoose';
import { Permission } from '../permission/permission.constant';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export interface IAuths {
  provider: string;
  providerId: string;
}

export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCK = 'BLOCK',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role: Role;
  auths: IAuths[];
  status: IsActive;
  permissions: Permission[];
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: Role;
  status: IsActive;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(enteredPassword: string): Promise<boolean>;
}
