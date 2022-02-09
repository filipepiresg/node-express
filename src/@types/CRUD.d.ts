/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';

import { ErrorMessage } from '../middlewares/error';

export interface CRUD<C, T, U> {
  create: (item: C) => Promise<T>;
  read: (id: string) => Promise<T>;
  readAll: (limit?: number, page?: number) => Promise<T[]>;
  update: (id: string, item: U) => Promise<T>;
  delete: (id: string) => Promise<T>;
}
