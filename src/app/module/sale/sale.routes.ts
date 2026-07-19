import { Router } from 'express';
import { SaleController } from './sale.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';
import { createSaleValidationSchema } from './sale.validation';

const router = Router();

router.post(
  '/add',
  checkAuth(...Object.values(Role)),
  multerUpload.none(),
  validateRequest(createSaleValidationSchema),
  SaleController.createSale
);

router.get('/', checkAuth(...Object.values(Role)), SaleController.getSales);

export const SaleRoutes = router;
