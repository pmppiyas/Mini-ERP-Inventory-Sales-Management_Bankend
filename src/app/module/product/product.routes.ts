import { Router } from 'express';
import { ProductController } from './product.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.post('/add', checkAuth(Role.ADMIN), ProductController.addProduct);

router.put(
  '/:productId',
  checkAuth(Role.ADMIN, Role.MANAGER),
  ProductController.updateProduct
);

export const ProductRoutes = router;
