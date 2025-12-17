import { z } from 'zod';

export const createFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(200),
  description: z.string().optional(),
});

export const updateFormSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateFormDto = z.infer<typeof createFormSchema>;
export type UpdateFormDto = z.infer<typeof updateFormSchema>;
