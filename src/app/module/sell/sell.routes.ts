import { Router } from 'express';
import { SellController } from './sell.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user,interface';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';
import { createSaleValidationSchema } from './sell.validation';

const router = Router();

router.post(
  '/add',
  checkAuth(...Object.values(Role)),
  multerUpload.none(),
  validateRequest(createSaleValidationSchema),
  SellController.createSell
);

export const SellRoutes = router;
