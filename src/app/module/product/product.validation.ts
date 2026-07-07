import { z } from 'zod';
import { Types } from 'mongoose';

export const addProductValidationSchema = z.object({
  name: z
    .string({ error: 'Product name is required' })
    .trim()
    .min(2, { message: 'Product name must be at least 2 characters' }),

  sku: z
    .string({ error: 'SKU is required' })
    .trim()
    .min(3, { message: 'SKU must be at least 3 characters' }),

  category: z
    .string({ error: 'Category is required' })
    .refine((value) => Types.ObjectId.isValid(value), {
      message: 'Invalid category ID',
    }),

  purchasePrice: z
    .number({ error: 'Purchase price is required' })
    .min(0, { message: 'Purchase price cannot be negative' }),

  sellingPrice: z
    .number({ error: 'Selling price is required' })
    .min(0, { message: 'Selling price cannot be negative' }),

  stockQuantity: z
    .number({ error: 'Stock quantity is required' })
    .int({ message: 'Stock quantity must be an integer' })
    .min(0, { message: 'Stock quantity cannot be negative' }),

  productImage: z
    .string({ error: 'Product image is required' })
    .trim()
    .min(1, { message: 'Product image is required' }),
});
