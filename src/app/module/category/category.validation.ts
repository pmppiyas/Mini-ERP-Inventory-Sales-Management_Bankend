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

export const updateCategorySchema = z
  .object({
    categoryId: z.string({
      error: 'Category ID is required',
    }),
    MODE: z.enum(['EDIT', 'MOVE']).refine((val) => !!val, {
      message: 'MODE must be either EDIT or MOVE',
    }),
    name: z.string().trim().min(1, 'Category name is too short').optional(),
    parentId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.MODE === 'EDIT') {
        return !!data.name;
      }
      return true;
    },
    {
      message: 'Name is required when MODE is EDIT',
      path: ['name'],
    }
  )
  .refine(
    (data) => {
      if (data.MODE === 'MOVE') {
        return !!data.parentId;
      }
      return true;
    },
    {
      message: 'Parent ID is required when MODE is MOVE',
      path: ['parentId'],
    }
  );
