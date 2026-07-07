import { Router } from 'express';
import { PermissionController } from './permission.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';
import { validateRequest } from '../../middleware/validateRequest';
import {
  removePermissionValidationSchema,
  setPermissionValidationSchema,
} from './permission.validation';

const router = Router();

router.put(
  '/set',
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(setPermissionValidationSchema),
  PermissionController.setPermission
);

router.patch(
  '/remove',
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(removePermissionValidationSchema),
  PermissionController.removePermission
);

export const PermissionRoutes = router;
