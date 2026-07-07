import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message || 'Something went wrong';

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
    });
  }

  // console.error('Global Error Handler:', err);

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message,
  });
};
