import { Router } from 'express';
import { PermissionController } from './permission.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.post(
  '/set',
  checkAuth(Role.ADMIN, Role.MANAGER),
  PermissionController.setPermission
);

export const PermissionRoutes = router;
