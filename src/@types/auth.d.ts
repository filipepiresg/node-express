import { JwtPayload } from 'jsonwebtoken';

export interface AuthJwtPayload extends JwtPayload {
  id: number;
  name: string;
}

export interface LoginParams {
  email: string;
  password: string;
}
