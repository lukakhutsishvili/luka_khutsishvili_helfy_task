import { z } from 'zod';

const priorityEnum = z.enum(['low', 'medium', 'high']);


const dueDateSchema = z
  .union([z.iso.datetime(), z.string().length(0), z.null()])
  .optional();

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).optional().default(''),
  priority: priorityEnum.optional().default('medium'),
  dueDate: dueDateSchema,
});

export const taskUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    priority: priorityEnum.optional(),
    completed: z.boolean().optional(),
    dueDate: dueDateSchema,
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided',
  });

export const listQuerySchema = z.object({
  filter: z.enum(['all', 'pending', 'completed']).optional().default('all'),
  search: z.string().trim().max(200).optional().default(''),
  sort: z.enum(['date', 'priority', 'title']).optional().default('date'),
});
