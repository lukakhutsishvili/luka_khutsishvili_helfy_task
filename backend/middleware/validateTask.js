import { taskCreateSchema, taskUpdateSchema, listQuerySchema } from './schema.js';

function formatIssues(error) {
  return error.issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
  }));
}

function runBodyValidation(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: formatIssues(result.error),
      });
    }
    req.body = result.data;
    next();
  };
}

export const validateTaskCreate = runBodyValidation(taskCreateSchema);
export const validateTaskUpdate = runBodyValidation(taskUpdateSchema);

export function validateListQuery(req, res, next) {
  const result = listQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: formatIssues(result.error),
    });
  }
  req.validatedQuery = result.data;
  next();
}
