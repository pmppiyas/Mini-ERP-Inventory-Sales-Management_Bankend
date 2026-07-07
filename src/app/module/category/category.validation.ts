import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({
      error: 'Category name is required',
    })
    .trim()
    .min(1, 'Category name is too short'),

  children: z
    .array(
      z.object({
        name: z
          .string({
            error: 'Category name is required',
          })
          .trim(),
      })
    )
    .optional(),

  parentId: z.string().optional(),
});
