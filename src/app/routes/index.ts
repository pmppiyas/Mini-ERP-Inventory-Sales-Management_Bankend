import { Router } from 'express';
import { UserRoutes } from '../module/user/user.routes';
import { AuthRoutes } from '../module/auth/auth.routes';
import { ProductRoutes } from '../module/product/product.routes';
import { PermissionRoutes } from '../module/permission/permission.routes';
import { CategoryRoutes } from '../module/category/category.routes';
import { SaleRoutes } from '../module/sale/sale.routes';

const router = Router();

interface IModuleRoutes {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoutes[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/permission',
    route: PermissionRoutes,
  },
  {
    path: '/sale',
    route: SaleRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
