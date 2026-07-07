import { z } from 'zod';
import { Permission } from './permission.constant';

export const setPermissionValidationSchema = z.object({
  taker: z
    .string({ error: 'Taker ID is required' })
    .trim()
    .regex(/^[a-f\d]{24}$/i, {
      message: 'Invalid Taker ID',
    }),

  type: z
    .array(z.nativeEnum(Permission), {
      error: 'Permission list is required',
    })
    .min(1, {
      message: 'At least one permission is required',
    }),
});

export const removePermissionValidationSchema = z.object({
  userId: z
    .string({ error: 'User ID is required' })
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: 'Invalid User ID',
    }),

  type: z
    .array(z.nativeEnum(Permission), {
      error: 'Permission list is required',
    })
    .min(1, {
      message: 'At least one permission is required',
    }),
});
