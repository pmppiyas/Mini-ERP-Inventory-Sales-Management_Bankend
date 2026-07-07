import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { Router } from 'express';
import { Role } from '../user/user,interface';
import { createCategorySchema } from './category.validation';
import { CategoryController } from './category.controller';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(createCategorySchema),
  CategoryController.createCategory
);

router.get('/all', CategoryController.getAllCategories);

router.put(
  '/update',
  checkAuth(Role.ADMIN, Role.MANAGER),
  validateRequest(updateCategorySchema),
  CategoryController.updateCategory
);

export const CategoryRoutes = router;
