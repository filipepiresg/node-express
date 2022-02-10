import { JwtPayload } from 'jsonwebtoken';

/**
 * Payload cadastrado no JWT
 */
export interface AuthJwtPayload extends JwtPayload {
  /**
   * Id do usuário cadastrado
   */
  id: number;
  /**
   * Nome do usuário cadastrado
   */
  name: string;
}

/**
 * Parametros de login do usuario
 */
export interface LoginParams {
  /**
   * Email do usuário cadastrado
   */
  email: string;
  /**
   * Senha do usuário cadastrado
   */
  password: string;
}
