import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { secret } from '../config/secret.json';
import { ErrorMessage } from './error';

export function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  try {
    const token = <string>request.headers['x-access-token'];

    if (!token) {
      throw new ErrorMessage(403, 'No token provided!');
    }

    verify(token, secret, { algorithms: ['HS256'], complete: true }, (err) => {
      if (err) {
        throw new ErrorMessage(401, err.message);
      }
    });

    next();
  } catch (err: any) {
    next(err);
  }
}
