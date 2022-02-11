import * as Sentry from '@sentry/node';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { CRUD } from '../@types/CRUD';
import { ErrorResponse } from '../@types/response';
import { CreateUser, UpdateUser, UserSchema } from '../@types/user';
import { ErrorMessage } from '../middlewares/error';
import { sequelize, UserModel } from '../models';

@Tags('Users')
@Route('/users')
export default class UserController
  extends Controller
  implements CRUD<CreateUser, UserSchema, UpdateUser>
{
  /**
   * Função para criar o usuário na API e link com sua regra
   * @summary Cria usuário
   */
  @Security('x-access-token')
  @Response<ErrorResponse>(400)
  @SuccessResponse(201)
  @Post()
  public async create(@Body() attributes: CreateUser) {
    const t = await sequelize.transaction();
    try {
      const newUser = await UserModel.create(attributes, { transaction: t });

      await newUser.addRole(1, { transaction: t });

      await t.commit();

      const schema: UserSchema = {
        id: <number>newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: <string | null>newUser.lastName,
        createdAt: <Date>newUser.createdAt,
        updatedAt: <Date>newUser.updatedAt,
        deletedAt: <Date | null>newUser.deletedAt,
      };
      return schema;
    } catch (error: any) {
      Sentry.captureException(error);
      await t.rollback();
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  /**
   * Faz uma busca do usuário na API.
   * Caso não encontre, retorna um erro de [404](Not Found)
   * @param {string} id Identificador do usuário buscado
   * @summary Busca um usuário
   * @returns Usuário encontrado
   */
  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404, 'Caso o usuário não for encontrado')
  @Security('x-access-token')
  @Get('{id}')
  public async read(id: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new ErrorMessage(404, 'User not found');
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
      return schema;
    } catch (error: any) {
      Sentry.captureException(error);
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  /**
   * Traz uma lista de usuários registrados na API.
   * É retornado uma lista paginada.
   * @param {number} limit Quantidade de usuários por página
   * @param {number} page Número da página a ser retornada
   * @summary Lista de usuários com paginação
   * @returns Lista de usuários da API
   */
  @Response<ErrorResponse>(400)
  @Security('x-access-token')
  @Get()
  public async readAll(@Query('per_page') limit = 10, @Query('page') page = 1) {
    try {
      const users = await UserModel.findAll({ limit, offset: (page - 1) * limit });

      return users.map((user) => {
        const schema: UserSchema = {
          id: <number>user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: <string | null>user.lastName,
          createdAt: <Date>user.createdAt,
          updatedAt: <Date>user.updatedAt,
          deletedAt: <Date | null>user.deletedAt,
        };
        return schema;
      });
    } catch (error: any) {
      Sentry.captureException(error);
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  /**
   * Faz uma busca do usuário na API e o atualiza.
   * Caso não encontre, retorna um erro de [404](Not Found)
   * @param {string} id Identificador do usuário a ser atualizado
   * @summary Atualiza um usuário
   * @returns O novo usuário atualizado
   */
  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404, 'Caso o usuário não for encontrado')
  @Security('x-access-token')
  @Patch('{id}')
  public async update(id: string, @Body() attributes: UpdateUser) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }
      const userUpdated = await user.update(attributes);

      const schema: UserSchema = {
        id: <number>userUpdated.id,
        email: userUpdated.email,
        firstName: userUpdated.firstName,
        lastName: <string | null>userUpdated.lastName,
        createdAt: <Date>userUpdated.createdAt,
        updatedAt: <Date>userUpdated.updatedAt,
        deletedAt: <Date | null>userUpdated.deletedAt,
      };
      return schema;
    } catch (error: any) {
      Sentry.captureException(error);
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  /**
   * Faz uma busca do usuário na API e o atualiza.
   * Caso não encontre, retorna um erro de [404](Not Found)
   * @param {string} id Identificador do usuário a ser deletado
   * @summary Deleta um usuário
   * @returns  O usuário deletado
   */
  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404, 'Caso o usuário não for encontrado')
  @Security('x-access-token')
  @Delete('{id}')
  public async delete(id: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }
      await user.destroy();

      const schema: UserSchema = {
        id: <number>user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: <string | null>user.lastName,
        createdAt: <Date>user.createdAt,
        updatedAt: <Date>user.updatedAt,
        deletedAt: <Date | null>user.deletedAt,
      };
      return schema;
    } catch (error: any) {
      Sentry.captureException(error);
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }
}
