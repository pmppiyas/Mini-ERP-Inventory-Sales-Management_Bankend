import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message,
  });
};
