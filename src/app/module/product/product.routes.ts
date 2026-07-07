import { Router } from 'express';
import { ProductController } from './product.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.post('/add', checkAuth(Role.ADMIN), ProductController.addProduct);

export const ProductRoutes = router;
