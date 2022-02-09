import jwt, {
  DecodeOptions,
  JwtPayload,
  SignCallback,
  SignOptions,
  VerifyCallback,
  VerifyOptions,
} from 'jsonwebtoken';

import { AuthJwtPayload } from '../@types/auth';
import { secret } from '../config/secret.json';

export function generateJwt(
  payload: string | object | Buffer,
  options?: SignOptions,
  callback?: SignCallback
): void | string {
  const _options: SignOptions = {
    algorithm: 'HS256',
    header: {
      alg: 'HS256',
      typ: 'JWT',
    },
    ...options,
    expiresIn: '3d',
    notBefore: '-4d',
  };

  if (callback) {
    return jwt.sign(payload, secret, _options, callback);
  }
  return jwt.sign(payload, secret, _options);
}

export function verifyJwt(
  token: string,
  options?: VerifyOptions,
  callback?: VerifyCallback<JwtPayload | string>
): void | string | AuthJwtPayload {
  const _options: VerifyOptions = {
    algorithms: ['HS256'],
    maxAge: '4d',
    clockTimestamp: Math.floor(Date.now() / 1000),
    ...options,
    ignoreExpiration: false,
    ignoreNotBefore: false,
  };
  if (callback) {
    return jwt.verify(token, secret, { ..._options, complete: false }, callback);
  }
  return <AuthJwtPayload>jwt.verify(token, secret, { ..._options, complete: false });
}

export function decodeJwt(token: string, options?: DecodeOptions): AuthJwtPayload | null {
  const _options: DecodeOptions = {
    ...options,
    complete: false,
  };
  const payload = <AuthJwtPayload>jwt.decode(token, { ..._options, json: true });
  return payload;
}
