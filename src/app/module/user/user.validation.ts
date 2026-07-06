import { z } from 'zod';

export const registerValidationSchema = z
  .object({
    name: z
      .string({ error: 'Name is required' })
      .trim()
      .min(2, { message: 'Name must be at least 2 characters' }),

    email: z
      .string({ error: 'Email is required' })
      .email({ message: 'Invalid email address' }),

    password: z
      .string({ error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),

    repeatPassword: z.string({
      error: 'Repeat password is required',
    }),

    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: 'Passwords do not match',
  });
