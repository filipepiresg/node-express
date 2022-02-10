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

/**
 * Dados necessários para criação do usuário
 */
export interface CreateUser {
  /**
   * Primeiro nome do usuário
   */
  firstName: string;
  /**
   * Segundo nome do usuário, não é requerido
   */
  lastName?: string;
  /**
   * Email do usuário
   */
  email: string;
  /**
   * Senha do usuário
   */
  password: string;
}

/**
 * Dados necessários para atualização do usuário
 */
export interface UpdateUser {
  /**
   * Primeiro nome do usuário, não é requerido
   */
  firstName?: string;
  /**
   * Segundo nome do usuário, não é requerido
   */
  lastName?: string;
  /**
   * Email do usuário, não é requerido
   */
  email?: string;
}

/**
 * Modelo de retorno do usuário
 */
export interface UserSchema {
  id?: number;
  firstName?: string;
  lastName?: string | null;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
