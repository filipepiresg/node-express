import { Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'lastName'> {}

export interface CreateUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}
