import { z } from 'zod';
import { Types } from 'mongoose';

export const createSaleValidationSchema = z
  .array(
    z.object({
      productId: z
        .string({ error: 'Product ID is required' })
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid product ID',
        }),

      quantity: z
        .coerce
        .number({ error: 'Quantity is required' })
        .int({ message: 'Quantity must be an integer' })
        .min(1, { message: 'Quantity must be at least 1' }),
    })
  )
  .min(1, { message: 'At least one product is required' });
