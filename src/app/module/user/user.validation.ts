import { z } from 'zod';

const userBaseSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' }),

  email: z
    .string({ error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  password: z
    .string({ error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),

  repeatPassword: z.string({
    error: 'Repeat password is required',
  }),

  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
});

export const registerValidationSchema = userBaseSchema.refine(
  (data) => data.password === data.repeatPassword,
  {
    path: ['repeatPassword'],
    message: 'Passwords do not match',
  }
);

export type RegisterFormValues = z.infer<typeof registerValidationSchema>;

export const updateUserValidationSchema = userBaseSchema
  .partial()
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),

    repeatPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (!data.password && !data.repeatPassword) return true;

      return data.password === data.repeatPassword;
    },
    {
      path: ['repeatPassword'],
      message: 'Passwords do not match',
    }
  );

export type UpdateUserFormValues = z.infer<typeof updateUserValidationSchema>;
