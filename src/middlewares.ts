import { NextFunction, Request, Response } from 'express';
import { MeasureError } from './types';

export const errorHandler = async (
  err: MeasureError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.error(err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }

  const formattedError: Omit<MeasureError, 'status_code'> = {
    error_code: err.error_code,
    error_description: err.error_description,
  };

  return res.status(err.status_code).json(formattedError);
};
