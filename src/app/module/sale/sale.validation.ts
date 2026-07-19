import { z } from 'zod';
import { Types } from 'mongoose';

export const createSaleValidationSchema = z
  .array(
    z.object({
      id: z
        .string({ error: 'Product ID is required' })
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid product ID',
        }),

      quantity: z
        .number({ error: 'Quantity is required' })
        .int({ message: 'Quantity must be an integer' })
        .min(1, { message: 'Quantity must be at least 1' }),

      sellingPrice: z
        .number({ error: 'Selling price is required' })
        .min(0, { message: 'Selling price cannot be negative' }),
    })
  )
  .min(1, { message: 'At least one product is required' });
