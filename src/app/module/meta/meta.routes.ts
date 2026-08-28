import { Router } from 'express';
import { MetaController } from './meta.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.get('/', checkAuth(Role.ADMIN, Role.MANAGER), MetaController.getMeta);

export const MetaRoutes = router;
