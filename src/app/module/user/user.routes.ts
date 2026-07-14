import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {
  registerValidationSchema,
  updateUserValidationSchema,
} from './user.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from './user,interface';
import { multerUpload } from '../../config/multer.config';

const router = Router();

router.post(
  '/register',
  checkAuth(Role.ADMIN, Role.MANAGER),
  multerUpload.single('image'),
  validateRequest(registerValidationSchema),
  UserController.createUser
);

router.get('/', checkAuth(...Object.values(Role)), UserController.getAllUsers);

router.get(
  '/:id',
  checkAuth(...Object.values(Role)),
  UserController.getUserById
);

router.patch(
  '/:id',
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserValidationSchema),
  UserController.updateUser
);

router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.MANAGER),
  UserController.deleteUser
);

export const UserRoutes = router;
