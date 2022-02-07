import { Request, Response } from 'express';

import { ErrorMessage } from './error';

export function notFoundHandler(req: Request, res: Response) {
  const error = new ErrorMessage(404, 'Not found!', {
    path: req.path,
  });
  res.status(error.status).send(error);
}
