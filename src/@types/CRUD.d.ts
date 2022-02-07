/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';

import { ErrorMessage } from '../middlewares/error';

export interface CRUD<T, D> {
  create: (item: D) => Promise<T>;
  read: (id: string) => Promise<T>;
  readAll: () => Promise<T[]>;
  update: (id: string, item: T) => Promise<T>;
  delete: (id: string) => Promise<T>;
}
