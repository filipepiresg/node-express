'use strict';

import { compare } from 'bcryptjs';
import { Body, Controller, Get, Post, Request, Response, Route, Security, Tags } from 'tsoa';

import { AuthJwtPayload, LoginParams } from '../@types/auth';
import { ErrorResponse } from '../@types/response';
import { UserSchema } from '../@types/user';
import { ErrorMessage } from '../middlewares/error';
import { UserModel } from '../models';
import { decodeJwt, generateJwt } from '../utils/token';

@Tags('Authentication')
@Route('/auth')
export default class AuthController extends Controller {
  /**
   * Faz autenticação do usuário.
   * É feito login com os dados de e-mail e a senha.
   * @param {object} data
   * @param {string} data.email E-mail do usuário
   * @param {string} data.password Senha do usuário
   * @summary Autentica na API
   */
  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404)
  @Post('login')
  public async login(@Body() { email, password }: LoginParams): Promise<{
    token: string;
    user: UserSchema;
  }> {
    try {
      if (!email || !password) {
        throw new ErrorMessage(400, 'E-mail/password not provided!');
      }
      const user = await UserModel.findOne({
        where: {
          email,
        },
        attributes: ['password'],
      });

      if (!user) {
        throw new ErrorMessage(404, 'User not found!');
      }

      const isPasswordInvalid = await compare(password, user.getDataValue('password'));

      if (!isPasswordInvalid) {
        throw new ErrorMessage(401, 'Invalid password!');
      }

      const schema: UserSchema = {
        id: <number>user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: <string | null>user.lastName,
        createdAt: <Date>user.createdAt,
        updatedAt: <Date>user.updatedAt,
        deletedAt: <Date | null>user.deletedAt,
      };

      const token = generateJwt({
        id: schema.id,
        name: schema.firstName,
      });

      if (!token) {
        throw new ErrorMessage(500, 'Internal Server Error');
      }

      return { token, user: schema };
    } catch (error: any) {
      throw new ErrorMessage(
        error?.status || 400,
        error?.message || 'Something went wrong!',
        error?.details
      );
    }
  }

  /**
   * Faz a revalidação e renovação do usuário logado.
   * @summary Renova o token
   * @param {string} token Necessário ter autenticado uma primeira vez
   */
  @Security('x-access-token')
  @Response<ErrorResponse>(400)
  @Get('renewToken')
  public async renewToken(@Request() token: string): Promise<{
    token: string;
    user: UserSchema;
  }> {
    try {
      const decode = <AuthJwtPayload>decodeJwt(token);

      const user = await UserModel.findOne({
        where: {
          id: decode.id,
        },
      });
      if (!user) {
        throw new ErrorMessage(404, 'User not found!');
      }

      const schema: UserSchema = {
        id: <number>user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: <string | null>user.lastName,
        createdAt: <Date>user.createdAt,
        updatedAt: <Date>user.updatedAt,
        deletedAt: <Date | null>user.deletedAt,
      };

      const newToken = generateJwt({
        id: schema.id,
        name: schema.firstName,
      });

      if (!newToken) {
        throw new ErrorMessage(500, 'Internal Server Error');
      }

      return { token: newToken, user: schema };
    } catch (error: any) {
      throw new ErrorMessage(
        error?.status || 400,
        error?.message || 'Something went wrong!',
        error?.details
      );
    }
  }
}
