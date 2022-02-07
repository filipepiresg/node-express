import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { secret } from '../config/secret.json';
import { ErrorMessage } from './error';

export function verifyToken(request: Request, response: Response, next: NextFunction) {
  let error;
  try {
    const token = <string>request.headers['x-access-token'];

    if (!token) {
      error = new ErrorMessage(403, 'No token provided!');
      return response.status(error.status).json(error);
    }

    verify(token, secret, (err) => {
      if (err) {
        error = new ErrorMessage(401, 'No token provided!');
        return response.status(error.status).json(error);
      }
      return next();
    });

    throw new ErrorMessage(403, 'Token invalid!');
  } catch (err: any) {
    error = new ErrorMessage(500, err?.name || 'Internal Server Error', err?.message);
    return response.status(error.status).json(error);
  }
}
