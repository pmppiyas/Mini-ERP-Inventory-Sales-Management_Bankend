import { Router } from 'express';
import { PermissionController } from './permission.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.put(
  '/set',
  checkAuth(Role.ADMIN, Role.MANAGER),
  PermissionController.setPermission
);

router.patch(
  '/remove',
  checkAuth(Role.ADMIN, Role.MANAGER),
  PermissionController.removePermission
);

export const PermissionRoutes = router;
