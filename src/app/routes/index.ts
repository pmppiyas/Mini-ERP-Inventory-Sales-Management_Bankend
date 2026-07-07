import { Router } from 'express';
import { UserRoutes } from '../module/user/user.routes';
import { AuthRoutes } from '../module/auth/auth.routes';
import { ProductRoutes } from '../module/product/product.routes';

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
