import { Role } from '../user/user,interface';

export enum Permission {
  PERMISSION_GIVER = 'PERMISSION_GIVER',

  ADD_PRODUCT = 'ADD_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  VIEW_PRODUCT = 'VIEW_PRODUCT',

  ADD_USER = 'ADD_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  VIEW_USER = 'VIEW_USER',
}

export const managerGiveablePermissions: Permission[] = [
  Permission.VIEW_USER,
  Permission.ADD_PRODUCT,
  Permission.UPDATE_PRODUCT,
];

export const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: Object.values(Permission),

  MANAGER: [
    Permission.ADD_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.VIEW_PRODUCT,
  ],

  EMPLOYEE: [Permission.VIEW_PRODUCT],
};
