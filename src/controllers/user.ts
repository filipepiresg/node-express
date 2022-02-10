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
      await t.rollback();
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404)
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
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

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
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404)
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
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Response<ErrorResponse>(400)
  @Response<ErrorResponse>(404)
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
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }
}
