import { taskCreateSchema, taskUpdateSchema, reorderSchema } from './schema.js';

function runValidation(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: result.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
}

export const validateTaskCreate = runValidation(taskCreateSchema);
export const validateTaskUpdate = runValidation(taskUpdateSchema);
export const validateReorder = runValidation(reorderSchema);
