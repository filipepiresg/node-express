/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';

import { ErrorMessage } from '../middlewares/error';
import { CreateUser, UserAttributes } from './user';

export interface CRUD {
  create: (item: CreateUser) => Promise<UserAttributes>;
  read: (id: string) => Promise<UserAttributes>;
  readAll: () => Promise<UserAttributes[]>;
  update: (id: string, item: UserAttributes) => Promise<UserAttributes>;
  delete: (id: string) => Promise<UserAttributes>;
}
