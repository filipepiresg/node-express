/* eslint-disable no-unused-vars */

/**
 * Modelo para base de um CRUD para a API
 */
export interface CRUD<C, T, U> {
  create: (item: C) => Promise<T>;
  read: (id: string) => Promise<T>;
  readAll: (limit?: number, page?: number) => Promise<T[]>;
  update: (id: string, item: U) => Promise<T>;
  delete: (id: string) => Promise<T>;
}
