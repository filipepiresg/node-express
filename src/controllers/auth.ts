/* eslint-disable */
'use strict';

import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from 'tsoa';

import { AuthJwtPayload } from '../@types/auth';
import { secret } from '../config/secret.json';
import { ErrorMessage } from '../middlewares/error';
import { UserModel } from '../models';

@Tags('Authentication')
@Route('/v1/auth')
export default class AuthController extends Controller {
  @Post('login')
  public async login(@Body() data: { email: string; password: string }) {
    try {
      if (!data.email || !data.password) {
        throw new ErrorMessage(400, 'E-mail/password not provided!');
      }
      const user = await UserModel.findOne({
        where: {
          email: data.email,
        },
        attributes: ['password'],
      });

      if (!user) {
        throw new ErrorMessage(404, 'User not found!');
      }

      const isPasswordInvalid = await compare(data.password, user.getDataValue('password'));

      if (!isPasswordInvalid) {
        throw new ErrorMessage(401, 'Invalid password!');
      }

      const token = await jwt.sign(
        {
          id: user.getDataValue('id'),
          name: user.getDataValue('firstName'),
        },
        secret,
        {
          expiresIn: '72h',
          algorithm: 'HS256',
          header: {
            alg: 'HS256',
            typ: 'JWT',
          },
        }
      );

      return { token, user: user.toJSON() };
    } catch (error: any) {
      throw new ErrorMessage(
        error?.status || 400,
        error?.message || 'Something went wrong!',
        error?.details
      );
    }
  }

  @Security('x-access-token')
  @Get('renewToken')
  public async renewToken(@Request() token: string) {
    try {
      const decode = <AuthJwtPayload>jwt.decode(token, { json: true });

      if (!decode) {
        throw new ErrorMessage(403, 'No token provided!');
      }
      const user = await UserModel.findOne({
        where: {
          id: decode.id,
        },
      });
      if (!user) {
        throw new ErrorMessage(404, 'User not found!');
      }

      const newToken = await jwt.sign(
        {
          id: user.getDataValue('id'),
          name: user.getDataValue('firstName'),
        },
        secret,
        {
          expiresIn: '72h',
          algorithm: 'HS256',
          header: {
            alg: 'HS256',
            typ: 'JWT',
          },
        }
      );

      return { token: newToken, user: user.toJSON() };
    } catch (error: any) {
      throw new ErrorMessage(
        error?.status || 400,
        error?.message || 'Something went wrong!',
        error?.details
      );
    }
  }
}
