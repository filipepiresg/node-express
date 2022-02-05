/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';

import { UserAttributes } from './user';

export interface CRUD {
  create: (request: Request, response: Response) => Promise<Response>;
  read: (request: Request, response: Response) => Promise<Response>;
  readAll: (request: Request, response: Response) => Promise<Response>;
  update: (request: Request, response: Response) => Promise<Response>;
  delete: (request: Request, response: Response) => Promise<Response>;
}
