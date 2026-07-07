import { Router } from 'express';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.post('/login', AuthController.credentialsLogin);

router.get('/getme', checkAuth(...Object.values(Role)), AuthController.getMe);

router.post('/logout', AuthController.logout);

export const AuthRoutes = router;
