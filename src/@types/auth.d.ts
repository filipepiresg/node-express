import { JwtPayload } from 'jsonwebtoken';

export interface AuthJwtPayload extends JwtPayload {
  id: number;
  name: string;
}
