import { Router } from 'express';
import { ProductController } from './product.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';

const router = Router();

router.post(
  '/add',
  checkAuth(Role.ADMIN, Role.MANAGER),
  ProductController.addProduct
);

router.get(
  '/',
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE),
  ProductController.allProducts
);

router.get(
  '/:productId',
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE),
  ProductController.getProductById
);

router.put(
  '/:productId',
  checkAuth(Role.ADMIN, Role.MANAGER),
  ProductController.updateProduct
);

router.delete(
  '/:productId',
  checkAuth(Role.ADMIN, Role.MANAGER),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
