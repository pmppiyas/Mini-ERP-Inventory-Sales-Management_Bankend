import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { registerValidationSchema } from './user.validation';
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

export const UserRoutes = router;
