import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { CreateUser, UpdateUser } from '../@types/user';
import { ErrorMessage } from '../middlewares/error';
import { sequelize, UserModel } from '../models';

@Tags('Users')
@Route('/v1/users')
export default class UserController extends Controller {
  @Security('x-access-token')
  @SuccessResponse(201, 'Created')
  @Post()
  public async create(@Body() attributes: CreateUser) {
    const t = await sequelize.transaction();
    try {
      const newUser = await UserModel.create(attributes, { transaction: t });

      await newUser.addRole(1, { transaction: t });

      await t.commit();
      return newUser.toJSON();
    } catch (error: any) {
      await t.rollback();
      throw new ErrorMessage(400, error?.message || 'Something went wrong!');
    }
  }

  @Security('x-access-token')
  @Get('{id}')
  public async read(id: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }

      return user.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Security('x-access-token')
  @Get()
  public async readAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    try {
      const users = await UserModel.findAll({ limit, offset: (page - 1) * limit });

      return users.map((user) => user.toJSON());
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Security('x-access-token')
  @Patch('{id}')
  public async update(id: string, @Body() attributes: UpdateUser) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }
      const userUpdated = await user.update(attributes);

      return userUpdated.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Security('x-access-token')
  @Delete('{id}')
  public async delete(id: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }
      await user.destroy();

      return user.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }
}
