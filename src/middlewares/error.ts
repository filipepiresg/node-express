import { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from '../@types/response';

export class ErrorMessage implements ErrorResponse {
  declare status: number;
  declare message: string;
  declare details?: object | string;

  constructor(status: number, message: string, details?: object | string) {
    this.status = status;
    this.message = message;
    this.details = details;
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ErrorMessage) {
    return res.status(err.status).json(err);
  }
  if (err instanceof Error) {
    const error = new ErrorMessage(500, 'Internal Server Error');
    return res.status(error.status).json(err);
  }

  next();
}
