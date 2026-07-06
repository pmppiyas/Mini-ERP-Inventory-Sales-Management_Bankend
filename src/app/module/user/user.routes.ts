import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { registerValidationSchema } from './user.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(registerValidationSchema),
  UserController.createUser
);

export const UserRoutes = router;
